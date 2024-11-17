import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  robots?: string;
  'article:published_time'?: string;
  'article:modified_time'?: string;
  'article:author'?: string;
  'article:section'?: string;
  'article:tag'?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly defaultData: SeoData = {
    title: 'IntreSmart Group Company',
    description:
      'We are a team of consultants, engineers, and creative minds who tackle corporate obstacles by devising cutting-edge technological solutions.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/intresmart-cd37f.appspot.com/o/home%2Flogo.png?alt=media&token=6c4b5a24-bebe-4629-b207-4699ed078d1a',
    type: 'website',
    author: 'IntreSmart Group',
    robots: 'index, follow',
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) {}

  updateAll(data: SeoData) {
    const seoData = { ...this.defaultData, ...data };

    this.title.setTitle(seoData.title!);
    if (seoData.description) {
      this.meta.updateTag({
        name: 'description',
        content: seoData.description || '',
      });
    }
    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }
    if (seoData.robots) {
      this.meta.updateTag({ name: 'robots', content: seoData.robots });
    }

    this.meta.updateTag({ property: 'og:title', content: seoData.title || '' });
    this.meta.updateTag({
      property: 'og:description',
      content: seoData.description || '',
    });
    this.meta.updateTag({ property: 'og:type', content: seoData.type || '' });
    if (seoData.image) {
      this.meta.updateTag({
        property: 'og:image',
        content: seoData.image || '',
      });
    }

    const url = seoData.url || `${environment.siteUrl}${this.router.url}`;
    this.meta.updateTag({ property: 'og:url', content: url });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: seoData.title || '',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: seoData.description || '',
    });
    if (seoData.image) {
      this.meta.updateTag({ name: 'twitter:image', content: seoData.image });
    }

    if (seoData.author) {
      this.meta.updateTag({ name: 'author', content: seoData.author });
    }
  }

  removeAll() {
    this.meta.removeTag("name='description'");
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("name='robots'");
    this.meta.removeTag("property='og:title'");
    this.meta.removeTag("property='og:description'");
    this.meta.removeTag("property='og:image'");
    this.meta.removeTag("property='og:url'");
    this.meta.removeTag("property='og:type'");
    this.meta.removeTag("name='twitter:card'");
    this.meta.removeTag("name='twitter:title'");
    this.meta.removeTag("name='twitter:description'");
    this.meta.removeTag("name='twitter:image'");
    this.meta.removeTag("name='author'");
  }
}
