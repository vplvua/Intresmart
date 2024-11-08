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
import { AutomotiveComponent } from './pages/services/automotive/automotive.component';
import { ArtificialIntelligenceComponent } from './pages/services/artificial-intelligence/artificial-intelligence.component';
import { AddNewCaseComponent } from './pages/cases/add-new-case/add-new-case.component';
import { AuthGuard } from './guards/auth.guard';
import { ArchciveComponent } from './pages/cases/archive/archive.component';
import { CaseComponent } from './pages/cases/case/case.component';
import { EditCaseComponent } from './pages/cases/edit-case/edit-case.component';
import { AddNewPostComponent } from './pages/blog/add-new-post/add-new-post.component';
import { ArchiveBlogpostComponent } from './pages/blog/archive-blogpost/archive-blogpost.component';
import { PostComponent } from './pages/blog/post/post.component';
import { EditPostComponent } from './pages/blog/edit-post/edit-post.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  {
    path: 'blog/add',
    component: AddNewPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'blog/archive',
    component: ArchiveBlogpostComponent,
    canActivate: [AuthGuard],
  },
  { path: 'blog/:slug', component: PostComponent },
  {
    path: 'blog/:slug/edit',
    component: EditPostComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cases', component: CasesComponent },
  {
    path: 'cases/add',
    component: AddNewCaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cases/archive',
    component: ArchciveComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cases/:slug', component: CaseComponent },
  {
    path: 'cases/:slug/edit',
    component: EditCaseComponent,
    canActivate: [AuthGuard],
  },
  { path: 'contacts', component: ContactsComponent },
  { path: 'expertise', component: ExpertiseComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'services/fintech', component: FintechComponent },
  { path: 'services/automotive', component: AutomotiveComponent },
  {
    path: 'services/artificial-intelligence',
    component: ArtificialIntelligenceComponent,
  },
  { path: 'vacancies', component: VacanciesComponent },
  { path: 'blog/:id', component: BlogComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' },
];
