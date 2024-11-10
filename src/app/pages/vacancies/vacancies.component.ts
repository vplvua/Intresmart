import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil, map, take, switchMap } from 'rxjs';

import { Vacancy } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { VacanciesService } from '../../services/vacancies.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ListVacanciesComponent } from './list-vacancies/list-vacancies.component';

@Component({
  selector: 'app-vacancies',
  standalone: true,
  imports: [
    ButtonComponent,
    IconComponent,
    RouterLink,
    ListVacanciesComponent,
    CommonModule,
  ],
  templateUrl: './vacancies.component.html',
})
export class VacanciesComponent {
  private vacanciesService = inject(VacanciesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  vacancies$ = this.vacanciesService.vacancies$;

  isLoggedIn$ = this.authService.user$;

  onEditVacancy(vacancy: Vacancy): void {
    this.router.navigate(['/vacancies', vacancy.slug, 'edit']);
  }

  onDeleteVacancy(vacancy: Vacancy): void {
    if (vacancy.id) {
      this.vacanciesService
        .deleteVacancy(vacancy.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  onArchiveVacancy({
    vacancy,
    setArchive,
  }: {
    vacancy: Vacancy;
    setArchive: boolean;
  }): void {
    const operation = setArchive
      ? this.vacanciesService.archiveVacancy(vacancy)
      : this.vacanciesService.unArchiveVacancy(vacancy);

    operation.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
