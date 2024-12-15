import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
     private taskService: TaskService,
    private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(500)]],
      assignedTo: [null, []],
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task = {
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        status: 'Otwarte', 
        assignedTo: null,
      };
  
      this.taskService.createTask(task).subscribe(
        (response) => {
          console.log('Zadanie zostało dodane:', response);
          this.taskForm.reset(); 
          this.router.navigate(['/tasks']);
        },
        (error) => {
          console.error('Błąd podczas dodawania zadania:', error);
        }
      );
    }
  }
  
}