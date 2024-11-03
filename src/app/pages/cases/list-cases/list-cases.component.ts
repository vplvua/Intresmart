import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/button/button.component';
import { DiscussNewProjectComponent } from '../../../components/forms/discuss-new-project/discuss-new-project.component';
import { EditMenuComponent } from '../../../shared/edit-menu/edit-menu.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { Case } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-cases',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    DiscussNewProjectComponent,
    EditMenuComponent,
    IconComponent,
  ],
  templateUrl: './list-cases.component.html',
})
export class ListCasesComponent {
  @Input() cases: Case[] = [];
  @Input() isLoading: boolean | null = false;

  @Output() onEdit = new EventEmitter<Case>();
  @Output() onDelete = new EventEmitter<Case>();
  @Output() onArchive = new EventEmitter<Case>();

  isLoggedIn$ = inject(AuthService).user$;
  private router = inject(Router);

  navigateToCase(slug: string) {
    this.router.navigate([`/cases/${slug}`]);
  }
}
