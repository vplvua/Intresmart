import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Breadcrumb {
  title: string;
  link: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="flex items-center space-x-2">
      <ol class="flex items-center space-x-2 sm:space-x-4">
        <li>
          <a
            routerLink="/"
            class="text-gray-50 hover:text-gray-10 text-base sm:text-main"
            >Home</a
          >
        </li>

        <ng-container *ngFor="let item of breadcrumbs; let last = last">
          <li class="flex items-center space-x-2 sm:space-x-4">
            <span class="text-gray-50 text-base sm:">></span>
            <ng-container *ngIf="!last && item.link">
              <a
                [routerLink]="item.link"
                class="text-gray-50 hover:text-gray-10 text-base sm:text-main"
              >
                {{ item.title }}
              </a>
            </ng-container>
            <ng-container *ngIf="last || !item.link">
              <span class="text-gray-50 text-base sm:text-main">{{
                item.title
              }}</span>
            </ng-container>
          </li>
        </ng-container>
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
}
