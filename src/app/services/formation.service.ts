import { Injectable, computed, signal, effect } from '@angular/core';
import { Formation, Participant } from '../models/formation.model';
import { UserService } from './user.service';
import { DistanceService } from './distance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  private readonly _formations = signal<Formation[]>([
    {
      id: 'f1',
      title: 'Introduction à Angular',
      place: 'Bruxelles',
      date: '2025-03-10',
      startTime: '09:00',
      endTime: '17:00',
      tags: ['Angular', 'Frontend'],
      price: 0,
      maxSeats: 20,
      participants: []
    },
    {
      id: 'f2',
      title: 'TailwindCSS avancé',
      place: 'Liège',
      date: '2025-04-02',
      startTime: '13:00',
      endTime: '17:00',
      tags: ['CSS', 'Tailwind'],
      price: 150,
      maxSeats: 15,
      participants: []
    },
    {
      id: 'f3',
      title: 'Architecture SPA & Routing Angular',
      place: 'Namur',
      date: '2025-05-15',
      startTime: '09:30',
      endTime: '16:30',
      tags: ['Angular', 'Routing'],
      price: 250,
      maxSeats: 12,
      participants: []
         
    },
    {
      id: 'f4',
      title: 'Développement Full Stack',
      place: 'Charleroi',
      date: '2025-06-20',
      startTime: '08:30',
      endTime: '16:30',
      tags: ['Java', 'Angular', 'FullStack'],
      price: 300,
      maxSeats: 18,
      participants: [],
      hidden: true    // <= obligatoire pour la cacher
    },

  ]);

  formations = this._formations.asReadonly();

  upcomingFormations = computed(() => {
    const now = new Date().toISOString().substring(0, 10);
    return this._formations().filter(f => f.date >= now);
  });

  constructor(
    private readonly userService: UserService,
    private readonly distanceService: DistanceService,
    private readonly snackBar: MatSnackBar
  ) {
    this._recomputeDistances();
    
    // Recalculer les distances automatiquement quand l'adresse de l'utilisateur change
    effect(() => {
      // Accéder au signal pour déclencher l'effet
      this.userService.user();
      this._recomputeDistances();
    });
  }

  private _recomputeDistances(): void {
    const userAddress = this.userService.user().address;
    this._formations.update(list =>
      list.map(f => ({
        ...f,
        distanceKm: this.distanceService.computeDistanceForFormation(f, userAddress)
      }))
    );
  }

  private _showMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  getById(id: string): Formation | undefined {
    return this._formations().find(f => f.id === id);
  }

  create(formation: Formation): void {
    this._formations.update(list => [...list, formation]);
    this._recomputeDistances();
    this._showMessage(`Formation "${formation.title}" créée.`);
  }

  update(formation: Formation): void {
    this._formations.update(list =>
      list.map(f => f.id === formation.id ? formation : f)
    );
    this._recomputeDistances();
    this._showMessage(`Formation "${formation.title}" mise à jour.`);
  }

  delete(id: string): void {
    const deleted = this.getById(id);
    this._formations.update(list => list.filter(f => f.id !== id));
    this._showMessage(
      deleted ? `Formation "${deleted.title}" supprimée.` : 'Formation supprimée.'
    );
  }

  duplicate(id: string): Formation | undefined {
    const src = this.getById(id);
    if (!src) { return undefined; }
    const copy: Formation = {
      ...src,
      id: 'copy-' + crypto.randomUUID(),
      title: src.title + ' (copie)',
      participants: []
    };
    this.create(copy);
    return copy;
  }

  addParticipant(formationId: string, participant: Participant): void {
    this._formations.update(list =>
      list.map(f =>
        f.id === formationId
          ? { ...f, participants: [...f.participants, participant] }
          : f
      )
    );
    this._showMessage(`Participant ajouté à "${this.getById(formationId)?.title}".`);
  }

  removeParticipant(formationId: string, participantId: string): void {
    this._formations.update(list =>
      list.map(f =>
        f.id === formationId
          ? { ...f, participants: f.participants.filter(p => p.id !== participantId) }
          : f
      )
    );
    this._showMessage('Participant supprimé.');
  }
}
