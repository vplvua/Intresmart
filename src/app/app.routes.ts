import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CasesComponent } from './pages/cases/cases.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ExpertiseComponent } from './pages/expertise/expertise.component';
import { ServicesComponent } from './pages/services/services.component';
import { VacanciesComponent } from './pages/vacancies/vacancies.component';
import { LoginComponent } from './pages/login/login.component';
import { FintechComponent } from './pages/services/fintech/fintech.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cases', component: CasesComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'expertise', component: ExpertiseComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/fintech', component: FintechComponent },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' },
];
