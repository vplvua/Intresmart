import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { LoaderComponent } from '../loader/loader.component';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/models';

@Component({
  selector: 'app-from-the-blog',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoaderComponent],
  templateUrl: './from-the-blog.component.html',
})
export class FromTheBlogComponent {
  private blogService = inject(BlogService);
  private router = inject(Router);

  posts$ = this.blogService.posts$.pipe(
    map((posts) =>
      posts
        .filter((post) => !post.archive)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2)
    ),
    takeUntilDestroyed()
  );

  loading$ = this.blogService.loading$;

  navigateToPost(slug: string) {
    if (slug) {
      this.router.navigate([`/blog/${slug}`]);
    }
  }
}
