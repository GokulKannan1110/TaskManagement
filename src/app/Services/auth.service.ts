import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthResponse } from "../Model/AuthResponse";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable()

export class AuthService{
    httpClient: HttpClient = inject(HttpClient);
    userSub = new BehaviorSubject<User | null>(null);
    router: Router = inject(Router);
    private tokenExpireTimer: any;

    signup(email: string, password: string){
        //console.log(email);
        //console.log(password);
        const data = {email: email, password: password, returnSecureToken: true};
        return this.httpClient
        .post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey
            , data
        ).pipe(
            catchError(this.handleError),
            //tap(this.handleCreateUser)------//The issue you're encountering is due to the context of this being lost when handleCreateUser is used as a callback within the tap operator. In JavaScript, when a method is passed as a callback, it loses its context (this), leading to this.userSub being undefined.
            tap((res) => {
                this.handleCreateUser(res);
            })
        );
    }

    signin(email: string, password: string)
    {
        const data = {email: email, password: password, returnSecureToken: true};        
        return this.httpClient.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
             data
            ).pipe(
                catchError(this.handleError),
                //tap(this.handleCreateUser)------//The issue you're encountering is due to the 
                //context of this being lost when handleCreateUser is used as a callback within the tap operator. In JavaScript, when a method is passed as a callback, it loses its context (this), leading to this.userSub being undefined.
                tap((res) => {
                    this.handleCreateUser(res);
                })           
            );
    }

    logOut(){
        this.userSub.next(null);
        this.router.navigate(['/login'])
        localStorage.removeItem('user');

        if(this.tokenExpireTimer)
        {
            clearTimeout(this.tokenExpireTimer)
        }
        this.tokenExpireTimer = null;
    }

    autoLogin()
    {
        const user =  (localStorage.getItem('user') != null) ? JSON.parse(localStorage!.getItem('user')!) : null;
        if(!user)
        {
            return;
        }

        const loggedUser = new User(user.email, user.id, user._token, user._expiresIn)
        if(loggedUser.token)
        {
            this.userSub.next(loggedUser);
            const timerValue = new Date(user._expiresIn).getTime() - new Date().getTime();
            this.autoLogout(timerValue);
        }
    }

    autoLogout(expiresIn : number){
        this.tokenExpireTimer = setTimeout(() => {
            this.logOut();
        }, expiresIn);
    }

    private handleCreateUser(res: any){
        const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
        const expiresIn = new Date(expiresInTs);
        const user =  new User(res.email, res.localId, res.idToken, expiresIn);
        console.log(user);
        this.userSub.next(user);
        //console.log('test');

        this.autoLogout(res.expiresIn * 1000);
        localStorage.setItem('user', JSON.stringify(user));
    }

    private handleError(err: any){
        console.log(err);
        let errorMessage = "An Unknown Error has Occured";
        if(!err.error || !err.error.error)
        {
            return throwError(() => errorMessage);
        }
        else
        {
            switch (err.error.error.message){
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMessage = "Invalid Email or Password.";
                    break                
                case 'USER_DISABLED':
                    errorMessage = "User is Disabled.";
                    break;
                case 'EMAIL_EXISTS':
                    errorMessage = "The email address already exists.";
                    break
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = "This operation is not allowed.";
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = "Too Many Attempts. Please Try Again Later.";
            }
            return throwError(() => errorMessage);
        }
    }

}