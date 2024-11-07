import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ListBlogpostComponent } from '../list-blogpost/list-blogpost.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';
import { map, Subject, take, takeUntil } from 'rxjs';
import { BlogPost } from '../../../models/models';

@Component({
  selector: 'app-archive-blogpost',
  standalone: true,
  imports: [
    CommonModule,
    ListBlogpostComponent,
    ButtonComponent,
    IconComponent,
    RouterLink,
  ],
  templateUrl: './archive-blogpost.component.html',
})
export class ArchiveBlogpostComponent {
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  posts$ = this.blogService.posts$.pipe(
    takeUntil(this.destroy$),
    map((posts) => posts.filter((post) => post.archive))
  );

  isLoggedIn$ = this.authService.user$;

  onEditPost(post: BlogPost): void {
    this.router.navigate(['/blog', post.slug, 'edit']);
  }

  onDeletePost(post: BlogPost): void {
    this.blogService
      .deletePost(post)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe();
  }

  onArchivePost(post: BlogPost): void {
    this.blogService
      .unArchivePost(post)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
