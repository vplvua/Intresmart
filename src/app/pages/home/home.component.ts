import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

import { IconComponent } from '../../shared/icon/icon.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IconComponent, ButtonComponent, ArrowButtonComponent],
  providers: [FirebaseService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToServices() {
    this.router.navigate(['/services']);
  }
}
