import { Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { CasesComponent } from './cases.component';
import { AddNewCaseComponent } from './add-new-case/add-new-case.component';
import { ArchciveComponent } from './archive/archive.component';
import { CaseComponent } from './case/case.component';
import { EditCaseComponent } from './edit-case/edit-case.component';

export const CASES_ROUTES: Routes = [
  { path: '', component: CasesComponent },
  {
    path: 'add',
    component: AddNewCaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'archive',
    component: ArchciveComponent,
    canActivate: [AuthGuard],
  },
  { path: ':slug', component: CaseComponent },
  {
    path: ':slug/edit',
    component: EditCaseComponent,
    canActivate: [AuthGuard],
  },
];
