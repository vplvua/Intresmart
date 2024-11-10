import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, tap } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { VacanciesService } from '../../services/vacancies.service';

@Component({
  selector: 'app-vacancies-widget',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './vacancies-widget.component.html',
})
export class VacanciesWidgetComponent {
  private vacanciesService = inject(VacanciesService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);

  vacancies$ = this.vacanciesService.vacancies$.pipe(
    map((vacancies) =>
      vacancies
        .filter((vacancy) => !vacancy.archive)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ),
    distinctUntilChanged(
      (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
    ),
    takeUntilDestroyed()
  );

  loading$ = this.vacanciesService.loading$;

  navigateToVacancy(slug: string) {
    if (slug) {
      this.router.navigate([`/vacancies/${slug}`]);
    }
  }
}
