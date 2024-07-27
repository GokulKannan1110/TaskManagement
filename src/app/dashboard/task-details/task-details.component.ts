import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent implements OnInit{

  @Input() taskId: string | undefined;
  taskService: TaskService = inject(TaskService);
  task: Task | null = null;

  @Output()
  detailClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log('task details - ngOnInit');
    this.taskService.FetchSpecificTask(this.taskId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.task = response
      }
    })
  }

  OnCloseClick(){
    this.detailClose.emit(false);
  }

}
