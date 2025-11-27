import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FormationService } from '../../services/formation.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { Formation } from '../../models/formation.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-formation',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgForOf, FormsModule],
  templateUrl: './create-formation.component.html'
})
export class CreateFormationComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly formationService = inject(FormationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form = this.fb.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    place: ['', Validators.required],
    date: ['', Validators.required],
    startTime: ['09:00', Validators.required],
    endTime: ['17:00', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    maxSeats: [10, [Validators.required, Validators.min(1)]],
    tags: this.fb.array<string>([])
  });

  get tagsArray(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  newTag = '';

  ngOnInit(): void {
    const duplicateId = this.route.snapshot.queryParamMap.get('duplicateId');
    if (duplicateId) {
      const src = this.formationService.getById(duplicateId);
      if (src) {
        this.form.patchValue({
          title: src.title + ' (copie)',
          place: src.place,
          date: src.date,
          startTime: src.startTime,
          endTime: src.endTime,
          price: src.price,
          maxSeats: src.maxSeats
        });
        src.tags.forEach(t => this.tagsArray.push(this.fb.control(t)));
      }
    }
  }

  addTag(): void {
    const value = this.newTag.trim();
    if (!value) return;
    if (this.tagsArray.length >= 5) return;
    this.tagsArray.push(this.fb.control(value));
    this.newTag = '';
  }

  removeTag(index: number): void {
    this.tagsArray.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const formation: Formation = {
      id: value.id || crypto.randomUUID(),
      title: value.title!,
      place: value.place!,
      date: value.date!,
      startTime: value.startTime!,
      endTime: value.endTime!,
      tags: (value.tags ?? []) as string[],
      price: value.price!,
      maxSeats: value.maxSeats!,
      participants: []
    };

    this.formationService.create(formation);
    this.router.navigate(['/formation', formation.id]);
  }
}
