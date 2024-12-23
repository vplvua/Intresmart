import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/button/button.component';
import { ArrowButtonComponent } from '../../../shared/arrow-button/arrow-button.component';
import { WantToWorkComponent } from '../../../shared/want-to-work/want-to-work.component';
import { FromTheBlogComponent } from '../../../shared/from-the-blog/from-the-blog.component';
import { LearnMoreComponent } from '../../../shared/learn-more/learn-more.component';

@Component({
  selector: 'app-automotive',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    WantToWorkComponent,
    FromTheBlogComponent,
    LearnMoreComponent,
    RouterLink,
  ],
  templateUrl: './automotive.component.html',
})
export class AutomotiveComponent {}
