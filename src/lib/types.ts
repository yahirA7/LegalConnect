export type UserRole = "abogado" | "cliente";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LawyerProfile extends UserProfile {
  role: "abogado";
  specialty: string;
  specialties?: string[];
  bio: string;
  pricePerHour: number;
  location: string;
  address?: string;
  city?: string;
  country?: string;
  availability: AvailabilitySlot[];
  rating?: number;
  reviewCount?: number;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ClientProfile extends UserProfile {
  role: "cliente";
  phone?: string;
}

export type AppointmentStatus = "pendiente" | "confirmada" | "completada" | "cancelada";

export interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  status: AppointmentStatus;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  lawyerId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export const SPECIALTIES = [
  "penal",
  "civil",
  "laboral",
  "mercantil",
  "administrativo",
  "familiar",
  "inmobiliario",
  "fiscal",
  "constitucional",
  "internacional",
] as const;

export type Specialty = (typeof SPECIALTIES)[number];
