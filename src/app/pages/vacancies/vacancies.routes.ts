import { Routes } from '@angular/router';
import { VacanciesComponent } from './vacancies.component';
import { AuthGuard } from '../../guards/auth.guard';

export const VACANCIES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./vacancies.component').then((m) => m.VacanciesComponent),
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./add-new-vacancies/add-new-vacancies.component').then(
        (m) => m.AddNewVacanciesComponent
      ),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./vacancy/vacancy.component').then((m) => m.VacancyComponent),
  },
  {
    path: ':slug/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./edit-vacancy/edit-vacancy.component').then(
        (m) => m.EditVacancyComponent
      ),
  },
];
