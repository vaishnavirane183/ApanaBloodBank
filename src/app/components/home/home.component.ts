import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { DonorService } from "../../services/donor.service";
import { BloodstockService } from "../../services/bloodstock.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  totalDonors = 0;
  totalBloodUnits = 0;

  constructor(
    public auth: AuthService,
    private donorService: DonorService,
    private bloodstockService: BloodstockService,
  ) {}

  ngOnInit(): void {
    this.donorService
      .list()
      .subscribe((donors) => (this.totalDonors = donors.length));
    this.bloodstockService.list().subscribe((stocks) => {
      this.totalBloodUnits = stocks.reduce((sum, s) => sum + s.quantity, 0);
    });
  }
}
