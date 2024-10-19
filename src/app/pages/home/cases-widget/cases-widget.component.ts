import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';

import { ButtonComponent } from '../../../shared/button/button.component';
import { CasesService } from '../../../services/cases.service';
import { Case } from '../../../models/models';

@Component({
  selector: 'app-cases-widget',
  standalone: true,
  imports: [ButtonComponent, RouterLink, CommonModule],
  templateUrl: './cases-widget.component.html',
})
export class CasesWidgetComponent {
  casesService = inject(CasesService);

  cases$: Observable<Case[]> = this.casesService.cases$.pipe(
    map((cases: any[]) => cases.filter((c) => c.home === true))
  );
}
