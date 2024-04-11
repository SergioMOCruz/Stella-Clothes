import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { UserService } from '../../services/users/user.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})

export class HomeComponent {

  constructor(
    private userService: UserService
  ) { }

}
