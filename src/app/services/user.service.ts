import { Injectable, signal, computed, effect } from '@angular/core';
import { UserProfile, UserRole } from '../models/formation.model';
import { MatSnackBar } from '@angular/material/snack-bar';

const STORAGE_KEY = 'user_profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly defaultUser: UserProfile = {
    id: 'user-1',
    firstName: 'Kangoute',
    lastName: 'Azoumanan',
    email: 'kangoute@example.com',
    birthDate: '1990-01-01',
    address: 'Bruxelles, Belgique',
    role: 'user'
  };

  private readonly _user = signal<UserProfile>(this._loadFromStorage());

  user = this._user.asReadonly();

  // Computed signals pour faciliter l'accès
  isAdmin = computed(() => this._user().role === 'admin');
  isUser = computed(() => this._user().role === 'user');
  fullName = computed(() => `${this._user().firstName} ${this._user().lastName}`);

  constructor(private readonly snackBar: MatSnackBar) {
    // Sauvegarder automatiquement à chaque changement
    effect(() => {
      this._saveToStorage(this._user());
    });
  }

  /**
   * Charge le profil utilisateur depuis le localStorage
   */
  private _loadFromStorage(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Valider que les données sont complètes
        if (this._isValidProfile(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du profil depuis le localStorage:', error);
    }
    return this.defaultUser;
  }

  /**
   * Sauvegarde le profil utilisateur dans le localStorage
   */
  private _saveToStorage(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil dans le localStorage:', error);
    }
  }

  /**
   * Valide qu'un profil utilisateur est complet et valide
   */
  private _isValidProfile(profile: any): profile is UserProfile {
    return (
      profile &&
      typeof profile.id === 'string' &&
      typeof profile.firstName === 'string' &&
      typeof profile.lastName === 'string' &&
      typeof profile.email === 'string' &&
      typeof profile.birthDate === 'string' &&
      typeof profile.address === 'string' &&
      (profile.role === 'admin' || profile.role === 'user')
    );
  }

  /**
   * Valide un email
   */
  private _isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide une date de naissance (doit être dans le passé)
   */
  private _isValidBirthDate(date: string): boolean {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today && !isNaN(birthDate.getTime());
  }

  /**
   * Affiche un message de notification
   */
  private _showMessage(message: string, action: string = 'OK'): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  /**
   * Bascule entre les rôles admin et user
   */
  toggleRole(): void {
    const newRole: UserRole = this._user().role === 'user' ? 'admin' : 'user';
    this._user.update(u => ({
      ...u,
      role: newRole
    }));
    this._showMessage(`Rôle changé en mode ${newRole}`);
  }

  /**
   * Met à jour le profil utilisateur avec validation
   */
  updateProfile(profile: Partial<UserProfile>): boolean {
    const currentProfile = this._user();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...profile
    };

    // Validation
    if (!updatedProfile.firstName?.trim()) {
      this._showMessage('Le prénom est requis', 'Erreur');
      return false;
    }

    if (!updatedProfile.lastName?.trim()) {
      this._showMessage('Le nom est requis', 'Erreur');
      return false;
    }

    if (!updatedProfile.email?.trim()) {
      this._showMessage('L\'email est requis', 'Erreur');
      return false;
    }

    if (!this._isValidEmail(updatedProfile.email)) {
      this._showMessage('L\'email n\'est pas valide', 'Erreur');
      return false;
    }

    if (!updatedProfile.birthDate) {
      this._showMessage('La date de naissance est requise', 'Erreur');
      return false;
    }

    if (!this._isValidBirthDate(updatedProfile.birthDate)) {
      this._showMessage('La date de naissance doit être dans le passé', 'Erreur');
      return false;
    }

    if (!updatedProfile.address?.trim()) {
      this._showMessage('L\'adresse est requise', 'Erreur');
      return false;
    }

    // Mise à jour
    this._user.set(updatedProfile);
    this._showMessage('Profil mis à jour avec succès');
    return true;
  }

  /**
   * Réinitialise le profil aux valeurs par défaut
   */
  resetProfile(): void {
    this._user.set(this.defaultUser);
    this._showMessage('Profil réinitialisé');
  }

  /**
   * Vérifie si l'utilisateur a le rôle admin
   */
  hasAdminRole(): boolean {
    return this._user().role === 'admin';
  }

  /**
   * Vérifie si l'utilisateur a le rôle user
   */
  hasUserRole(): boolean {
    return this._user().role === 'user';
  }

  /**
   * Obtient l'ID de l'utilisateur actuel
   */
  getUserId(): string {
    return this._user().id;
  }

  /**
   * Obtient l'adresse de l'utilisateur actuel
   */
  getUserAddress(): string {
    return this._user().address;
  }
}
