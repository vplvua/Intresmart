import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private functions: Functions = inject(Functions);

  subscribeToNewsletter(
    email: string
  ): Observable<{ success: boolean; message: string }> {
    const callable = httpsCallable(this.functions, 'subscribeToNewsletter');

    return from(callable({ email })).pipe(
      map((result: any) => ({
        success: true,
        message: 'Successfully subscribed to newsletter',
      })),
      catchError((error) => {
        console.error('Error subscribing to newsletter:', error);
        throw new Error('Failed to subscribe. Please try again later.');
      })
    );
  }
}
