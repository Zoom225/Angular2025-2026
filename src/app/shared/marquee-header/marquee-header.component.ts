import { Component } from '@angular/core';

@Component({
  selector: 'app-marquee-header',
  standalone: true,
  template: `
    <div class="marquee-container">
      <div class="marquee-content">
        <span class="marquee-text">Kangoute Azoumanan • EPHEC • Prof encadrant : HARDENNE Romain</span>
        <span class="marquee-text">Kangoute Azoumanan • EPHEC • Prof encadrant : HARDENNE Romain</span>
        <span class="marquee-text">Kangoute Azoumanan • EPHEC • Prof encadrant : HARDENNE Romain</span>
      </div>
    </div>
  `,
  styles: [`
    .marquee-container {
      width: 100%;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      padding: 12px 0;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .marquee-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.1) 50%, 
        transparent 100%);
      animation: shimmer 3s infinite;
      pointer-events: none;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .marquee-content {
      display: flex;
      white-space: nowrap;
      animation: marquee 30s linear infinite;
      gap: 60px;
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333%); }
    }

    .marquee-text {
      font-size: 14px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      display: inline-block;
      padding: 0 30px;
    }

    @media (max-width: 768px) {
      .marquee-text {
        font-size: 11px;
        letter-spacing: 1px;
        padding: 0 20px;
      }
    }
  `]
})
export class MarqueeHeaderComponent {}


