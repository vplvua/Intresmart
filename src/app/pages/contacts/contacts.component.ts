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
import { ContactInfoService } from '../../services/contact-info.service';
import { AuthService } from '../../services/auth.service';
import { ContactInfo } from '../../models/models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ButtonComponent, ArrowButtonComponent, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  private contactService = inject(ContactService);
  private contactInfoService = inject(ContactInfoService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  contactInfoForm!: FormGroup;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;
  isAdmin = false;
  contactInfo: ContactInfo | null = null;

  constructor() {
    this.initForms();
    this.authService.user$.subscribe((user) => {
      this.isAdmin = !!user;
    });
  }

  ngOnInit() {
    this.loadContactInfo();
  }

  private initForms() {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      company: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });

    this.contactInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      linkedin: [''],
      instagram: [''],
      facebook: [''],
      youtube: [''],
    });
  }

  private loadContactInfo() {
    this.contactInfoService.getContactInfo().subscribe((info) => {
      this.contactInfo = info;
      this.contactInfoForm.patchValue({
        email: info.email,
        phone: info.phone,
        linkedin: info.socialLinks.linkedin,
        instagram: info.socialLinks.instagram,
        facebook: info.socialLinks.facebook,
        youtube: info.socialLinks.youtube,
      });
    });
  }

  saveContactInfo() {
    if (this.contactInfoForm.valid) {
      const formValue = this.contactInfoForm.value;
      const updateData: Partial<ContactInfo> = {
        email: formValue.email?.trim(),
        phone: formValue.phone?.trim(),
        socialLinks: {
          linkedin: formValue.linkedin?.trim() || '',
          instagram: formValue.instagram?.trim() || '',
          facebook: formValue.facebook?.trim() || '',
          youtube: formValue.youtube?.trim() || '',
        },
      };

      this.contactInfoService.updateContactInfo(updateData).subscribe({
        next: () => {
          this.loadContactInfo();
          // Show success message
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error updating contact info:', error);
          this.submitError = 'Failed to update contact information';
          setTimeout(() => {
            this.submitError = null;
          }, 3000);
        },
      });
    }
  }

  deleteDocument(type: 'termsAndConditions' | 'privacyPolicy') {
    if (confirm('Are you sure you want to delete this document?')) {
      this.contactInfoService.deleteDocument(type).subscribe({
        next: () => {
          this.loadContactInfo();
          // Show success message
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
          }, 3000);
        },
        error: (error) => {
          console.error(`Error deleting ${type}:`, error);
          this.submitError = 'Failed to delete document';
          setTimeout(() => {
            this.submitError = null;
          }, 3000);
        },
      });
    }
  }

  onTermsFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.contactInfoService
        .uploadDocument(file, 'termsAndConditions')
        .subscribe();
    }
  }

  onPrivacyFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.contactInfoService.uploadDocument(file, 'privacyPolicy').subscribe();
    }
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
