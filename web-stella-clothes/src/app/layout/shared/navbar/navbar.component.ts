import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, RightSidebarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @ViewChild('rightSidebar') rightSidebar!: RightSidebarComponent;

  isVisible: boolean = false;

  constructor() {}

  toogleOverlay() {
    this.isVisible = !this.isVisible;
  }

  toggleRightSidebar() {
    this.rightSidebar.toggleDrawer();
  }
}
