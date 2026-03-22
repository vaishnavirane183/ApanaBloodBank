import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Donor } from "../../models/donor.model";
import { DonorService } from "../../services/donor.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-donor",
  templateUrl: "./donor.component.html",
  styleUrls: ["./donor.component.css"],
})
export class DonorComponent implements OnInit {
  donors: Donor[] = [];
  selected: Donor | null = null;
  feedback = "";

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 7; // Show 5 donors per page to fit with form
  totalPages = 1;

  donorForm = this.fb.group({
    name: ["", Validators.required],
    bloodGroup: ["", Validators.required],
    age: [18, [Validators.required, Validators.min(18)]],
    location: ["", Validators.required],
    lastDonation: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private donorService: DonorService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.donorService.list().subscribe((data) => {
      this.donors = data;
      this.totalPages = Math.ceil(this.donors.length / this.itemsPerPage);
      // Reset to first page if current page is out of bounds
      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }
    });
  }

  get paginatedDonors(): Donor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.donors.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  edit(donor: Donor): void {
    this.selected = donor;
    this.donorForm.setValue({
      name: donor.name,
      bloodGroup: donor.bloodGroup,
      age: donor.age,
      location: donor.location,
      lastDonation: donor.lastDonation,
    });
  }

  delete(id: number): void {
    this.donorService.delete(id).subscribe(() => {
      this.feedback = "Donor deleted successfully";
      this.reload();
    });
  }

  donate(donor: Donor): void {
    this.donorService.donate(donor.id).subscribe({
      next: (result) => {
        this.feedback = `Blood donation recorded successfully! Stock updated for ${result.bloodstock.bloodGroup} at ${result.bloodstock.location}`;
        this.reload();
      },
      error: (error) => {
        this.feedback = "Error recording donation. Please try again.";
        console.error("Donation error:", error);
      },
    });
  }

  submit(): void {
    if (this.donorForm.invalid) {
      this.feedback = "Please fill all donor fields.";
      return;
    }

    const payload = this.donorForm.value as Omit<Donor, "id">;

    if (this.selected) {
      const update: Donor = { ...this.selected, ...payload };
      this.donorService.update(update).subscribe(() => {
        this.feedback = "Donor updated successfully";
        this.selected = null;
        this.donorForm.reset({ age: 18 });
        this.reload();
      });
    } else {
      this.donorService.create(payload).subscribe(() => {
        this.feedback = "Donor added successfully";
        this.donorForm.reset({ age: 18 });
        this.reload();
      });
    }
  }

  cancelEdit() {
    this.selected = null;
    this.donorForm.reset({ age: 18 });
    this.feedback = "";
  }
}
