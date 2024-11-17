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
import { SeoService } from '../../../services/seo.service';
import { environment } from '../../../../environments/environment';

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
  private seoService = inject(SeoService);

  post?: BlogPost;
  isLoggedIn$ = inject(AuthService).user$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.blogService.getPostBySlug(params['slug'])),
        takeUntil(this.destroy$)
      )
      .subscribe((post) => {
        if (post) {
          this.post = post;

          this.seoService.updateAll({
            title: post.title,
            description: this.getDescription(post),
            image: post.content.mainImgUrl || undefined,
            type: 'article',
            author: post.author,
            keywords: this.getKeywords(post),
            url: `${environment.siteUrl}/blog/${post.slug}`,
            'article:published_time': post.publishDate,
            'article:modified_time': post.updateDate,
            'article:author': post.author,
            'article:section': post.category,
            'article:tag': post.tags?.join(',') || '',
          });

          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = this.generateJsonLd(post);
          document.head.appendChild(script);
        }
      });
  }

  private getDescription(post: BlogPost): string {
    const firstArticle = post.content.article[0];
    if (firstArticle && firstArticle.text) {
      return firstArticle.text.slice(0, 160) + '...';
    }
    return this.seoService['defaultData'].description || '';
  }

  private getKeywords(post: BlogPost): string {
    const keywords = [
      'IntreSmart',
      'Automotive HMI design',
      'In-car IVI design',
      'UI/UX design',
      'Mobile app design',
      'Motion design',
      'Product design',
      post.title.toLowerCase(),
    ];
    return keywords.join(', ');
  }

  private generateJsonLd(post: BlogPost): string {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      image: post.content.mainImgUrl,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      datePublished: post.publishDate,
      dateModified: post.updateDate,
      publisher: {
        '@type': 'Organization',
        name: 'IntreSmart Group',
        logo: {
          '@type': 'ImageObject',
          url: 'https://your-domain.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/blog/${post.slug}`,
      },
    });
  }

  ngOnDestroy(): void {
    this.seoService.removeAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
