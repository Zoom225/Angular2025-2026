import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private readonly userService = inject(UserService);

  isOpen = signal(false);

  user = this.userService.user;

  toggleMenu(): void {
    this.isOpen.update(open => !open);
  }

  toggleRole(): void {
    this.userService.toggleRole();
  }
}
