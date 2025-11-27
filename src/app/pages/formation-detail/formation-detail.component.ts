import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormationService } from '../../services/formation.service';
import { NgIf, NgForOf, DecimalPipe } from '@angular/common';
import { Formation } from '../../models/formation.model';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [NgIf, NgForOf, RouterLink, DecimalPipe],
  templateUrl: './formation-detail.component.html'
})
export class FormationDetailComponent implements OnInit {

  private readonly formationService = inject(FormationService);
  private readonly route = inject(ActivatedRoute);

  formation?: Formation;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formation = this.formationService.getById(id);
    }
  }
}
