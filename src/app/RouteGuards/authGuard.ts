import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../Services/auth.service";
import { inject } from "@angular/core";
import { map, Observable, take } from "rxjs";

export const canActivate = (
    router: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> => {
     const authService = inject(AuthService);
     const route = inject(Router);
     
     return authService.userSub.pipe(take(1), map((user) => {
        const loggedIn =  user ? true : false;
        if(loggedIn)
        {
            return true;
        }
        else{
            return route.createUrlTree(['/login']);
        }
     }))
} 