import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { ButtonComponent } from '../../../shared/button/button.component';
import {
  Case,
  CaseFileUrls,
  CaseFormData,
  CaseFormGroup,
} from '../../../models/models';
import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { CasesService } from '../../../services/cases.service';

@Component({
  selector: 'app-add-new-case',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    ErrorToastComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './add-new-case.component.html',
})
export class AddNewCaseComponent {
  private casesService = inject(CasesService);
  private errorService = inject(ErrorHandlingService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  caseForm!: CaseFormGroup;

  isLoading = false;
  uploadProgress$ = new BehaviorSubject<number>(0);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.caseForm = this.fb.group<{
      title: FormControl<string>;
      launch: FormControl<string>;
      tag: FormControl<string>;
      textFields: FormArray<FormControl<string>>;
      mainImg: FormControl<File | null>;
      sideImg: FormControl<File | null>;
      imageCard: FormControl<File | null>;
      video: FormControl<File | null>;
      svg: FormControl<File | null>;
    }>({
      title: this.fb.nonNullable.control('', Validators.required),
      launch: this.fb.nonNullable.control('', Validators.required),
      tag: this.fb.nonNullable.control('', Validators.required),
      textFields: this.fb.nonNullable.array([
        this.fb.nonNullable.control('', Validators.required),
      ]),
      mainImg: this.fb.control<File | null>(null, Validators.required),
      sideImg: this.fb.control<File | null>(null, Validators.required),
      imageCard: this.fb.control<File | null>(null, Validators.required),
      video: this.fb.control<File | null>(null),
      svg: this.fb.control<File | null>(null),
    });
  }

  get textFields() {
    return this.caseForm.get('textFields') as FormArray;
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (this.validateFile(file)) {
        this.caseForm.get(field)?.setValue(file);
      } else {
        // Reset input
        input.value = '';
        this.caseForm.get(field)?.setValue(null);
      }
    }
  }

  private validateFile(file: File): boolean {
    if (!file) return true;

    if (file.size > this.MAX_FILE_SIZE) {
      this.errorService.handleError(
        `File ${file.name} is too large. Maximum size is 2MB`
      );
      return false;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'video/mp4',
    ];
    if (!allowedTypes.includes(file.type)) {
      this.errorService.handleError(
        `File ${file.name} has unsupported type. Allowed types are: JPG, PNG, SVG, MP4`
      );
      return false;
    }

    return true;
  }

  private prepareCaseData(
    formValue: CaseFormData,
    urlsObject: CaseFileUrls
  ): Partial<Case> {
    const { mainImgUrl = '', sideImgUrl = '' } = urlsObject;

    return {
      title: formValue.title,
      launch: formValue.launch,
      tag: formValue.tag,
      home: false,
      homePage: {
        imageUrl: mainImgUrl,
        title: formValue.title,
      },
      imageCardUrl: urlsObject.imageCardUrl || '',
      imageCardSvg: urlsObject.imageCardSvg || '',
      videoUrl: urlsObject.videoUrl || '',
      page: {
        mainImgUrl,
        sideImgUrl,
        textField: formValue.textFields.filter((text) => text.trim() !== ''),
      },
    };
  }

  onSubmit(): void {
    if (this.caseForm.valid) {
      this.isLoading = true;
      this.uploadProgress$.next(0);

      const formValue = {
        title: this.caseForm.value.title,
        launch: this.caseForm.value.launch,
        tag: this.caseForm.value.tag,
        textFields: this.caseForm.value.textFields,
        mainImg: this.caseForm.value.mainImg,
        sideImg: this.caseForm.value.sideImg,
        imageCard: this.caseForm.value.imageCard,
        video: this.caseForm.value.video,
        svg: this.caseForm.value.svg,
      } as CaseFormData;

      const files = {
        mainImg: formValue.mainImg || undefined,
        sideImg: formValue.sideImg || undefined,
        imageCard: formValue.imageCard || undefined,
        video: formValue.video || undefined,
        svg: formValue.svg || undefined,
      };

      // Validate all files before upload
      if (!this.validateAllFiles(files)) {
        this.isLoading = false;
        return;
      }

      this.casesService
        .uploadFiles(files)
        .pipe(
          take(1),
          takeUntil(this.destroy$),
          map((urlsObject) => {
            const caseData = this.prepareCaseData(formValue, urlsObject);
            return caseData;
          }),
          switchMap((caseData) => {
            if (!caseData) {
              throw new Error('Failed to prepare case data');
            }
            return this.casesService.createCase(caseData).pipe(
              take(1),
              switchMap(() => this.casesService.cases$),
              map((cases) => cases.find((c) => c.title === caseData.title)),
              tap((newCase) => {
                if (newCase?.slug) {
                  this.uploadProgress$.next(100);
                  this.router.navigate(['/cases', newCase?.slug]);
                }
              })
            );
          }),
          catchError((error) => {
            this.errorService.handleError(
              `Failed to create case: ${error.message || 'Unknown error'}`
            );
            throw error;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          error: (error) => {
            console.error('Subscription error:', error);
            this.isLoading = false;
          },
          complete: () => {},
        });
    }
  }

  private validateAllFiles(files: Record<string, File | undefined>): boolean {
    return Object.entries(files)
      .filter(([_, file]) => file !== null)
      .every(([_, file]) => this.validateFile(file as File));
  }

  addTextField(): void {
    this.textFields.push(this.fb.control('', Validators.required));
  }

  removeTextField(index: number): void {
    if (this.textFields.length > 1) {
      this.textFields.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    this.uploadProgress$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
