import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/auth/login`, { username, password }, { responseType: 'text' as 'json' });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  setAuthenticated(status: boolean): void {
    this.isLoggedInSubject.next(status);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }
}