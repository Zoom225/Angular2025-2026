import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-distance-filter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <label class="block text-xs font-medium text-slate-500 mb-1">
      Distance max (km)
    </label>
    <input type="number"
           [(ngModel)]="distance"
           (ngModelChange)="distanceChange.emit(distance)"
           min="0"
           class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
  `
})
export class DistanceFilterComponent {
  @Input() distance = 0;
  @Output() distanceChange = new EventEmitter<number>();
}
