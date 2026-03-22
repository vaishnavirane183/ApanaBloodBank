import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  error = "";
  loading = false;

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  submit(): void {
    this.error = "";
    if (this.loginForm.invalid) {
      this.error = "Please complete the form correctly.";
      return;
    }

    const { email, password } = this.loginForm.value;
    if (!email || !password) return;

    this.loading = true;
    this.auth.login(email, password).subscribe(
      (user) => {
        this.loading = false;
        if (user) {
          this.router.navigate(["/home"]);
        } else {
          this.error = "Invalid credentials";
        }
      },
      () => {
        this.loading = false;
        this.error = "Server error, try later.";
      },
    );
  }
}
