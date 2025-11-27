import { Component, inject } from '@angular/core';
import { FormationService } from '../../services/formation.service';
import { FormationCardComponent } from '../../shared/formation-card/formation-card.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormationCardComponent, FormsModule, NgForOf],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly formationService = inject(FormationService);
  private readonly router = inject(Router);

  upcoming = this.formationService.upcomingFormations;

  searchTitle = '';
  searchTag = '';

  goToCatalog(): void {
    const params: any = {};
    if (this.searchTitle) params.title = this.searchTitle;
    if (this.searchTag) params.tag = this.searchTag;
    this.router.navigate(['/catalog'], { queryParams: params });
  }
}
