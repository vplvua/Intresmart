import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-learn-more',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './learn-more.component.html',
})
export class LearnMoreComponent {
  private newsletterService = inject(NewsletterService);
  private fb = inject(FormBuilder);

  subscriptionForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor() {
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.subscriptionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      const email = this.subscriptionForm.get('email')?.value;

      this.newsletterService.subscribeToNewsletter(email).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.subscriptionForm.reset();
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
    }
  }
}
