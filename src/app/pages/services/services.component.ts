import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { LearnMoreComponent } from '../../shared/learn-more/learn-more.component';
import { FromTheBlogComponent } from '../../shared/from-the-blog/from-the-blog.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    LearnMoreComponent,
    FromTheBlogComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {}
