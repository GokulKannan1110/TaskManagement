import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ErrorLog } from "../Model/ErrorLog";

@Injectable({
    providedIn: 'root'
})

export class LoggingService{
    http: HttpClient = inject(HttpClient);

    logError(data: ErrorLog){
        this.http.post('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/logs.json', data)
        .subscribe()
    }

    fetchErrors(){
        this.http.get('https://angularhttpclient-9e62b-default-rtdb.firebaseio.com/logs.json')
        .subscribe({
            next: (data) => {
                console.log(data);
            }
        })
    }

}