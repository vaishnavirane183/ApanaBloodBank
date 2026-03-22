import { Component, OnDestroy, OnInit } from "@angular/core";
import { interval, Subscription } from "rxjs";
import { PlanService } from "../../services/plan.service";
import { Plan } from "../../models/plan.model";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.css"],
})
export class PlanComponent implements OnInit, OnDestroy {
  plans: Plan[] = [];
  subscription?: Subscription;

  constructor(
    private planService: PlanService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.planService.getPlans().subscribe((plans) => (this.plans = plans));
    this.subscription = interval(4000).subscribe(() => {
      this.plans = this.plans.map((plan) => ({
        ...plan,
        progress:
          plan.progress < 100
            ? Math.min(100, plan.progress + Math.floor(Math.random() * 8) + 3)
            : 100,
      }));
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
