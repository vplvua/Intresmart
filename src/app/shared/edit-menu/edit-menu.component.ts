import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class EditMenuComponent<T extends { id?: string; title: string }> {
  @Input() item!: T;
  @Input() archiveText = 'Archive';
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onArchive = new EventEmitter<T>();

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
