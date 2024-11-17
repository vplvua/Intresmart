import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/button/button.component';
import { EditMenuComponent } from '../../../shared/edit-menu/edit-menu.component';
import { Case } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-list-cases',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    EditMenuComponent,
    LoaderComponent,
  ],
  templateUrl: './list-cases.component.html',
})
export class ListCasesComponent {
  @Input() cases: Case[] = [];

  @Output() onEdit = new EventEmitter<Case>();
  @Output() onDelete = new EventEmitter<Case>();
  @Output() onArchive = new EventEmitter<Case>();

  private platformId = inject(PLATFORM_ID);
  isLoggedIn$ = inject(AuthService).user$;
  private router = inject(Router);

  isBrowser = isPlatformBrowser(this.platformId);

  navigateToCase(slug: string) {
    this.router.navigate([`/cases/${slug}`]);
  }
}
