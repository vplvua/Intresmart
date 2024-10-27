import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { IconComponent } from '../../shared/icon/icon.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IconComponent, ArrowButtonComponent, RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(private router: Router) {}

  onUpperButtonClick() {
    this.router.navigate(['/contacts']);
  }

  onSubscribe() {
    // TODO
  }
}
