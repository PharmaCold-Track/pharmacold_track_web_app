import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-header></app-header>
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
      overflow: hidden;
    }
    .content-body {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }
  `]
})
export class MainLayoutComponent {}
