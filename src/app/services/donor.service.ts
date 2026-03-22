import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Donor } from "../models/donor.model";
import { Bloodstock } from "../models/bloodstock.model";

@Injectable({ providedIn: "root" })
export class DonorService {
  private endpoint = `${environment.apiUrl}/donors`;

  constructor(private http: HttpClient) {}

  list(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.endpoint);
  }

  create(donor: Omit<Donor, "id">): Observable<Donor> {
    return this.http.post<Donor>(this.endpoint, donor);
  }

  update(donor: Donor): Observable<Donor> {
    return this.http.put<Donor>(`${this.endpoint}/${donor.id}`, donor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  donate(
    donorId: number,
  ): Observable<{ donor: Donor; bloodstock: Bloodstock }> {
    // First get the donor
    return this.http.get<Donor>(`${this.endpoint}/${donorId}`).pipe(
      switchMap((donor) => {
        // Update donor's last donation date
        const updatedDonor = {
          ...donor,
          lastDonation: new Date().toISOString().split("T")[0],
        };

        // Update donor
        const updateDonor$ = this.http.put<Donor>(
          `${this.endpoint}/${donorId}`,
          updatedDonor,
        );

        // Get existing bloodstocks to find matching blood group and location
        const bloodstockEndpoint = `${environment.apiUrl}/bloodstocks`;
        const getBloodstocks$ = this.http.get<Bloodstock[]>(bloodstockEndpoint);

        return forkJoin([updateDonor$, getBloodstocks$]).pipe(
          switchMap(([updatedDonor, bloodstocks]) => {
            // Find existing bloodstock for same blood group and location
            const existingStock = bloodstocks.find(
              (stock) =>
                stock.bloodGroup === donor.bloodGroup &&
                stock.location === donor.location,
            );

            let bloodstockOperation$: Observable<Bloodstock>;

            if (existingStock) {
              // Update existing bloodstock - increase quantity by 1
              const updatedStock = {
                ...existingStock,
                quantity: existingStock.quantity + 1,
                updatedAt: new Date().toISOString().split("T")[0],
              };
              bloodstockOperation$ = this.http.put<Bloodstock>(
                `${bloodstockEndpoint}/${existingStock.id}`,
                updatedStock,
              );
            } else {
              // Create new bloodstock entry
              const newStock = {
                bloodGroup: donor.bloodGroup,
                quantity: 1,
                location: donor.location,
                updatedAt: new Date().toISOString().split("T")[0],
              };
              bloodstockOperation$ = this.http.post<Bloodstock>(
                bloodstockEndpoint,
                newStock,
              );
            }

            return bloodstockOperation$.pipe(
              map((bloodstock) => ({ donor: updatedDonor, bloodstock })),
            );
          }),
        );
      }),
    );
  }
}
