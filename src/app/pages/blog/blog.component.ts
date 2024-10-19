import { Component, inject } from '@angular/core';

import { FirebaseService } from '../../services/firebase.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  firebaseService = inject(FirebaseService);
  destroy$ = new Subject<void>();

  ngOnInit() {
    this.firebaseService
      .fetchArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe((articles: any) => {
        console.log(articles);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
