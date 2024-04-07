import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [MatSidenavModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {

  @Output() closeMenuTrigger = new EventEmitter<void>();
  @ViewChild('rightSideBar') rightSideBar: MatDrawer;

  isVisible: boolean = false;

  constructor() {}

  toogleOverlay() {
    this.isVisible = !this.isVisible;
  }

  toggleDrawer() {
    this.rightSideBar.toggle();
    this.toogleOverlay();
    this.closeMenuTrigger.emit();
  }
}
