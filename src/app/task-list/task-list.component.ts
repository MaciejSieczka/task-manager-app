import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  assignTask(taskId: number): void {
    this.taskService.assignTaskToCurrentUser(taskId).subscribe(
      (updatedTask) => {
        console.log('Zadanie zostało przypisane:', updatedTask);
        this.loadTasks();
      },
      (error) => {
        console.error('Błąd podczas przypisywania zadania:', error);
      }
    );
  }
  
  deleteTask(taskId: number): void {
    if (confirm('Czy na pewno chcesz usunąć to zadanie?')) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          console.log(`Zadanie: ${taskId} zostało usunięte.`);
          this.loadTasks();
        },
        (error) => {
          console.error('Błąd podczas usuwania zadania:', error);
        }
      );
    }
  }
}