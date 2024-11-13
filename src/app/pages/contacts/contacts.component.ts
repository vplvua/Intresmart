import { Component, inject, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ButtonComponent, ArrowButtonComponent, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);
  contactForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      this.contactService.sendContactForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = error.message;
        },
      });
    }
  }
}
