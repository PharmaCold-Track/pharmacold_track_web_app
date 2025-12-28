import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, User } from '../model/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/authentication`;

  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  signIn(credentials: { username: string; password: string }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/sign-in`, credentials).pipe(
      tap(response => {
        this.saveUserToStorage(response);
        this.currentUser.set(response);
      }),
      map(response => response as User)
    );
  }

  logout() {
    localStorage.removeItem('user_session');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private saveUserToStorage(user: AuthResponse) {
    localStorage.setItem('user_session', JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_session');
    return user ? JSON.parse(user) : null;
  }
}
