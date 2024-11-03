import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Case } from '../../models/models';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-edit-menu',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    ConfirmationPopupComponent,
    IconComponent,
  ],
  templateUrl: './edit-menu.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class EditMenuComponent {
  @Input() item!: Case;
  @Output() onEdit = new EventEmitter<Case>();
  @Output() onDelete = new EventEmitter<Case>();
  @Output() onArchive = new EventEmitter<Case>();

  isMenuOpen = false;
  showDeleteConfirmation = false;

  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onClickOutside() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  edit() {
    this.onEdit.emit(this.item);
    this.closeMenu();
  }

  delete() {
    this.showDeleteConfirmation = true;
    this.closeMenu();
  }

  confirmDelete() {
    this.onDelete.emit(this.item);
    this.showDeleteConfirmation = false;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  archive() {
    this.onArchive.emit(this.item);
    this.closeMenu();
  }
}
