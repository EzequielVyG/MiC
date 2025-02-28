import { User } from "@/features/Users/user";

export interface Notification {
  id?: string;
  title: string;
  description: string;
  receiver: User;
  status: string;
  link: string;
  timestamp: Date;
}
