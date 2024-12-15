import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: { id: number; username: string };
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private attachmentApiUrl = 'http://localhost:8080/api/attachments';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, task);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  assignTaskToCurrentUser(taskId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/${taskId}/assign`, {}, { headers });
  }

  deleteTask(taskId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/delete/${taskId}`, { headers });
  }

  updateTask(taskId: number, updatedTask: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(`${this.apiUrl}/update/${taskId}`, updatedTask, { headers });
  }

  getAttachments(taskId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.get<any[]>(
      `${this.attachmentApiUrl}/task/${taskId}`,
      { headers }
    );
  }

  uploadAttachment(taskId: number, file: File): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(
      `${this.attachmentApiUrl}/upload/${taskId}`,
      formData,
      { headers }
    );
  }

  downloadAttachment(attachmentId: number): Observable<{ blob: Blob; fileName: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.attachmentApiUrl}/${attachmentId}/download`, {
      headers,
      observe: 'response',
      responseType: 'blob',
    }).pipe(
      map((response: any) => {
        console.log('Response headers:', response.headers.keys());
        const contentDisposition = response.headers.get('Content-Disposition');
        console.log('Content-Disposition:', contentDisposition);

        let fileName = 'plik.bin';
        if (contentDisposition) {
          const filenameMatch = contentDisposition?.match(/filename\*?=['"]?(?:UTF-8'')?([^;\r\n"]+)/);
          if (filenameMatch) {
            fileName = decodeURIComponent(filenameMatch[1]);
          }
        }

        console.log('File name extracted:', fileName);
        return {
          blob: response.body,
          fileName: fileName,
        };
      })
    );
  }


}
