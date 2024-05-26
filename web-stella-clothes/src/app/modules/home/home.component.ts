import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})

export class HomeComponent {

  constructor(
    private _router: Router
  ) { }

  redirectToCategory(reference) {
    this._router.navigate(['/category/' + reference]).then(() => {
      window.location.reload();
    });
  }
}
