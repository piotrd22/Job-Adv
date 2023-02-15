import { Job } from "../Job";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string;
  name?: string;
  description?: string;
  refreshT?: string;
  jobs: Job[];
}
