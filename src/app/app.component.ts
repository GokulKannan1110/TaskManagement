import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'AngularAuthentication';
  authService: AuthService = inject(AuthService);

  ngOnInit(){
    this.authService.autoLogin();
  }
}
