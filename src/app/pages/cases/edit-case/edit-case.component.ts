import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Subject,
  takeUntil,
  switchMap,
  tap,
  BehaviorSubject,
  map,
  catchError,
  finalize,
  take,
} from 'rxjs';

import { CasesService } from '../../../services/cases.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';
import {
  Case,
  CaseFileUrls,
  CaseFormData,
  CaseFormGroup,
} from '../../../models/models';
import { ErrorHandlingService } from '../../../services/error-handling.service';

@Component({
  selector: 'app-edit-case',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    ErrorToastComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-case.component.html',
})
export class EditCaseComponent implements OnInit, OnDestroy {
  private casesService = inject(CasesService);
  private errorService = inject(ErrorHandlingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  caseForm!: CaseFormGroup;
  currentCase?: Case;
  isLoading = false;
  uploadProgress$ = new BehaviorSubject<number>(0);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  ngOnInit(): void {
    this.initForm();

    this.route.params
      .pipe(
        switchMap((params) =>
          this.casesService.cases$.pipe(
            map((cases) => cases.find((c) => c.slug === params['slug']))
          )
        ),
        tap((caseItem) => {
          if (caseItem) {
            this.currentCase = caseItem;
            this.patchFormValues(caseItem);
          } else {
            this.router.navigate(['/cases']);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
      mainImg: this.fb.control<File | null>(null),
      sideImg: this.fb.control<File | null>(null),
      imageCard: this.fb.control<File | null>(null),
      video: this.fb.control<File | null>(null),
      svg: this.fb.control<File | null>(null),
    });
  }

  get textFields() {
    return this.caseForm.get('textFields') as FormArray;
  }

  private patchFormValues(caseItem: Case): void {
    this.caseForm.patchValue({
      title: caseItem.title || '',
      launch: caseItem.launch || '',
      tag: caseItem.tag || '',
    });

    while (this.textFields.length !== 0) {
      this.textFields.removeAt(0);
    }

    const paragraphs = caseItem.page?.textField || [''];
    paragraphs.forEach((text) => {
      this.textFields.push(this.fb.control(text, Validators.required));
    });
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (this.validateFile(file)) {
        this.caseForm.get(field)?.setValue(file);
      } else {
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
    urlsObject: CaseFileUrls,
    currentCase: Case
  ): Partial<Case> {
    return {
      id: currentCase.id,
      title: formValue.title,
      launch: formValue.launch,
      slug: currentCase.slug,
      tag: formValue.tag,
      home: currentCase.home,
      homePage: {
        ...currentCase.homePage,
        // imageUrl: urlsObject.mainImgUrl || currentCase.homePage?.imageUrl || '',
        // title: formValue.title,
      },
      imageCardUrl: urlsObject.imageCardUrl || currentCase.imageCardUrl || '',
      imageCardSvg: urlsObject.imageCardSvg || currentCase.imageCardSvg || '',
      videoUrl: urlsObject.videoUrl || currentCase.videoUrl || '',
      page: {
        mainImgUrl: urlsObject.mainImgUrl || currentCase.page?.mainImgUrl || '',
        sideImgUrl: urlsObject.sideImgUrl || currentCase.page?.sideImgUrl || '',
        textField: formValue.textFields.filter((text) => text.trim() !== ''),
      },
    };
  }

  onSubmit(): void {
    if (this.caseForm.valid && this.currentCase?.id) {
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

      if (!this.validateAllFiles(files)) {
        this.isLoading = false;
        return;
      }

      const hasFiles = Object.values(files).some((file) => file);

      if (hasFiles) {
        this.casesService
          .uploadFiles(files)
          .pipe(
            take(1),
            takeUntil(this.destroy$),
            map((urlsObject) => {
              const caseData = this.prepareCaseData(
                formValue,
                urlsObject,
                this.currentCase!
              );
              return caseData;
            }),
            switchMap((caseData) => {
              if (!caseData) {
                throw new Error('Failed to prepare case data');
              }
              if (this.currentCase?.id) {
                return this.casesService
                  .updateCase(this.currentCase.id, caseData)
                  .pipe(
                    switchMap(() => this.casesService.cases$),
                    map((cases) =>
                      cases.find((c) => c.id === this.currentCase?.id)
                    ),
                    tap((updatedCase) => {
                      if (updatedCase?.slug) {
                        this.currentCase = updatedCase;
                        this.uploadProgress$.next(100);
                        this.router.navigate(['/cases', updatedCase.slug]);
                      }
                    })
                  );
              } else {
                throw new Error('Current case ID is undefined');
              }
            }),
            tap(() => {
              this.uploadProgress$.next(100);
              this.router.navigate(['/cases', this.currentCase!.slug]);
            }),
            catchError((error) => {
              this.errorService.handleError(
                `Failed to update case: ${error.message || 'Unknown error'}`
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
          });
      } else {
        const caseData = this.prepareCaseData(
          formValue,
          {} as CaseFileUrls,
          this.currentCase!
        );

        this.casesService
          .updateCase(this.currentCase!.id, caseData)
          .pipe(
            take(1),
            takeUntil(this.destroy$),
            switchMap(() => this.casesService.cases$),
            map((cases) => cases.find((c) => c.id === this.currentCase?.id)),
            tap((updatedCase) => {
              if (updatedCase?.slug) {
                this.currentCase = updatedCase;
                this.uploadProgress$.next(100);
                this.router.navigate(['/cases', updatedCase.slug]);
              }
            }),
            catchError((error) => {
              this.errorService.handleError(
                `Failed to update case: ${error.message || 'Unknown error'}`
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
          });
      }
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
