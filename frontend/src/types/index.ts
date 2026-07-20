export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // "USER" | "ADMIN"
  createdAt?: string;
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  source: string; // e.g. LinkedIn, Bdjobs, Indeed, Wellfound, Facebook, Referral, Other
  status: string; // e.g. Saved, Applied, Assessment, Interview, Rejected, Offer
  applicationDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  Saved: number;
  Applied: number;
  Assessment: number;
  Interview: number;
  Rejected: number;
  Offer: number;
}

export interface DashboardData {
  total: number;
  stats: Stats;
  recentApplications: Application[];
}

export interface SystemUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export interface AdminDashboardData {
  totalUsers: number;
  totalApplications: number;
  statusStats: Stats;
  usersList: SystemUserSummary[];
}
