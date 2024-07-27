import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { exhaustMap, Observable, take, tap } from "rxjs";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export class AuthInterceptorService implements HttpInterceptor
{
    authService: AuthService = inject(AuthService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //throw new Error("Method not implemented.");
        //console.log('Auth Interceptor Called!');
       return this.authService.userSub.pipe(take(1), exhaustMap(user => {
                if(!user)
                {
                    return next.handle(req);
                }
            const modifiedReq = req.clone({params:new HttpParams().set('auth', user!.token!) });
            return next.handle(modifiedReq).pipe(tap((event) => {
                if(event.type === HttpEventType.Response){
                    console.log('Response has arrived, Response data: ');
                    console.log(event.body);
                }
            }));
        }))
        
        
    }

}