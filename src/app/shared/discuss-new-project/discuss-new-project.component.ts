import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../button/button.component';
import { ArrowButtonComponent } from '../arrow-button/arrow-button.component';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-discuss-new-project',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './discuss-new-project.component.html',
})
export class DiscussNewProjectComponent {
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  projectForm: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      this.contactService.sendContactForm(this.projectForm.value).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.projectForm.reset();
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
