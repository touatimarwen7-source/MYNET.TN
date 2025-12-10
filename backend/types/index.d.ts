
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'buyer' | 'supplier' | 'admin' | 'super_admin';
        company_id?: number;
      };
      requestId?: string;
    }
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

export interface TenderStatus {
  id: number;
  status: 'draft' | 'published' | 'open' | 'closed' | 'awarded' | 'cancelled';
  title: string;
  deadline: Date;
}

export interface User {
  id: number;
  email: string;
  role: 'buyer' | 'supplier' | 'admin' | 'super_admin';
  company_id?: number;
  created_at: Date;
  updated_at: Date;
}
