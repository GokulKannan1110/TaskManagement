import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Task } from "../Model/Task";
import { catchError, exhaustMap, map, Observable, Subject, Subscription, take, tap, throwError } from "rxjs";
import { LoggingService } from "./Logging.service";
import { ErrorLog } from "../Model/ErrorLog";
import { AuthService } from "./auth.service";

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
        const headers = new HttpHeaders({ 'my-header': 'Hello World' })
        return this.http.post<{ name: string }>('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task.json',
            task, { headers: headers });
    }

    UpdateTask(id: string | undefined, data: Task ): Observable<any>{
       return this.http.put('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task/' + id+'.json', data)
        
    }

    DeleteTask(id: string | undefined) : Observable<any> {
        return this.http.delete("https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task/" + id + '.json',{observe: 'events'})
            .pipe(tap((event) => {
                console.log(event);
                if(event.type === HttpEventType.Response){

                }
            }));            
    }

    DeleteAllTasks() {
        this.http.delete('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task.json')
            .subscribe({
                next: (res) => {
                    console.log(res);
                    this.FetchAllTasks();
                }
            })
    }

    FetchAllTasks(): Observable<Task[]> {

        return this.http.get<{ [key: string]: Task }>('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task.json')
        .pipe(map((response) => {
            console.log(response);
            //Transforming Data
            let tasks = [];
            for (let key in response) {
                if (response.hasOwnProperty(key)) {
                    tasks.push({ ...response[key], id: key });
                }
            }
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
       return this.http.get('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/task/' +id+'.json')
       .pipe(map((response) => {
        let task = {};
        task = {...response, id: id};

        return task;
       }));       
    }
}