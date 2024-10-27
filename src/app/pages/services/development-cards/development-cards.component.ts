import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  id: number;
  domen: string;
  content: string;
  imageUrl: string;
}

@Component({
  selector: 'app-development-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-cards.component.html',
  styleUrl: './development-cards.component.scss',
})
export class ClientReviewsComponent {
  @ViewChild('carouselWrapper') carouselWrapper?: ElementRef;

  private readonly SCROLL_AMOUNT = 288 + 16; // card width + gap

  development: Step[] = [
    {
      id: 1,
      domen: 'Finance',
      content:
        'Make decisions without the fear of uncertainty and allocate capital more efficiently.',
      imageUrl: 'assets/icons/sprite.svg#cash',
    },
    {
      id: 2,
      domen: 'Workforce management',
      content:
        'Predict which candidates are best to hire and increase employee retention rates.',
      imageUrl: 'assets/icons/sprite.svg#notebook',
    },
    {
      id: 3,
      domen: 'Marketingt',
      content:
        'Optimize your marketing spend, target your messages better, and acquire new customers.',
      imageUrl: 'assets/icons/sprite.svg#presentations',
    },
    {
      id: 4,
      domen: 'Sales',
      content:
        'Forecast sales, prioritize your actions based on lead scores, and automate sales activities.',
      imageUrl: 'assets/icons/sprite.svg#investments',
    },
    {
      id: 5,
      domen: 'Security',
      content:
        'Predict and thwart impending attacks with smart security systems and analytics.',
      imageUrl: 'assets/icons/sprite.svg#connect',
    },
    {
      id: 6,
      domen: 'Operations',
      content:
        'Automate costly back office operations and optimize your inventory and supply chain.',
      imageUrl: 'assets/icons/sprite.svg#brain-ml',
    },
  ];

  scrollLeft() {
    if (this.carouselWrapper) {
      const container = this.carouselWrapper.nativeElement;
      container.scrollLeft -= this.SCROLL_AMOUNT;
    }
  }

  scrollRight() {
    if (this.carouselWrapper) {
      const container = this.carouselWrapper.nativeElement;
      container.scrollLeft += this.SCROLL_AMOUNT;
    }
  }
}
