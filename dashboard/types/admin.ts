export interface Admin {
  id: string;
  email: string;
  password: string; // This should be hashed in the actual implementation
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}