import { Component, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  @ViewChild('rightSideBar') rightSideBar: MatDrawer;

  isVisible: boolean = false;

  constructor() {}

  toogleOverlay() {
    this.isVisible = !this.isVisible;
  }

  toggleDrawer() {
    this.rightSideBar.toggle();
    this.toogleOverlay();
  }
}
