import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CasesService } from '../../services/cases.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { DiscussNewProjectComponent } from '../../components/forms/discuss-new-project/discuss-new-project.component';
import { Case } from '../../models/models';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RouterLink,
    DiscussNewProjectComponent,
  ],
  templateUrl: './cases.component.html',
})
export class CasesComponent {
  casesService = inject(CasesService);

  cases$: Observable<Case[]> = this.casesService.cases$;
}
