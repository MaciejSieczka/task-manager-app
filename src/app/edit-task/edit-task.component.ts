import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  taskForm: FormGroup;
  taskId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.taskForm.patchValue(task);
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe(
        (updatedTask) => {
          console.log('Zadanie zostało zaktualizowane:', updatedTask);
          this.router.navigate(['/tasks']); // Powrót do listy zadań
        },
        (error) => {
          console.error('Błąd podczas aktualizacji zadania:', error);
        }
      );
    }
  }
}