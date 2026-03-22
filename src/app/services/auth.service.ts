import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users`, user);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<
        User[]
      >(`${environment.apiUrl}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      .pipe(
        map((users) => {
          if (users && users.length > 0) {
            localStorage.setItem("currentUser", JSON.stringify(users[0]));
            return users[0];
          }
          return null;
        }),
      );
  }

  logout(): void {
    localStorage.removeItem("currentUser");
    this.router.navigate(["/login"]);
  }

  get currentUser(): User | null {
    const raw = localStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as User) : null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === "admin";
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }
}
