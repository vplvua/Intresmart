import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, switchMap, map, take } from 'rxjs';

import { CasesService } from '../../../services/cases.service';
import { SeoService } from '../../../services/seo.service';
import { Case } from '../../../models/models';
import { ButtonComponent } from '../../../shared/button/button.component';
import { AuthService } from '../../../services/auth.service';
import { WantToWorkComponent } from '../../../shared/want-to-work/want-to-work.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    WantToWorkComponent,
    LoaderComponent,
  ],
  templateUrl: './case.component.html',
})
export class CaseComponent implements OnInit, OnDestroy {
  private casesService = inject(CasesService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  case?: Case;
  isLoggedIn$ = inject(AuthService).user$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.casesService.getCaseBySlug(params['slug'])),
        takeUntil(this.destroy$)
      )
      .subscribe((caseItem) => {
        this.case = caseItem;
        if (caseItem) {
          this.updateSeo(caseItem);
          this.addJsonLd(caseItem);
        }
      });
  }

  private updateSeo(caseItem: Case): void {
    this.seoService.updateAll({
      title: `${caseItem.title} | Case Study | IntreSmart Group`,
      description: this.getDescription(caseItem),
      image: caseItem.page.mainImgUrl,
      type: 'article',
      keywords: this.getKeywords(caseItem),
      url: `${window.location.origin}/cases/${caseItem.slug}`,
      'article:published_time': caseItem.publishDate,
      'article:section': caseItem.industry,
      'article:tag': caseItem.technologies?.join(','),
    });
  }

  private getDescription(caseItem: Case): string {
    return `Case study: ${caseItem.title}. ${caseItem.tag}. ${
      caseItem.page.textField[0]?.slice(0, 150) || ''
    }...`;
  }

  private getKeywords(caseItem: Case): string {
    return [
      'case study',
      'IntreSmart Group',
      caseItem.tag,
      caseItem.title,
      caseItem.industry || '',
      ...(caseItem.technologies || []),
    ]
      .filter(Boolean)
      .join(', ');
  }

  private addJsonLd(caseItem: Case): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: caseItem.title,
      image: caseItem.page.mainImgUrl,
      datePublished: caseItem.publishDate,
      author: {
        '@type': 'Organization',
        name: 'IntreSmart Group',
      },
      publisher: {
        '@type': 'Organization',
        name: 'IntreSmart Group',
        logo: {
          '@type': 'ImageObject',
          url: 'https://your-domain.com/logo.png',
        },
      },
    });
    document.head.appendChild(script);
  }

  ngOnDestroy(): void {
    this.seoService.removeAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
