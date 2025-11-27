import { Component, EventEmitter, Output, input, computed } from '@angular/core';
import { Formation } from '../../models/formation.model';
import { NgIf, NgForOf, NgClass, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formation-card',
  standalone: true,
  imports: [NgIf, NgForOf, RouterLink, NgClass, DecimalPipe],
  templateUrl: './formation-card.component.html'
})
export class FormationCardComponent {

  formation = input.required<Formation>();
  showActions = input<boolean>(false);

  @Output() delete = new EventEmitter<string>();

  isFree = computed(() => this.formation().price === 0);
  isAngular = computed(() => this.formation().tags.includes('Angular'));

  onDeleteClick(): void {
    this.delete.emit(this.formation().id);
  }
}
