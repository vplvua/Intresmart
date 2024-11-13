import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

export interface VacancyApplicationFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  cv: File;
  vacancy: {
    id: string;
    title: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class VacancyApplicationService {
  private functions: Functions = inject(Functions);
  private storage: Storage = inject(Storage);

  submitApplication(
    formData: VacancyApplicationFormData
  ): Observable<{ success: boolean; message: string }> {
    const cvFile = formData.cv;
    const filePath = `cv/${Date.now()}_${cvFile.name}`;
    const fileRef = ref(this.storage, filePath);

    return from(uploadBytes(fileRef, cvFile)).pipe(
      switchMap((snapshot) => getDownloadURL(snapshot.ref)),
      switchMap((cvFileUrl) => {
        const callable = httpsCallable(
          this.functions,
          'sendVacancyApplication'
        );
        const applicationData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          vacancy: formData.vacancy,
          cvFileUrl,
        };

        return callable(applicationData);
      }),
      map((result: any) => ({
        success: true,
        message: 'Application submitted successfully',
      })),
      catchError((error) => {
        console.error('Error submitting application:', error);
        throw new Error(
          'Failed to submit application. Please try again later.'
        );
      })
    );
  }
}
