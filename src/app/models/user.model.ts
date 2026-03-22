export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  image?: string;
  age?: number;
  location?: string;
  bloodGroup?: string;
  phone?: string;
  lastDonation?: string;
}
