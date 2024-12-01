import { Injectable, inject } from '@angular/core';
import { Observable, from, map, catchError, of, tap, switchMap } from 'rxjs';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

import { ContactInfo } from '../models/models';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ContactInfoService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private readonly CONTACT_DOC_ID = 'contact-info';

  constructor() {}

  getContactInfo(): Observable<ContactInfo> {
    const docRef = doc(this.firestore, 'settings', this.CONTACT_DOC_ID);
    return from(getDoc(docRef)).pipe(
      map((doc) => {
        if (doc.exists()) {
          return doc.data() as ContactInfo;
        }
        return this.getDefaultContactInfo();
      }),
      catchError(() => of(this.getDefaultContactInfo()))
    );
  }

  updateContactInfo(info: Partial<ContactInfo>): Observable<void> {
    const docRef = doc(this.firestore, 'settings', this.CONTACT_DOC_ID);

    // Clean up the social links object
    const cleanSocialLinks = info.socialLinks
      ? Object.entries(info.socialLinks).reduce((acc, [key, value]) => {
          if (value && value.trim() !== '') {
            acc[key] = value.trim();
          }
          return acc;
        }, {} as Record<string, string>)
      : {};

    // Prepare clean data for update
    const cleanData = {
      ...info,
      socialLinks: cleanSocialLinks,
    };

    // Remove undefined or empty properties
    Object.keys(cleanData).forEach((key) => {
      if (
        (cleanData as any)[key] === undefined ||
        (cleanData as any)[key] === ''
      ) {
        delete (cleanData as any)[key];
      }
    });

    return from(setDoc(docRef, cleanData, { merge: true }));
  }

  uploadDocument(
    file: File,
    type: 'termsAndConditions' | 'privacyPolicy'
  ): Observable<string> {
    const path = `documents/${type}/${file.name}`;
    const storageRef = ref(this.storage, path);

    return from(uploadBytes(storageRef, file)).pipe(
      switchMap(() => from(getDownloadURL(storageRef))),
      tap((url) => {
        const update = {
          documents: {
            [type]: url,
          },
        };
        this.updateContactInfo(update).subscribe();
      })
    );
  }

  deleteDocument(
    type: 'termsAndConditions' | 'privacyPolicy'
  ): Observable<void> {
    return this.getContactInfo().pipe(
      switchMap((info) => {
        const url = info.documents?.[type];
        if (!url) {
          return of(undefined);
        }

        // Get the file path from the URL
        const path = this.getPathFromUrl(url);
        if (!path) {
          return of(undefined);
        }

        const storageRef = ref(this.storage, path);
        return from(deleteObject(storageRef)).pipe(
          switchMap(() => {
            const update = {
              documents: {
                [type]: null,
              },
            };
            return this.updateContactInfo(update);
          })
        );
      })
    );
  }

  private getPathFromUrl(url: string): string | null {
    try {
      const decodedUrl = decodeURIComponent(url);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');
      return startIndex > -1 && endIndex > -1
        ? decodedUrl.substring(startIndex, endIndex)
        : null;
    } catch {
      return null;
    }
  }

  private getDefaultContactInfo(): ContactInfo {
    return {
      phone: '',
      email: '',
      socialLinks: {},
      documents: {},
    };
  }
}
