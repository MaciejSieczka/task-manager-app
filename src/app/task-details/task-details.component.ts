import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  task: any;
  attachments: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTaskDetails(taskId);
    this.loadAttachments(taskId);
  }

  loadTaskDetails(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe(
      (task) => {
        this.task = task;
      },
      (error) => {
        console.error('Błąd podczas ładowania szczegółów zadania:', error);
      }
    );
  }

  loadAttachments(taskId: number): void {
    this.taskService.getAttachments(taskId).subscribe(
      (attachments) => {
        this.attachments = attachments;
      },
      (error) => {
        console.error('Błąd podczas ładowania załączników:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onFileUpload(): void {
    if (this.selectedFile && this.task) {
      this.taskService.uploadAttachment(this.task.id, this.selectedFile).subscribe(
        (response) => {
          console.log('Plik został przesłany:', response);
          this.loadAttachments(this.task.id); // Odśwież listę załączników
          this.selectedFile = null; // Wyczyść wybrany plik
        },
        (error) => {
          console.error('Błąd podczas przesyłania pliku:', error);
        }
      );
    }
  }

  downloadAttachment(attachmentId: number): void {
    this.taskService.downloadAttachment(attachmentId).subscribe(
      ({ blob, fileName }: { blob: Blob; fileName: string }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Pobierz nazwę pliku z odpowiedzi
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error: HttpErrorResponse) => {
        console.error('Błąd podczas pobierania załącznika:', error.message);
      }
    );
  }
}