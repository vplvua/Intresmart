import { Routes } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
    title: 'About Us',
    data: {
      meta: {
        description: 'About IntreSmart company and our mission',
      },
    },
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./pages/blog/blog.routes').then((m) => m.BLOG_ROUTES),
    title: 'Blog IntreSmart',
    data: {
      meta: {
        description: 'IntreSmart blog with the latest news and updates',
      },
    },
  },
  {
    path: 'cases',
    loadChildren: () =>
      import('./pages/cases/cases.routes').then((m) => m.CASES_ROUTES),
    title: 'Cases',
    data: {
      meta: {
        description: 'IntreSmart cases and projects',
      },
    },
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./pages/contacts/contacts.component').then(
        (m) => m.ContactsComponent
      ),
    title: 'Contacts',
    data: {
      meta: {
        description: "Let's create something awesome together!",
      },
    },
  },
  {
    path: 'expertise',
    loadComponent: () =>
      import('./pages/expertise/expertise.component').then(
        (m) => m.ExpertiseComponent
      ),
    title: 'Expertise',
    data: {
      meta: {
        description: "IntreSmart's expertise and services",
      },
    },
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./pages/services/services.routes').then((m) => m.SERVICES_ROUTES),
    title: 'Services',
    data: {
      meta: {
        description: "IntreSmart's services",
      },
    },
  },
  {
    path: 'vacancies',
    loadChildren: () =>
      import('./pages/vacancies/vacancies.routes').then(
        (m) => m.VACANCIES_ROUTES
      ),
    title: 'Vacancies',
    data: {
      meta: {
        description: "IntreSmart's opened vacancies",
      },
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: 'home' },
];
