import { Component } from '@angular/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { ArrowButtonComponent } from '../../shared/arrow-button/arrow-button.component';
import { LearnMoreComponent } from '../../shared/learn-more/learn-more.component';
import { FromTheBlogComponent } from '../../shared/from-the-blog/from-the-blog.component';
import { WantToWorkComponent } from '../../shared/want-to-work/want-to-work.component';

@Component({
  selector: 'app-expertise',
  standalone: true,
  imports: [
    ButtonComponent,
    ArrowButtonComponent,
    LearnMoreComponent,
    FromTheBlogComponent,
    WantToWorkComponent,
  ],
  templateUrl: './expertise.component.html',
})
export class ExpertiseComponent {}
