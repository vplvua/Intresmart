import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Subject, take, takeUntil } from 'rxjs';

import { ButtonComponent } from '../../../shared/button/button.component';
import { VacanciesService } from '../../../services/vacancies.service';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import {
  VacancyApplicationFormData,
  VacancyApplicationService,
} from '../../../services/vacancy-application.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-vacancy',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    RouterLink,
    LoaderComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './vacancy.component.html',
})
export class VacancyComponent {
  private route = inject(ActivatedRoute);
  private vacanciesService = inject(VacanciesService);
  private vacancyApplicationService = inject(VacancyApplicationService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  isLoggedIn$ = this.authService.user$;
  applicationForm!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  vacancy$ = this.vacanciesService.vacancies$.pipe(
    map((vacancies) => {
      const slug = this.route.snapshot.paramMap.get('slug');
      return vacancies.find((v) => v.slug === slug);
    }),
    takeUntil(this.destroy$)
  );

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (!file.type.match('application/pdf')) {
        this.submitError = 'Please upload a PDF document';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.submitError = 'File size should not exceed 5MB';
        return;
      }
      this.selectedFile = file;
      this.submitError = null;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.submitError = 'Please upload your CV';
      return;
    }

    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      this.vacancy$.pipe(take(1)).subscribe((vacancy) => {
        if (vacancy) {
          const formData = {
            ...this.applicationForm.value,
            cv: this.selectedFile!,
            vacancy: {
              id: vacancy.id,
              title: vacancy.title,
            },
          };

          this.vacancyApplicationService
            .submitApplication(formData)
            .pipe(take(1))
            .subscribe({
              next: (response) => {
                this.isSubmitting = false;
                this.submitSuccess = true;
                this.applicationForm.reset();
                this.selectedFile = null;
              },
              error: (error) => {
                this.isSubmitting = false;
                this.submitError = error.message;
              },
            });
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
