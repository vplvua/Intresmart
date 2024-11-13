import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { IconComponent } from '../../shared/icon/icon.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    IconComponent,
    ArrowButtonComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private router = inject(Router);
  private newsletterService = inject(NewsletterService);
  private fb = inject(FormBuilder);

  subscribeForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor() {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onUpperButtonClick() {
    this.router.navigate(['/contacts']);
  }

  onSubscribe() {
    if (this.subscribeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      const email = this.subscribeForm.get('email')?.value;

      this.newsletterService.subscribeToNewsletter(email).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.subscribeForm.reset();
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = error.message;
          setTimeout(() => {
            this.submitError = null;
          }, 3000);
        },
      });
    } else {
      if (this.subscribeForm.get('email')?.errors) {
        this.submitError = 'Please enter a valid email address';
        setTimeout(() => {
          this.submitError = null;
        }, 3000);
      }
    }
  }
}
