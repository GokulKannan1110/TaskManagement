import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Task } from '../../Model/Task';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, Subscription } from 'rxjs';
import { TaskService } from '../../Services/task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit, OnDestroy{
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];
  taskService: TaskService = new TaskService();
  isEditMode: Boolean = false;
  selectedTask!: Task;
  currentTaskId: string | undefined = '';
  isLoading: Boolean = false;
  errMessage: string | null = null;
  errorSub!: Subscription;
  showDetails: Boolean = false;
  taskId: string | undefined;

  ngOnInit(): void {
    this.FetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({
      next: (httpError) => {
        this.setErrorMessage(httpError);
      }
    })
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.selectedTask = new Task('', '', '', '', '', '');
  }
  FetchTasksClick() {
    this.FetchAllTasks();
  }
  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }
  CloseDetailsPopUp(){
    this.showDetails = false;
  }
  CreateTask(data: Task) {
    // console.log('Emitted Value: ');
    // console.log(data);
    if (this.isEditMode) {
      this.taskService.UpdateTask(this.currentTaskId, data).subscribe({
        next: (response) => {
          if (response != null) {
            this.FetchAllTasks();
          }
        }
      });;
    }
    else {
      this.taskService.CreateTask(data).subscribe({
        next: (resp) => {
            if(resp != null)
            {
                console.log('createtTask Respone:');
                console.log(resp);
                this.FetchAllTasks();
            }
        }
        ,error: (err) => {
        this.taskService.errorSubject.next(err);
    }});
    }

    //console.log(this.allTasks);
  }

  private FetchAllTasks() {
    this.isLoading = true;
    this.taskService.FetchAllTasks().subscribe({
      next: (res) => {
        this.allTasks = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.setErrorMessage(err);       
      }
    });
  }

  private setErrorMessage(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.errMessage = 'You do not have permission!'
    }
    else {
      this.errMessage = err.message;
    }
    setTimeout(() => {
      this.errMessage = null
    }, 3000);
  }
  /**
   * DeleteTask
   */
  public DeleteTask(id: string | undefined) {
    this.taskService.DeleteTask(id).subscribe({
      next: (res) => {
          console.log(res);
          this.FetchAllTasks();
      }
  });
  }

  /**
   * name
   */
  public DeleteAllTasks() {
    this.taskService.DeleteAllTasks();
  }

  OnEditTaskClicked(id: string | undefined) {
    this.showCreateTaskForm = true;
    this.isEditMode = true;
    console.log(id)
    //console.log(this.allTasks.find((task) => { return task.id === id }))
    this.selectedTask = <Task>this.allTasks.find((task) => { return task.id === id });
    this.currentTaskId = id;
    console.log(this.selectedTask);
  }

  OnDetailsClicked(id: string | undefined){
    console.log('Details Clicked!');
    this.showDetails = true;
    this.taskId = id;
  }
}
