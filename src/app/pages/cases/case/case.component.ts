import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, switchMap, map, take } from 'rxjs';

import { CasesService } from '../../../services/cases.service';
import { Case } from '../../../models/models';
import { ButtonComponent } from '../../../shared/button/button.component';
import { AuthService } from '../../../services/auth.service';
import { WantToWorkComponent } from '../../../shared/want-to-work/want-to-work.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-case',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    WantToWorkComponent,
    LoaderComponent,
  ],
  templateUrl: './case.component.html',
})
export class CaseComponent implements OnInit, OnDestroy {
  private casesService = inject(CasesService);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  case?: Case;
  isLoggedIn$ = inject(AuthService).user$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => this.casesService.getCaseBySlug(params['slug'])),
        takeUntil(this.destroy$)
      )
      .subscribe((caseItem) => {
        this.case = caseItem;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
