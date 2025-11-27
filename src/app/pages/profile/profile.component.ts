import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  private readonly userService = inject(UserService);

  userSignal = this.userService.user;

  model = { ...this.userSignal() };

  save(): void {
    this.userService.updateProfile(this.model);
  }
}
