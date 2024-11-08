import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { BlogPost, Case } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class SlugService {
  private slugCache = new Map<string, string>(); // slug -> id
  private idCache = new Map<string, string>(); // id -> slug
  private casesSubject = new BehaviorSubject<Case[]>([]);
  private blogPostsSubject = new BehaviorSubject<BlogPost[]>([]);

  // Cases

  updateCases(cases: Case[]): void {
    const currentCases = this.casesSubject.getValue();
    if (JSON.stringify(currentCases) !== JSON.stringify(cases)) {
      this.casesSubject.next(cases);
      this.updateCache(cases);
    }
  }

  private updateCache(cases: Case[]): void {
    this.slugCache.clear();
    this.idCache.clear();
    cases.forEach((caseItem) => {
      if (caseItem.id && caseItem.slug) {
        this.slugCache.set(caseItem.slug, caseItem.id);
        this.idCache.set(caseItem.id, caseItem.slug);
      }
    });
  }

  createSlug(title: string): Observable<string> {
    const baseSlug = this.slugify(title);

    return this.casesSubject.pipe(
      map((cases) => {
        const existingSlugs = cases.map((c) => c.slug);
        return this.makeUniqueSlug(baseSlug, existingSlugs);
      })
    );
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-+|-+$/g, '');
  }

  private makeUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  getIdFromSlug(slug: string): string | undefined {
    return this.slugCache.get(slug);
  }

  getSlugFromId(id: string): string | undefined {
    return this.idCache.get(id);
  }

  updateSlug(id: string, newTitle: string): Observable<string> {
    const currentSlug = this.getSlugFromId(id);
    const newSlug = this.slugify(newTitle);

    if (currentSlug === newSlug) {
      return of(currentSlug);
    }

    return this.createSlug(newTitle).pipe(
      map((newSlug) => {
        this.idCache.set(id, newSlug);
        this.slugCache.set(newSlug, id);
        return newSlug;
      })
    );
  }

  // Blog posts

  updateBlogPosts(posts: BlogPost[]): void {
    const currentPosts = this.blogPostsSubject.getValue();
    if (JSON.stringify(currentPosts) !== JSON.stringify(posts)) {
      this.blogPostsSubject.next(posts);
      this.updateBlogCache(posts);
    }
  }

  private updateBlogCache(posts: BlogPost[]): void {
    posts.forEach((post) => {
      if (post.id && post.slug) {
        this.slugCache.set(`blog-${post.slug}`, post.id);
        this.idCache.set(`blog-${post.id}`, post.slug);
      }
    });
  }

  createBlogSlug(title: string): Observable<string> {
    const baseSlug = this.slugify(title);

    return this.blogPostsSubject.pipe(
      map((posts) => {
        const existingSlugs = posts.map((p) => p.slug);
        return this.makeUniqueSlug(baseSlug, existingSlugs);
      })
    );
  }

  getBlogIdFromSlug(slug: string): string | undefined {
    return this.slugCache.get(`blog-${slug}`);
  }

  getBlogSlugFromId(id: string): string | undefined {
    return this.idCache.get(`blog-${id}`);
  }

  updateBlogSlug(id: string, newTitle: string): Observable<string> {
    const currentSlug = this.getBlogSlugFromId(id);
    const newSlug = this.slugify(newTitle);

    if (currentSlug === newSlug) {
      return of(currentSlug);
    }

    return this.createBlogSlug(newTitle).pipe(
      map((newSlug) => {
        this.idCache.set(`blog-${id}`, newSlug);
        this.slugCache.set(`blog-${newSlug}`, id);
        return newSlug;
      })
    );
  }
}
