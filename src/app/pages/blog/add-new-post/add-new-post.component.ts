import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  ReactiveFormsModule,
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

import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { BlogService } from '../../../services/blog.service';
import {
  BlogPostFileUrls,
  BlogPostFormData,
  BlogPostFormGroup,
  BlogPost,
  ContentField,
  Article,
} from '../../../models/models';
import { SlugService } from '../../../services/slug.service';

@Component({
  selector: 'app-add-new-post',
  standalone: true,
  imports: [
    CommonModule,
    ErrorToastComponent,
    ButtonComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './add-new-post.component.html',
})
export class AddNewPostComponent {
  private blogService = inject(BlogService);
  private slugService = inject(SlugService);
  private errorService = inject(ErrorHandlingService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  blogPostForm!: FormGroup;

  isLoading = false;
  uploadProgress$ = new BehaviorSubject<number>(0);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.blogPostForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      date: ['', Validators.required],
      author: ['', Validators.required],
      content: this.fb.array([]),
      mainImg: [null, Validators.required],
      imageCard: [null, Validators.required],
    });
  }

  get content() {
    return this.blogPostForm.get('content') as FormArray;
  }

  addHeader(): void {
    const headerGroup = this.fb.group({
      type: ['header'],
      value: ['', Validators.required],
    });
    this.content.push(headerGroup);
  }

  addParagraph(): void {
    const paragraphGroup = this.fb.group({
      type: ['text'],
      value: ['', Validators.required],
    });
    this.content.push(paragraphGroup);
  }

  removeContent(index: number): void {
    this.content.removeAt(index);
  }

  onFileSelected(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (this.validateFile(file)) {
        this.blogPostForm.get(field)?.setValue(file);
      } else {
        input.value = '';
        this.blogPostForm.get(field)?.setValue(null);
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.errorService.handleError(
        `File ${file.name} has unsupported type. Allowed types are: JPG, PNG, SVG`
      );
      return false;
    }

    return true;
  }

  private prepareArticleContent(contentControls: any[]): Article[] {
    return contentControls.map((control) => {
      const { type, value } = control;
      return type === 'header' ? { header: value } : { text: value };
    });
  }

  private preparePostData(
    formValue: any,
    urlsObject: BlogPostFileUrls
  ): Partial<BlogPost> {
    const { mainImgUrl = '', cardImgUrl = '' } = urlsObject;

    return {
      title: formValue.title,
      subtitle: formValue.subtitle,
      date: formValue.date,
      author: formValue.author,
      cardImgUrl: urlsObject.cardImgUrl || '',
      content: {
        mainImgUrl: urlsObject.mainImgUrl || '',
        article: this.prepareArticleContent(
          formValue.content.map((item: any) => ({
            type: item.type,
            value: item.value.trim(),
          }))
        ),
      },
    };
  }

  onSubmit(): void {
    if (this.blogPostForm.valid) {
      this.isLoading = true;
      this.uploadProgress$.next(0);

      const formValue = this.blogPostForm.value;
      const files = {
        mainImg: formValue.mainImg,
        imageCard: formValue.imageCard,
      };

      if (!this.validateAllFiles(files)) {
        this.isLoading = false;
        return;
      }

      this.blogService
        .uploadFiles(files)
        .pipe(
          take(1),
          takeUntil(this.destroy$),
          map((urlsObject) => this.preparePostData(formValue, urlsObject)),
          switchMap((postData) => {
            if (!postData) {
              throw new Error('Failed to prepare post data');
            }
            return this.blogService.createPost(postData).pipe(
              take(1),
              switchMap(() => this.blogService.posts$),
              map((posts) => posts.find((p) => p.title === postData.title)),
              tap((newPost) => {
                if (newPost?.slug) {
                  this.uploadProgress$.next(100);
                  this.router.navigate(['/blog', newPost.slug]);
                }
              })
            );
          }),
          catchError((error) => {
            this.errorService.handleError(
              `Failed to create post: ${error.message || 'Unknown error'}`
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

  ngOnDestroy(): void {
    this.uploadProgress$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
