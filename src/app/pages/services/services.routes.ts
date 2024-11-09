import { Routes } from '@angular/router';

import { ServicesComponent } from './services.component';
import { FintechComponent } from './fintech/fintech.component';
import { ArtificialIntelligenceComponent } from './artificial-intelligence/artificial-intelligence.component';
import { AutomotiveComponent } from './automotive/automotive.component';

export const SERVICES_ROUTES: Routes = [
  { path: '', component: ServicesComponent },
  { path: 'fintech', component: FintechComponent },
  { path: 'automotive', component: AutomotiveComponent },
  {
    path: 'artificial-intelligence',
    component: ArtificialIntelligenceComponent,
  },
];
