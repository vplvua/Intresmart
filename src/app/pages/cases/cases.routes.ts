import { Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';

export const CASES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cases.component').then((m) => m.CasesComponent),
    title: 'Cases',
    data: {
      meta: {
        description: 'IntreSmart cases and projects',
      },
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./add-new-case/add-new-case.component').then(
        (m) => m.AddNewCaseComponent
      ),
  },
  {
    path: 'archive',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./archive/archive.component').then((m) => m.ArchciveComponent),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./case/case.component').then((m) => m.CaseComponent),
  },
  {
    path: ':slug/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./edit-case/edit-case.component').then(
        (m) => m.EditCaseComponent
      ),
  },
];
