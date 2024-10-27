import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../shared/button/button.component';
import { ArrowButtonComponent } from '../../../shared/arrow-button/arrow-button.component';
import { WantToWorkComponent } from '../../../shared/want-to-work/want-to-work.component';
import { FromTheBlogComponent } from '../../../shared/from-the-blog/from-the-blog.component';
import { LearnMoreComponent } from '../../../shared/learn-more/learn-more.component';

@Component({
  selector: 'app-fintech',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    RouterLink,
    WantToWorkComponent,
    FromTheBlogComponent,
    LearnMoreComponent,
  ],
  templateUrl: './fintech.component.html',
})
export class FintechComponent {}
