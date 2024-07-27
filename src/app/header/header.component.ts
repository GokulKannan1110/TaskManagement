import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { User } from '../Model/User';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  authService: AuthService = inject(AuthService);
  isLoggedIn: boolean = false;
  private userSubject!: Subscription;

  ngOnInit()
  {
    this.userSubject = this.authService.userSub.subscribe({
      next: (user: User | null) => {
        this.isLoggedIn = user ? true : false;
      }
    })
  }

  ngOnDestroy(): void {
    this.userSubject.unsubscribe();
  }

  onLogOut(){
    this.authService.logOut();
  }
}
