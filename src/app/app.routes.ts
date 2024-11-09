import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },

  {
    path: 'blog',
    loadChildren: () =>
      import('./pages/blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },
  {
    path: 'cases',
    loadChildren: () =>
      import('./pages/cases/cases.routes').then((m) => m.CASES_ROUTES),
  },
  { path: 'contacts', component: ContactsComponent },
  { path: 'expertise', component: ExpertiseComponent },
  {
    path: 'services',
    loadChildren: () =>
      import('./pages/services/services.routes').then((m) => m.SERVICES_ROUTES),
  },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' },
];
