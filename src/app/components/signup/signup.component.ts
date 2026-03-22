import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  error = "";
  success = "";
  loading = false;

  signupForm = this.fb.group({
    name: ["", [Validators.required]],
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
    this.success = "";

    if (this.signupForm.invalid) {
      this.error = "Please complete the form correctly.";
      return;
    }

    const formValues = this.signupForm.value as {
      name: string;
      email: string;
      password: string;
    };
    const payload = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      role: "user",
    } as Omit<User, "id">;
    this.loading = true;
    this.auth.signup(payload).subscribe(
      () => {
        this.loading = false;
        this.success = "Account created. Redirecting to login...";
        setTimeout(() => this.router.navigate(["/login"]), 1200);
      },
      () => {
        this.loading = false;
        this.error = "Signup failed, maybe email already used.";
      },
    );
  }
}
