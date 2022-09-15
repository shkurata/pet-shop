import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserInterface as User } from '@pet-shop/data';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'pet-shop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  constructor(private userService: UserService) {
    this.user$ = this.userService.user$;
  }
  ngOnInit(): void {
    this.userService.getLoggedInUser();
  }
}
