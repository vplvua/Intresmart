import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { CasesWidgetComponent } from './cases-widget/cases-widget.component';
import { LearnMoreComponent } from '../../shared/learn-more/learn-more.component';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    CasesWidgetComponent,
    RouterLink,
    LearnMoreComponent,
    LoaderComponent,
  ],
  providers: [FirebaseService],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToServices() {
    this.router.navigate(['/services']);
  }
}
