import { Component, inject } from '@angular/core';

import { FirebaseService } from '../../services/firebase.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.scss',
})
export class CasesComponent {
  firebaseService = inject(FirebaseService);
  destroy$ = new Subject<void>();

  ngOnInit() {
    this.firebaseService.cases$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cases) => {
        console.log(cases);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
