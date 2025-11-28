import { Component, OnInit, inject } from '@angular/core';
import { FormationService } from '../../services/formation.service';
import { FormationCardComponent } from '../../shared/formation-card/formation-card.component';
import { DistanceFilterComponent } from '../../shared/distance-filter/distance-filter.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from '../../models/formation.model';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-formation-catalog',
  standalone: true,
  imports: [FormationCardComponent, DistanceFilterComponent, FormsModule, NgForOf],
  templateUrl: './formation-catalog.component.html'
})
export class FormationCatalogComponent implements OnInit {

  private readonly formationService = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  formationsSignal = this.formationService.formations;

  titleFilter = '';
  tagFilter = '';
  minDate = '';
  maxDate = '';
  onlyAvailable = false;
  maxPrice?: number;
  maxDistance: number = 0;

  page = 1;
  pageSize = 6;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.titleFilter = params.get('title') ?? '';
      this.tagFilter = params.get('tag') ?? '';
    });
  }

  get filteredFormations(): Formation[] {
    let list = [...this.formationsSignal()];
    // AJOUT ICI : on enlève les formations cachées
  list = list.filter(f => f.hidden !== true);


    if (this.titleFilter) {
      const t = this.titleFilter.toLowerCase();
      list = list.filter(f => f.title.toLowerCase().includes(t));
    }
    if (this.tagFilter) {
      const tag = this.tagFilter.toLowerCase();
      list = list.filter(f => f.tags.some(t => t.toLowerCase().includes(tag)));
    }
    if (this.minDate) {
      list = list.filter(f => f.date >= this.minDate);
    }
    if (this.maxDate) {
      list = list.filter(f => f.date <= this.maxDate);
    }
    if (this.onlyAvailable) {
      list = list.filter(f => f.participants.length < f.maxSeats);
    }
    if (this.maxPrice != null) {
      list = list.filter(f => f.price <= this.maxPrice!);
    }
    if (this.maxDistance > 0) {
      list = list.filter(f => (f.distanceKm ?? 0) <= this.maxDistance);
    }

    return list;
  }

  get pagedFormations(): Formation[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredFormations.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredFormations.length / this.pageSize));
  }

  updateQueryParams(): void {
    const params: any = {};
    if (this.titleFilter) params.title = this.titleFilter;
    if (this.tagFilter) params.tag = this.tagFilter;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    });
  }

  changePage(delta: number): void {
    const next = this.page + delta;
    if (next >= 1 && next <= this.totalPages) {
      this.page = next;
    }
  }
}
