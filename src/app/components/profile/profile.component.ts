import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  editMode = false;
  message = "";

  profileForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    age: [null],
    location: [""],
    bloodGroup: [""],
    phone: [""],
    lastDonation: [""],
  });

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
  ) {
    const user = this.auth.currentUser;
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        password: user.password,
        age: user.age || null,
        location: user.location || "",
        bloodGroup: user.bloodGroup || "",
        phone: user.phone || "",
        lastDonation: user.lastDonation || "",
      });
    }
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    this.message = "";
  }

  save() {
    if (!this.auth.currentUser) {
      this.message = "Login required to update profile.";
      return;
    }

    if (this.profileForm.invalid) {
      this.message = "Please fill all fields correctly.";
      return;
    }

    const updated = { ...this.auth.currentUser, ...this.profileForm.value };
    localStorage.setItem("currentUser", JSON.stringify(updated));
    this.message = "Profile saved locally. Refresh to see changes.";
    this.editMode = false;
  }
}
