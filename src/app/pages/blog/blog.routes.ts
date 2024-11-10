import { Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';

export const BLOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog.component').then((m) => m.BlogComponent),
    title: 'Blog IntreSmart',
    data: {
      meta: {
        description: 'IntreSmart blog with the latest news and updates',
      },
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./add-new-post/add-new-post.component').then(
        (m) => m.AddNewPostComponent
      ),
  },
  {
    path: 'archive',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./archive-blogpost/archive-blogpost.component').then(
        (m) => m.ArchiveBlogpostComponent
      ),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./post/post.component').then((m) => m.PostComponent),
  },
  {
    path: ':slug/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./edit-post/edit-post.component').then(
        (m) => m.EditPostComponent
      ),
  },
];
