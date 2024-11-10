import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil, switchMap, take } from 'rxjs';

import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { VacanciesService } from '../../../services/vacancies.service';
import { Vacancy } from '../../../models/models';

@Component({
  selector: 'app-edit-vacancy',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    ErrorToastComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './edit-vacancy.component.html',
})
export class EditVacancyComponent implements OnInit {
  private vacanciesService = inject(VacanciesService);
  private errorService = inject(ErrorHandlingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  vacancyForm!: FormGroup;
  isLoading = false;
  currentVacancy?: Vacancy;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) =>
          this.vacanciesService.getVacancyBySlug(params['slug'])
        )
      )
      .subscribe({
        next: (vacancy) => {
          if (vacancy) {
            this.currentVacancy = vacancy;
            this.populateForm(vacancy);
          } else {
            this.errorService.handleError('Vacancy not found');
            this.router.navigate(['/vacancies']);
          }
        },
        error: (error) => {
          this.errorService.handleError('Failed to load vacancy');
          this.router.navigate(['/vacancies']);
        },
      });
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

  private populateForm(vacancy: Vacancy): void {
    while (this.responsibilities.length) {
      this.responsibilities.removeAt(0);
    }
    while (this.requirements.length) {
      this.requirements.removeAt(0);
    }

    this.vacancyForm.patchValue({
      title: vacancy.title,
      date: vacancy.date,
      department: vacancy.department,
      description: {
        description: vacancy.description.description,
      },
    });

    vacancy.description.responsibilities.forEach((responsibility) => {
      this.responsibilities.push(
        this.fb.control(responsibility, Validators.required)
      );
    });

    vacancy.description.requirements.forEach((requirement) => {
      this.requirements.push(this.fb.control(requirement, Validators.required));
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
    if (this.vacancyForm.valid && this.currentVacancy?.id) {
      this.isLoading = true;
      const formValue = this.vacancyForm.value;

      this.vacanciesService
        .updateVacancy(this.currentVacancy.id, formValue)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/vacancies']);
          },
          error: (error) => {
            this.errorService.handleError(
              `Failed to update vacancy: ${error.message || 'Unknown error'}`
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
