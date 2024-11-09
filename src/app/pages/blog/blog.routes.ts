import { Routes } from '@angular/router';

import { BlogComponent } from './blog.component';
import { AddNewPostComponent } from './add-new-post/add-new-post.component';
import { ArchiveBlogpostComponent } from './archive-blogpost/archive-blogpost.component';
import { PostComponent } from './post/post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { AuthGuard } from '../../guards/auth.guard';

export const BLOG_ROUTES: Routes = [
  { path: '', component: BlogComponent },
  {
    path: 'add',
    component: AddNewPostComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'archive',
    component: ArchiveBlogpostComponent,
    canActivate: [AuthGuard],
  },
  { path: ':slug', component: PostComponent },
  {
    path: ':slug/edit',
    component: EditPostComponent,
    canActivate: [AuthGuard],
  },
];
