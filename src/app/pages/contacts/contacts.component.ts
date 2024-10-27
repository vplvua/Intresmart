import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ButtonComponent, ArrowButtonComponent],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {}
