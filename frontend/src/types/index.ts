
export interface User {
  id: number;
  email: string;
  role: 'buyer' | 'supplier' | 'admin' | 'super_admin';
  company_id?: number;
  company_name?: string;
}

export interface Tender {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'open' | 'closed' | 'awarded' | 'cancelled';
  deadline: string;
  budget?: number;
  buyer_id: number;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: number;
  tender_id: number;
  supplier_id: number;
  total_amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
