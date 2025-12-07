import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserProfile } from '../../models/formation.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  userSignal = this.userService.user;
  isAdmin = this.userService.isAdmin;
  fullName = this.userService.fullName;

  profileForm!: FormGroup;
  isSaving = signal(false);
  hasChanges = signal(false);

  ngOnInit(): void {
    this._initializeForm();
    
    // Détecter les changements dans le formulaire
    this.profileForm.valueChanges.subscribe(() => {
      this.hasChanges.set(true);
    });

    // Synchroniser avec les changements du service
    effect(() => {
      const user = this.userSignal();
      if (!this.isSaving()) {
        this._updateFormFromUser(user);
        this.hasChanges.set(false);
      }
    });
  }

  /**
   * Initialise le formulaire réactif avec validation
   */
  private _initializeForm(): void {
    const user = this.userSignal();
    this.profileForm = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: [user.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [user.email, [Validators.required, Validators.email]],
      birthDate: [user.birthDate, [Validators.required]],
      address: [user.address, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  /**
   * Met à jour le formulaire avec les valeurs de l'utilisateur
   */
  private _updateFormFromUser(user: UserProfile): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      address: user.address
    }, { emitEvent: false });
  }

  /**
   * Sauvegarde le profil
   */
  save(): void {
    if (this.profileForm.invalid) {
      this._markFormGroupTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.profileForm.value;
    
    const updatedProfile: Partial<UserProfile> = {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim(),
      birthDate: formValue.birthDate,
      address: formValue.address.trim()
    };

    const success = this.userService.updateProfile(updatedProfile);
    
    if (success) {
      this.hasChanges.set(false);
    }
    
    this.isSaving.set(false);
  }

  /**
   * Réinitialise le formulaire aux valeurs actuelles
   */
  reset(): void {
    this._updateFormFromUser(this.userSignal());
    this.hasChanges.set(false);
  }

  /**
   * Réinitialise le profil aux valeurs par défaut
   */
  resetToDefault(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre profil aux valeurs par défaut ?')) {
      this.userService.resetProfile();
    }
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  private _markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Vérifie si un champ a une erreur
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.touched || control.dirty));
  }

  /**
   * Obtient le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    
    if (!control || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }
    
    if (control.hasError('email')) {
      return 'Email invalide';
    }
    
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères autorisés`;
    }

    return 'Valeur invalide';
  }
}
