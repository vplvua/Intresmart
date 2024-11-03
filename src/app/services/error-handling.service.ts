import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  handleError(error: any): void {
    const message = error?.message || 'An error occurred';
    this.errorSubject.next(message);
  }
}
