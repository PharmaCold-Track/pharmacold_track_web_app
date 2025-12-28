import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../entities/user/api/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="brand">
        <span class="page-title">Dashboard</span>
      </div>

      <div class="user-controls">
        <span class="username">
          Hola, {{ authService.currentUser()?.username }}
        </span>
        <button class="logout-btn" (click)="authService.logout()">
          <i class="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  authService = inject(AuthService);
}
