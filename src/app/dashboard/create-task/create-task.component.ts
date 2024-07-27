import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements AfterViewInit{
  @Input() isEditMode: Boolean = false;

  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  @ViewChild('taskForm') taskForm!: NgForm;
  @Input() selectedTask!: Task;

  ngAfterViewInit()
  {
    console.log(this.taskForm.value)
    setTimeout(() =>{
      this.taskForm.form.patchValue(this.selectedTask);
    }, 0)    
  }

  OnCloseForm(){
    this.CloseForm.emit(false);
  }

  FormSubmitted(form: NgForm)
  {
    console.log(form);
    this.EmitTaskData.emit(form.value);
    this.CloseForm.emit(false);
  }
}
