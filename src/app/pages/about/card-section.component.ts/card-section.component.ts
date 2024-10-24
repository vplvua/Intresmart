import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-card-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4">
      <div
        class="flex flex-row p-4 h-32 justify-between rounded-2xl border border-gray-50 bg-gray-70"
      >
        <div class="text-h6 flex h-full items-center">{{ title }}</div>
        <div class="flex h-full items-center px-2">
          <button
            (click)="toggleContent()"
            class="transition-transform duration-200 rotate-[135deg] flex justify-center items-center w-11 h-11 md:w-14 md:h-14 rounded-full border border-gray-0 bg-gradient-custom hover:bg-gradient-hover focus:bg-gradient-focus active:bg-gradient-focus"
            [ngClass]="{ 'rotate-[315deg]': isOpen }"
          >
            <svg
              class="inline-block w-6 h-6 md:w-8 md:h-8 text-gray-0 fill-current"
            >
              <use
                [attr.xlink:href]="'assets/icons/sprite.svg#arrow-up-right'"
              ></use>
            </svg>
          </button>
        </div>
      </div>
      <div [@slideContent]="isOpen ? 'open' : 'closed'" class="content-wrapper">
        <div
          class="flex flex-row p-4 mt-1 rounded-2xl border-r border-l border-b border-gray-50 bg-gray-70"
        >
          <p class="text-main">
            {{ content }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .content-wrapper {
        overflow: hidden;
      }
    `,
  ],
  animations: [
    trigger('slideContent', [
      state(
        'closed',
        style({
          height: '0',
          opacity: '0',
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('closed <=> open', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class CardSectionComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  isOpen = false;

  toggleContent() {
    this.isOpen = !this.isOpen;
  }
}
