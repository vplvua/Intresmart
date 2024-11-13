import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  company?: string;
  phone?: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private functions: Functions = inject(Functions);

  sendContactForm(
    formData: ContactFormData
  ): Observable<{ success: boolean; message: string }> {
    const callable = httpsCallable(this.functions, 'sendEmail');

    return from(callable(formData)).pipe(
      map((result: any) => ({
        success: true,
        message: 'Message sent successfully',
      })),
      catchError((error) => {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message. Please try again later.');
      })
    );
  }
}
