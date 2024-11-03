import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  catchError,
  finalize,
  map,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { CasesService } from '../../../services/cases.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DiscussNewProjectComponent } from '../../../components/forms/discuss-new-project/discuss-new-project.component';
import { Case } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';
import { EditMenuComponent } from '../../../shared/edit-menu/edit-menu.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ListCasesComponent } from '../list-cases/list-cases.component';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    DiscussNewProjectComponent,
    EditMenuComponent,
    IconComponent,
    ListCasesComponent,
  ],
  templateUrl: './archive.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .case-card {
        position: relative;
        transition: all 0.3s ease;
      }
    `,
  ],
})
export class ArchciveComponent {
  private casesService = inject(CasesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  cases$ = this.casesService.cases$.pipe(
    takeUntil(this.destroy$),
    map((cases) => cases.filter((caseItem) => caseItem.archive))
  );
  isLoggedIn$ = this.authService.user$;
  isLoading$ = this.casesService.loading$;

  onEditCase(caseItem: Case): void {
    this.router.navigate(['/cases', caseItem.id, 'edit']);
  }

  onDeleteCase(caseItem: Case): void {
    this.casesService
      .deleteCase(caseItem)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe();
  }

  onArchiveCase(caseItem: Case): void {
    this.casesService
      .unArchiveCase(caseItem)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
