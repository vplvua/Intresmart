import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {}
