import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

import { BlogService } from '../../../services/blog.service';
import { BlogPost } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { WantToWorkComponent } from '../../../shared/want-to-work/want-to-work.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    WantToWorkComponent,
    ButtonComponent,
    RouterLink,
    BreadcrumbsComponent,
  ],
  templateUrl: './post.component.html',
})
export class PostComponent {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  post?: BlogPost;
  isLoggedIn$ = inject(AuthService).user$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.blogService.getPostBySlug(params['slug'])),
        takeUntil(this.destroy$)
      )
      .subscribe((post) => {
        this.post = post;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
