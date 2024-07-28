import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Task } from "../Model/Task";
import { catchError, exhaustMap, map, Observable, Subject, Subscription, take, tap, throwError } from "rxjs";
import { LoggingService } from "./Logging.service";
import { ErrorLog } from "../Model/ErrorLog";
import { AuthService } from "./auth.service";
import { User } from "../Model/User";
//import { v4 as uuid} from "uuid";
import { nanoid } from "nanoid";

@Injectable({
    providedIn: "root"
})
export class TaskService {

    http: HttpClient = inject(HttpClient);
    loggingService: LoggingService = inject(LoggingService);

    allTasks: Task[] = [];
    errorSubject: Subject<HttpErrorResponse> = new Subject<HttpErrorResponse>();
    authService: AuthService = inject(AuthService);

    CreateTask(task: Task) : Observable<any>{
        const loggedUser = this.getLoggedUser();
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            return throwError(() => errorResponse);
        }
        
        const userId = loggedUser.id;
        task.userId = userId;

        // const taskId = nanoid();
        // task.id = taskId;
        const headers = new HttpHeaders({ 'my-header': 'Hello World' })
        return this.http.post<any>('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '.json',
            task, { headers: headers });
        
    }

    UpdateTask(id: string | undefined, data: Task ): Observable<any>{
        const loggedUser = this.getLoggedUser();
        
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            return throwError(() => errorResponse);
        }

        const userId = loggedUser.id;
        data.userId = userId;
        return this.http.put('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '/'+ id + '.json', data)
        
    }

    DeleteTask(id: string | undefined) : Observable<any> {
        const loggedUser = this.getLoggedUser();
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            return throwError(() => errorResponse);
        }
        
        const userId = loggedUser.id;
        
        return this.http.delete('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '/' + id + '.json',{observe: 'events'})
            .pipe(tap((event) => {
                console.log(event);
                if(event.type === HttpEventType.Response){

                }
            }));            
    }

    DeleteAllTasks() {
        const loggedUser = this.getLoggedUser();
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            this.errorSubject.next(errorResponse);
        }
        
        const userId = loggedUser!.id;

        this.http.delete('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '.json')
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.FetchAllTasks();
                }
            })
    }

    FetchAllTasks(): Observable<Task[]> {
        const loggedUser = this.getLoggedUser();
        
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            return throwError(() => errorResponse);
        }

        const userId = loggedUser.id;
        return this.http.get<{ [key: string]: Task }>('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '.json')
        .pipe(map((response) => {
            console.log(response);
            //Transforming Data
            let tasks = [];
            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    tasks.push({ ...response[key], id: key });
                }
            }
            console.log(tasks);
            return tasks;
        }),catchError((err: HttpErrorResponse) => {
            //Logging the error to DB
            const errorLog = new ErrorLog(err.status, err.message, new Date())
            this.loggingService.logError(errorLog);
            return throwError(() => err);
        }));

        // let headers = new HttpHeaders();
        // headers = headers.set('content-type','application/json');
        // headers = headers.append('content-type','text/xml');

        // let queryParams = new HttpParams();
        // queryParams = queryParams.set('page',2);
        // queryParams = queryParams.set('items', 10);

        
    }

    FetchSpecificTask(id: string | undefined){
        const loggedUser = this.getLoggedUser();
        if(!loggedUser)
        {
            const errorResponse = new HttpErrorResponse({
                status: 401,
                statusText: 'Unauthorized'
            })

            this.errorSubject.next(errorResponse);
        }
        
        const userId = loggedUser!.id;

        return this.http.get('https://taskmanagement-9d0c2-default-rtdb.firebaseio.com/tasks/' + userId + '/' + id +'.json')
        .pipe(map((response) => {
        let task = {};
        task = {...response, id: id};

        return task;
        }));       
    }

    private getLoggedUser(): User | null{
        const user =  (localStorage.getItem('user') != null) ? JSON.parse(localStorage!.getItem('user')!) : null;        
        if(!user)
        {
            return null;
        }
        const loggedUser = new User(user.email, user.id, user._token, user._expiresIn);
        return loggedUser;
    }
}