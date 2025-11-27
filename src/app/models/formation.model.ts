export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  address: string;
  role: UserRole;
}

export interface Formation {
  id: string;
  title: string;
  place: string;
  date: string;
  startTime: string;
  endTime: string;
  tags: string[];
  price: number;
  maxSeats: number;
  participants: Participant[];
  distanceKm?: number;
  // Nouveau champ pour cacher la formation dans le catalogue
  hidden?: boolean;
}
