import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Bloodstock } from "../../models/bloodstock.model";
import { BloodstockService } from "../../services/bloodstock.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-bloodstock",
  templateUrl: "./bloodstock.component.html",
  styleUrls: ["./bloodstock.component.css"],
})
export class BloodstockComponent implements OnInit {
  stocks: Bloodstock[] = [];
  selected: Bloodstock | null = null;
  feedback = "";

  stockForm = this.fb.group({
    bloodGroup: ["", Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
    location: ["", Validators.required],
    updatedAt: [new Date().toISOString().split("T")[0], Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private bloodstockService: BloodstockService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.bloodstockService.list().subscribe((data) => (this.stocks = data));
  }

  edit(stock: Bloodstock): void {
    this.selected = stock;
    this.stockForm.setValue({
      bloodGroup: stock.bloodGroup,
      quantity: stock.quantity,
      location: stock.location,
      updatedAt: stock.updatedAt,
    });
  }

  delete(id: number): void {
    this.bloodstockService.delete(id).subscribe(() => {
      this.feedback = "Stock entry deleted successfully";
      this.reload();
    });
  }
  useBlood(stock: Bloodstock): void {
    const units = 1; // Default to 1 unit, could be made configurable
    this.bloodstockService.useBlood(stock.id, units).subscribe({
      next: (updatedStock) => {
        this.feedback = `Blood used successfully! ${units} unit(s) of ${updatedStock.bloodGroup} used. Remaining: ${updatedStock.quantity}`;
        this.reload();
      },
      error: (error) => {
        this.feedback = error.message || "Error using blood. Please try again.";
        console.error("Use blood error:", error);
      },
    });
  }
  submit(): void {
    if (this.stockForm.invalid) {
      this.feedback = "Please fill all fields.";
      return;
    }

    const payload = this.stockForm.value as Omit<Bloodstock, "id">;

    if (this.selected) {
      const next: Bloodstock = { ...this.selected, ...payload };
      this.bloodstockService.update(next).subscribe(() => {
        this.feedback = "Stock updated successfully";
        this.selected = null;
        this.stockForm.reset({
          quantity: 1,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        this.reload();
      });
    } else {
      this.bloodstockService.create(payload).subscribe(() => {
        this.feedback = "Stock added successfully";
        this.stockForm.reset({
          quantity: 1,
          updatedAt: new Date().toISOString().split("T")[0],
        });
        this.reload();
      });
    }
  }

  cancelEdit() {
    this.selected = null;
    this.stockForm.reset({
      quantity: 1,
      updatedAt: new Date().toISOString().split("T")[0],
    });
    this.feedback = "";
  }
}
