import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

import { Vacancy } from '../../../models/models';
import { AuthService } from '../../../services/auth.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { EditMenuComponent } from '../../../shared/edit-menu/edit-menu.component';

@Component({
  selector: 'app-list-vacancies',
  standalone: true,
  imports: [
    ButtonComponent,
    LoaderComponent,
    RouterLink,
    EditMenuComponent,
    CommonModule,
  ],
  templateUrl: './list-vacancies.component.html',
})
export class ListVacanciesComponent {
  private _vacancies = signal<Vacancy[]>([]);
  @Input({ required: true })
  set vacancies(value: Vacancy[]) {
    this._vacancies.set(value);
  }

  @Output() onEdit = new EventEmitter<Vacancy>();
  @Output() onDelete = new EventEmitter<Vacancy>();
  @Output() onArchive = new EventEmitter<{
    vacancy: Vacancy;
    setArchive: boolean;
  }>();

  private platformId = inject(PLATFORM_ID);
  isLoggedIn$ = inject(AuthService).user$;
  private router = inject(Router);

  isBrowser = isPlatformBrowser(this.platformId);

  currentFilter = signal<'all' | 'archive'>('all');

  filteredVacancies = computed(() => {
    if (this.currentFilter() === 'all') {
      return this._vacancies().filter((vacancy) => !vacancy.archive);
    }
    return this._vacancies().filter((vacancy) => vacancy.archive);
  });

  setFilter(filter: 'all' | 'archive', event: Event) {
    event.preventDefault();
    this.currentFilter.set(filter);
  }

  toggleArchive(vacancy: Vacancy) {
    this.onArchive.emit({
      vacancy,
      setArchive: !vacancy.archive,
    });
  }

  navigateToVacancy(slug: string) {
    if (slug) {
      this.router.navigate([`/vacancies/${slug}`]);
    }
  }
}
