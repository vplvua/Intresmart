import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CasesService } from '../../services/cases.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { DiscussNewProjectComponent } from '../../components/forms/discuss-new-project/discuss-new-project.component';
import { Case } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { EditMenuComponent } from '../../shared/edit-menu/edit-menu.component';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    DiscussNewProjectComponent,
    EditMenuComponent,
  ],
  templateUrl: './cases.component.html',
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
export class CasesComponent {
  casesService = inject(CasesService);
  authService = inject(AuthService);

  cases$: Observable<Case[]> = this.casesService.cases$;
  isLoggedIn$ = this.authService.user$;

  onEditCase(caseItem: Case) {
    // Implement edit logic or navigation
    console.log('Edit case:', caseItem);
  }

  onDeleteCase(caseItem: Case) {
    // Implement delete logic
    console.log('Delete case:', caseItem);
  }

  onArchiveCase(caseItem: Case) {
    // Implement archive logic
    console.log('Archive case:', caseItem);
  }
}
