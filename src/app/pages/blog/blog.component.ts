import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Subject, take, takeUntil, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { BlogPost } from '../../models/models';
import { WantToWorkComponent } from '../../shared/want-to-work/want-to-work.component';
import { ListBlogpostComponent } from './list-blogpost/list-blogpost.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    WantToWorkComponent,
    ListBlogpostComponent,
    ButtonComponent,
    RouterLink,
    IconComponent,
  ],
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  posts$ = this.blogService.posts$.pipe(
    takeUntil(this.destroy$),
    map((posts) => posts.filter((post) => !post.archive))
  );

  isLoggedIn$ = this.authService.user$;
  isLoading$ = this.blogService.loading$;

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
      .archivePost(post)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/blog']);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
