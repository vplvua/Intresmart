import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FirebaseService } from '../../services/firebase.service';
import { SeoService } from '../../services/seo.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { CasesWidgetComponent } from './cases-widget/cases-widget.component';
import { LearnMoreComponent } from '../../shared/learn-more/learn-more.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    CasesWidgetComponent,
    RouterLink,
    LearnMoreComponent,
    LoaderComponent,
  ],
  providers: [FirebaseService],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private router = inject(Router);
  private seoService = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.updateSeo();
    if (isPlatformBrowser(this.platformId)) {
      this.addJsonLd();
    }
  }

  private updateSeo(): void {
    this.seoService.updateAll({
      title: 'IntreSmart Group - Designing The Future | Technology Solutions',
      description:
        'IntreSmart Group is a team of consultants, engineers, and creative minds tackling corporate challenges with cutting-edge technological solutions. Expert in tech product engineering and design services.',
      type: 'website',
      keywords:
        'IntreSmart Group, technology solutions, product engineering, design services, HMI design, UI/UX design, mobile app design, motion design',
      image:
        'https://firebasestorage.googleapis.com/v0/b/intresmart-cd37f.appspot.com/o/home%2Fceo.jfif?alt=media&token=d6f1395c-73cc-4a4b-8452-ed4a1e7dce73',
    });
  }

  private addJsonLd(): void {
    const head = document.getElementsByTagName('head')[0];
    if (!head) return;

    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'IntreSmart Group',
      url: environment.siteUrl,
      logo: `${environment.siteUrl} + assets/header-logo.svg`,
      description:
        'We are a team of consultants, engineers, and creative minds who tackle corporate obstacles by devising cutting-edge technological solutions.',
      founder: {
        '@type': 'Person',
        name: 'Kyryl Hnapovskyi',
      },
      foundingDate: '2020',
      sameAs: ['https://www.linkedin.com/company/intresmart'],
    });

    head.appendChild(script);
  }

  navigateToServices() {
    this.router.navigate(['/services']);
  }
}
