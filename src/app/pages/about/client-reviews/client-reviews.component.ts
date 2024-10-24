import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: number;
  author: string;
  projectName: string;
  content: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-client-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-reviews.component.html',
  styleUrl: './client-reviews.component.scss',
})
export class ClientReviewsComponent {
  @ViewChild('carouselWrapper') carouselWrapper?: ElementRef;

  private readonly SCROLL_AMOUNT = 288 + 16; // card width + gap

  reviews: Review[] = [
    {
      id: 1,
      author: 'Eric Stohl',
      projectName: 'AD-ADAS Automotive App',
      content:
        'IntreSmart is the best company I have ever worked with. Their expert team has professionally helped us to design and develop a new AD-ADAS app using MI and Computer vision skills for a brand-new EV model. I am extremely satisfied with the final result. These guys never disappoint”',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/intresmart-cd37f.appspot.com/o/about%2Fclient-avatar.png?alt=media&token=077d6994-93c4-47ca-abe2-58c4286c8cc4',
    },
    {
      id: 2,
      author: 'Eric Stohl',
      projectName: 'AD-ADAS Automotive App',
      content:
        'IntreSmart is the best company I have ever worked with. Their expert team has professionally helped us to design and develop a new AD-ADAS app using MI and Computer vision skills for a brand-new EV model. I am extremely satisfied with the final result. These guys never disappoint”',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/intresmart-cd37f.appspot.com/o/about%2Fclient-avatar.png?alt=media&token=077d6994-93c4-47ca-abe2-58c4286c8cc4',
    },
    {
      id: 3,
      author: 'Eric Stohl',
      projectName: 'AD-ADAS Automotive App',
      content:
        'IntreSmart is the best company I have ever worked with. Their expert team has professionally helped us to design and develop a new AD-ADAS app using MI and Computer vision skills for a brand-new EV model. I am extremely satisfied with the final result. These guys never disappoint”',
      avatarUrl:
        'https://firebasestorage.googleapis.com/v0/b/intresmart-cd37f.appspot.com/o/about%2Fclient-avatar.png?alt=media&token=077d6994-93c4-47ca-abe2-58c4286c8cc4',
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
