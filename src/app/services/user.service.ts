import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _user = signal<UserProfile>({
    id: 'user-1',
    firstName: 'Kangoute',
    lastName: 'Azoumanan',
    email: 'kangoute@example.com',
    birthDate: '1990-01-01',
    address: 'Bruxelles, Belgique',
    role: 'user'
  });

  user = this._user.asReadonly();

  toggleRole(): void {
    this._user.update(u => ({
      ...u,
      role: u.role === 'user' ? 'admin' : 'user'
    }));
  }

  updateProfile(profile: UserProfile): void {
    this._user.set(profile);
  }
}
