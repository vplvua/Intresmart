import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { BlogService } from '../../../services/blog.service';
import { ErrorHandlingService } from '../../../services/error-handling.service';
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
import { Article, BlogPost, BlogPostFileUrls } from '../../../models/models';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorToastComponent } from '../../../shared/error-toast/error-toast.component';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ButtonComponent,
    ErrorToastComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-post.component.html',
})
export class EditPostComponent {
  private blogService = inject(BlogService);
  private errorService = inject(ErrorHandlingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  blogPostForm!: FormGroup;
  currentPost?: BlogPost;
  isLoading = false;
  uploadProgress$ = new BehaviorSubject<number>(0);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  ngOnInit(): void {
    this.initForm();

    this.route.params
      .pipe(
        switchMap((params) =>
          this.blogService.posts$.pipe(
            map((posts) => posts.find((p) => p.slug === params['slug']))
          )
        ),
        tap((post) => {
          if (post) {
            this.currentPost = post;
            this.patchFormValues(post);
          } else {
            this.router.navigate(['/blog']);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private initForm(): void {
    this.blogPostForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      date: ['', Validators.required],
      author: ['', Validators.required],
      content: this.fb.array([]),
      mainImg: [null],
      imageCard: [null],
    });
  }

  get content() {
    return this.blogPostForm.get('content') as FormArray;
  }

  private patchFormValues(post: BlogPost): void {
    this.blogPostForm.patchValue({
      title: post.title || '',
      subtitle: post.subtitle || '',
      date: post.date || '',
      author: post.author || '',
    });

    while (this.content.length !== 0) {
      this.content.removeAt(0);
    }

    post.content?.article?.forEach((item) => {
      const contentGroup = this.fb.group({
        type: [''],
        value: ['', Validators.required],
      });

      if ('header' in item) {
        contentGroup.patchValue({ type: 'header', value: item.header });
      } else if ('text' in item) {
        contentGroup.patchValue({ type: 'text', value: item.text });
      }

      this.content.push(contentGroup);
    });
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
    urlsObject: BlogPostFileUrls,
    currentPost: BlogPost
  ): Partial<BlogPost> {
    return {
      id: currentPost.id,
      title: formValue.title,
      subtitle: formValue.subtitle,
      date: formValue.date,
      author: formValue.author,
      slug: currentPost.slug,
      cardImgUrl: urlsObject.cardImgUrl || currentPost.cardImgUrl || '',
      content: {
        mainImgUrl:
          urlsObject.mainImgUrl || currentPost.content?.mainImgUrl || '',
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
    if (this.blogPostForm.valid && this.currentPost?.id) {
      this.isLoading = true;
      this.uploadProgress$.next(0);

      const formValue = this.blogPostForm.value;
      const files = {
        mainImg: formValue.mainImg || undefined,
        imageCard: formValue.imageCard || undefined,
      };

      if (!this.validateAllFiles(files)) {
        this.isLoading = false;
        return;
      }

      const hasFiles = Object.values(files).some((file) => file);

      if (hasFiles) {
        this.blogService
          .uploadFiles(files)
          .pipe(
            take(1),
            takeUntil(this.destroy$),
            map((urlsObject) => {
              const postData = this.preparePostData(
                formValue,
                urlsObject,
                this.currentPost!
              );
              return postData;
            }),
            switchMap((postData) => {
              if (!postData) {
                throw new Error('Failed to prepare post data');
              }
              if (this.currentPost?.id) {
                return this.blogService
                  .updatePost(this.currentPost.id, postData)
                  .pipe(
                    switchMap(() => this.blogService.posts$),
                    map((posts) =>
                      posts.find((p) => p.id === this.currentPost?.id)
                    ),
                    tap((updatedPost) => {
                      if (updatedPost?.slug) {
                        this.currentPost = updatedPost;
                        this.uploadProgress$.next(100);
                        this.router.navigate(['/blog', updatedPost.slug]);
                      }
                    })
                  );
              } else {
                throw new Error('Current post ID is undefined');
              }
            }),
            catchError((error) => {
              this.errorService.handleError(
                `Failed to update post: ${error.message || 'Unknown error'}`
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
        const postData = this.preparePostData(
          formValue,
          {} as BlogPostFileUrls,
          this.currentPost!
        );

        this.blogService
          .updatePost(this.currentPost!.id, postData)
          .pipe(
            take(1),
            takeUntil(this.destroy$),
            switchMap(() => this.blogService.posts$),
            map((posts) => posts.find((p) => p.id === this.currentPost?.id)),
            tap((updatedPost) => {
              if (updatedPost?.slug) {
                this.currentPost = updatedPost;
                this.uploadProgress$.next(100);
                this.router.navigate(['/blog', updatedPost.slug]);
              }
            }),
            catchError((error) => {
              this.errorService.handleError(
                `Failed to update post: ${error.message || 'Unknown error'}`
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

  ngOnDestroy(): void {
    this.uploadProgress$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
