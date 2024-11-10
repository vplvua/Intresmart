import { Routes } from '@angular/router';

import { ServicesComponent } from './services.component';
import { FintechComponent } from './fintech/fintech.component';
import { ArtificialIntelligenceComponent } from './artificial-intelligence/artificial-intelligence.component';
import { AutomotiveComponent } from './automotive/automotive.component';

export const SERVICES_ROUTES: Routes = [
  { path: '', component: ServicesComponent },
  {
    path: 'fintech',
    loadComponent: () =>
      import('./fintech/fintech.component').then((m) => m.FintechComponent),
    title: 'Fintech Softweare Development Services',
    data: {
      meta: {
        description: 'IntreSmart Fintech Software Development Services',
      },
    },
  },
  {
    path: 'automotive',
    loadComponent: () =>
      import('./automotive/automotive.component').then(
        (m) => m.AutomotiveComponent
      ),
    title: 'Automotive Software Development Services',
    data: {
      meta: {
        description: 'We transform automotive mobility',
      },
    },
  },
  {
    path: 'artificial-intelligence',
    loadComponent: () =>
      import(
        './artificial-intelligence/artificial-intelligence.component'
      ).then((m) => m.ArtificialIntelligenceComponent),
    title: 'Artificial Intelligence & Machine Learning Consulting Services',
    data: {
      meta: {
        description: 'IntreSmart AI & ML Consulting Services',
      },
    },
  },
];
