import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ButtonComponent } from '../../../shared/button/button.component';
import { BlogPost } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';
import { EditMenuComponent } from '../../../shared/edit-menu/edit-menu.component';

@Component({
  selector: 'app-list-blogpost',
  standalone: true,
  imports: [CommonModule, ButtonComponent, EditMenuComponent],
  templateUrl: './list-blogpost.component.html',
})
export class ListBlogpostComponent {
  @Input() posts: BlogPost[] = [];
  @Input() isLoading: boolean | null = false;

  @Output() onEdit = new EventEmitter<BlogPost>();
  @Output() onDelete = new EventEmitter<BlogPost>();
  @Output() onArchive = new EventEmitter<BlogPost>();

  private platformId = inject(PLATFORM_ID);
  isLoggedIn$ = inject(AuthService).user$;
  private router = inject(Router);

  isBrowser = isPlatformBrowser(this.platformId);

  navigateToCase(slug: string) {
    if (slug) {
      this.router.navigate([`/blog/${slug}`]);
    }
  }
}
