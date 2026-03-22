import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Bloodstock } from "../models/bloodstock.model";

@Injectable({ providedIn: "root" })
export class BloodstockService {
  private endpoint = `${environment.apiUrl}/bloodstocks`;

  constructor(private http: HttpClient) {}

  list(): Observable<Bloodstock[]> {
    return this.http.get<Bloodstock[]>(this.endpoint);
  }

  create(stock: Omit<Bloodstock, "id">): Observable<Bloodstock> {
    return this.http.post<Bloodstock>(this.endpoint, stock);
  }

  update(stock: Bloodstock): Observable<Bloodstock> {
    return this.http.put<Bloodstock>(`${this.endpoint}/${stock.id}`, stock);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  useBlood(id: number, units: number = 1): Observable<Bloodstock> {
    return this.http.get<Bloodstock>(`${this.endpoint}/${id}`).pipe(
      switchMap((stock) => {
        if (stock.quantity < units) {
          throw new Error(
            `Insufficient blood stock. Available: ${stock.quantity}, Requested: ${units}`,
          );
        }

        const updatedStock = {
          ...stock,
          quantity: stock.quantity - units,
          updatedAt: new Date().toISOString().split("T")[0],
        };

        return this.http.put<Bloodstock>(
          `${this.endpoint}/${id}`,
          updatedStock,
        );
      }),
    );
  }
}
