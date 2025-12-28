import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="logo-area">
        <h2>PharmaCold</h2>
      </div>

      <nav class="nav-links">
        <a routerLink="/shipments" routerLinkActive="active" class="nav-item">
          <span>📦</span> Envíos
        </a>
        <a routerLink="/monitoring" routerLinkActive="active" class="nav-item">
          <span>🌡️</span> Monitoreo
        </a>
        <a routerLink="/monitoring" routerLinkActive="active" class="nav-item">
          <span>📡</span> Simulador IoT
        </a>
        </nav>
    </aside>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {}
