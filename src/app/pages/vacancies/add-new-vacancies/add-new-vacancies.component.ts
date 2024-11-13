import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { take, Subject, takeUntil } from 'rxjs';

import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { VacanciesService } from '../../../services/vacancies.service';

@Component({
  selector: 'app-add-new-vacancies',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ErrorToastComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './add-new-vacancies.component.html',
})
export class AddNewVacanciesComponent {
  private vacanciesService = inject(VacanciesService);
  private errorService = inject(ErrorHandlingService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  vacancyForm!: FormGroup;
  isLoading = false;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.vacancyForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      department: ['', Validators.required],
      description: this.fb.group({
        responsibilities: this.fb.array([]),
        requirements: this.fb.array([]),
        description: ['', Validators.required],
      }),
    });
  }

  get responsibilities() {
    return this.vacancyForm.get('description.responsibilities') as FormArray;
  }

  get requirements() {
    return this.vacancyForm.get('description.requirements') as FormArray;
  }

  addResponsibility(): void {
    this.responsibilities.push(this.fb.control('', Validators.required));
  }

  removeResponsibility(index: number): void {
    this.responsibilities.removeAt(index);
  }

  addRequirement(): void {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number): void {
    this.requirements.removeAt(index);
  }

  onSubmit(): void {
    if (this.vacancyForm.valid) {
      this.isLoading = true;
      const formValue = this.vacancyForm.value;

      this.vacanciesService
        .createVacancy(formValue)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/vacancies']);
          },
          error: (error) => {
            this.errorService.handleError(
              `Failed to create vacancy: ${error.message || 'Unknown error'}`
            );
            this.isLoading = false;
          },
        });
    } else {
      this.errorService.handleError('Please fill in all required fields');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
