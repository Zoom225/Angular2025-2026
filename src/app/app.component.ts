import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { MarqueeHeaderComponent } from './shared/marquee-header/marquee-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MarqueeHeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent { }
