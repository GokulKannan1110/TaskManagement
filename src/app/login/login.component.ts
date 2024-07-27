import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../Model/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode: boolean = true;
  authForm!: FormGroup;
  authService: AuthService = inject(AuthService);
  isLoading: boolean = false;
  errMessage: string | null = null;
  authObs!: Observable<AuthResponse>;
  router: Router = inject(Router);

  ngOnInit()
  {
    this.authForm = new FormGroup({
      emailaddress: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }


  OnSwitchMode()
  {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSumitted()
  {
    //console.log(this.authForm.value)
    //this.authForm.reset();
    const email = this.authForm.get('emailaddress')?.value;
    const password = this.authForm.get('password')?.value;
    if(this.isLoginMode)
    {
      //Login Logic
      this.isLoading = true;   
      
      this.authObs = this.authService.signin(email, password);
    }
    else{
      this.isLoading = true;    
      this.authObs = this.authService.signup(email, password)
    }
    this.authObs.subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/dashboard/overview']);
      },
      error: (errMsg) => {        
        this.isLoading = false;
        //console.log('error logged');
        this.errMessage = errMsg;
        this.hideSnackBar();
      }
    });
  }

  

  private hideSnackBar()
  {
    setTimeout(() => {
      this.errMessage = null;
    }, 3000)
  }
}
