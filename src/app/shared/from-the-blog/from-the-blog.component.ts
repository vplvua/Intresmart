import { Component } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-from-the-blog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './from-the-blog.component.html',
})
export class FromTheBlogComponent {}
