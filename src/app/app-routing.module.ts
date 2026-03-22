import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { HomeComponent } from "./components/home/home.component";
import { PlanComponent } from "./components/plan/plan.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { DonorComponent } from "./components/donor/donor.component";
import { BloodstockComponent } from "./components/bloodstock/bloodstock.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "home", component: HomeComponent },
  { path: "plans", component: PlanComponent, canActivate: [AuthGuard] },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "donors", component: DonorComponent, canActivate: [AuthGuard] },
  {
    path: "bloodstocks",
    component: BloodstockComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
