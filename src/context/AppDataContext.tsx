// src/context/AppDataContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

/* -----------------------
   CONFIG
   ----------------------- */
// Derive API base URL from axios (so we don't mismatch IPs)
const RAW_BASE = (api.defaults.baseURL || '').replace(/\/$/, '');
const API_BASE_URL = RAW_BASE || 'http://192.168.1.33:8000';

/* -----------------------
   Types
   ----------------------- */
export type ExpenseItem = {
  id: number;
  name: string;
  merchant?: string;
  category?: string;
  amount: string;
  date?: string;          // ISO string (spent_at)
  reimburse?: boolean;
  receiptUri?: string;    // local URI (when just picked)
  image_url?: string;     // full URL from backend
  expenseCode: string;    // #0001 style
};

export type TripItem = {
  id: number;
  tripCode: string;   // 0001-style UI code
  name: string;
  purpose?: string;
  travelType?: string;
  fromDate?: string;
  toDate?: string;
  createdAt?: string;
  status?: string;
};

export type ReportItem = {
  id: number;
  reportCode: string;  // 0001-style UI code
  reportName: string;
  purpose?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  tripId?: number;
};

export type UserItem = {
  id: number;
  email: string;
  full_name: string;
};

export type AppDataContextType = {
  expenses: ExpenseItem[];
  trips: TripItem[];
  reports: ReportItem[];

  // expenses
  fetchExpenses: () => Promise<void>;
  addExpense: (e: any) => Promise<boolean>;
  updateExpense: (id: number, e: any) => Promise<boolean>;
  deleteExpense: (id: number) => Promise<boolean>;

  // trips
  fetchTrips: () => Promise<void>;
  addTrip: (t: Omit<TripItem, 'id' | 'tripCode' | 'createdAt'>) => Promise<boolean>;
  deleteTrip: (id: number) => Promise<boolean>;
  updateTripStatus: (id: number, status: string) => Promise<boolean>;

  // reports
  fetchReports: () => Promise<void>;
  addReport: (r: Omit<ReportItem, 'id' | 'reportCode'>) => Promise<boolean>;
  updateReport: (id: number, updated: Partial<ReportItem>) => Promise<boolean>;
  deleteReport: (id: number) => Promise<boolean>;
  updateReportStatus: (id: number, status: string) => Promise<boolean>;

  // auth
  currentUser: UserItem | null;
  signupUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  isLoggedIn: boolean;
};

export const AppDataContext = createContext<AppDataContextType>({} as any);

const STORAGE_KEYS = {
  currentUser: '@currentUser',
};

export const AppDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ------------ INITIAL LOAD (auto-login) ------------ */
  useEffect(() => {
    (async () => {
      try {
        const curStr = await AsyncStorage.getItem(STORAGE_KEYS.currentUser);
        if (curStr) {
          const user = JSON.parse(curStr) as UserItem;
          setCurrentUser(user);
          setIsLoggedIn(true);
          await Promise.all([fetchExpenses(), fetchTrips(), fetchReports()]);
        }
      } catch (err) {
        console.log('Init load error', err);
      }
    })();
  }, []);

  /* ------------------------- AUTH ------------------------- */

  const signupUser = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/signup', {
        full_name: name,
        email,
        password,
      });

      const ok = await loginUser(email, password);
      return ok;
    } catch (err: any) {
      console.log('Signup error:', err?.response?.data || err);
      return false;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const body =
        `username=${encodeURIComponent(email)}` +
        `&password=${encodeURIComponent(password)}` +
        `&grant_type=password`;

      const tokenRes = await api.post('/auth/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = tokenRes.data.access_token;
      if (!token) return false;

      await AsyncStorage.setItem('accessToken', token);

      const meRes = await api.get('/auth/me');
      const user = meRes.data as UserItem;

      setCurrentUser(user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));

      await Promise.all([fetchExpenses(), fetchTrips(), fetchReports()]);
      return true;
    } catch (err: any) {
      console.log('Login error:', err?.response?.data || err);
      return false;
    }
  };

  const logoutUser = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem(STORAGE_KEYS.currentUser);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setExpenses([]);
    setTrips([]);
    setReports([]);
  };

  /* ------------------------- EXPENSES ------------------------- */

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses/');
      const list = res.data as any[];

      const mapped: ExpenseItem[] = list.map((e, idx) => ({
        id: e.id,
        name: e.description || '',
        merchant: e.ocr_text || '',
        category: e.category || '',
        amount: (e.amount ?? 0).toString(),
        date: e.spent_at,
        reimburse: false,
        receiptUri: undefined,
        image_url: e.receipt_images?.[0]
          ? `${API_BASE_URL}/media/${e.receipt_images[0].file_path}`
          : undefined,
        // auto-renumber so if one is deleted, codes shift: #0001, #0002...
        expenseCode: `#${String(idx + 1).padStart(4, '0')}`,
      }));

      setExpenses(mapped);
    } catch (err) {
      console.log('Fetch expenses error:', err);
    }
  };

  const addExpense = async (data: any) => {
    try {
      const form = new FormData();
      form.append('amount', data.amount);
      form.append('category', data.category || '');
      form.append('description', data.name || '');
      form.append('ocr_text', data.merchant || '');
      form.append('spent_at', data.date || '');

      if (data.receiptUri) {
        form.append('image', {
          uri: data.receiptUri,
          name: 'receipt.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await api.post('/expenses/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchExpenses();
      return true;
    } catch (err: any) {
      console.log('Add expense error:', err?.response?.data || err);
      return false;
    }
  };

  const updateExpense = async (id: number, data: any) => {
    try {
      const form = new FormData();
      form.append('amount', data.amount);
      form.append('category', data.category || '');
      form.append('description', data.name || '');
      form.append('ocr_text', data.merchant || '');
      form.append('spent_at', data.date || '');

      if (data.receiptUri) {
        form.append('image', {
          uri: data.receiptUri,
          name: 'receipt.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await api.put(`/expenses/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchExpenses();
      return true;
    } catch (err: any) {
      console.log('Update expense error:', err?.response?.data || err);
      return false;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await api.delete(`/expenses/${id}`);
      await fetchExpenses();
      return true;
    } catch (err: any) {
      console.log('Delete expense error:', err?.response?.data || err);
      return false;
    }
  };

  /* ------------------------- TRIPS ------------------------- */

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips/');
      const list = res.data as any[];

      const mapped: TripItem[] = list.map((t, idx) => ({
        id: t.id,
        name: t.name,
        purpose: t.purpose || '',
        travelType: t.travel_type || '',
        fromDate: t.from_date,
        toDate: t.to_date,
        createdAt: t.created_at,
        status: t.status || '',
        // 0001, 0002... renumbered every fetch
        tripCode: String(idx + 1).padStart(4, '0'),
      }));

      setTrips(mapped);
    } catch (err) {
      console.log('Fetch trips error:', err);
    }
  };

  const addTrip = async (t: Omit<TripItem, 'id' | 'tripCode' | 'createdAt'>) => {
    try {
      await api.post('/trips/', {
        name: t.name,
        purpose: t.purpose,
        travel_type: t.travelType,
        from_date: t.fromDate,
        to_date: t.toDate,
        status: t.status,
      });
      await fetchTrips();
      return true;
    } catch (err: any) {
      console.log('Add trip error:', err?.response?.data || err);
      return false;
    }
  };

  const deleteTrip = async (id: number) => {
    try {
      await api.delete(`/trips/${id}`);
      await fetchTrips();
      return true;
    } catch (err: any) {
      console.log('Delete trip error:', err?.response?.data || err);
      return false;
    }
  };

  const updateTripStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/trips/${id}/status`, null, {
        params: { status },
      });
      await fetchTrips();
      return true;
    } catch (err: any) {
      console.log('Update trip status error:', err?.response?.data || err);
      return false;
    }
  };

  /* ------------------------- REPORTS ------------------------- */

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/');
      const list = res.data as any[];

      const mapped: ReportItem[] = list.map((r, idx) => ({
        id: r.id,
        reportName: r.report_name,
        purpose: r.purpose || '',
        fromDate: r.from_date,
        toDate: r.to_date,
        status: r.status || '',
        tripId: r.trip_id || undefined,
        // 0001, 0002... renumbered every fetch
        reportCode: String(idx + 1).padStart(4, '0'),
      }));

      setReports(mapped);
    } catch (err) {
      console.log('Fetch reports error:', err);
    }
  };

  const addReport = async (r: Omit<ReportItem, 'id' | 'reportCode'>) => {
    try {
      await api.post('/reports/', {
        report_name: r.reportName,
        purpose: r.purpose,
        from_date: r.fromDate,
        to_date: r.toDate,
        status: r.status,
        trip_id: r.tripId,
      });
      await fetchReports();
      return true;
    } catch (err: any) {
      console.log('Add report error:', err?.response?.data || err);
      return false;
    }
  };

  const updateReport = async (_id: number, _updated: Partial<ReportItem>) => {
    // not implemented yet (you can add PUT later)
    return false;
  };

  const deleteReport = async (id: number) => {
    try {
      await api.delete(`/reports/${id}`);
      await fetchReports();
      return true;
    } catch (err: any) {
      console.log('Delete report error:', err?.response?.data || err);
      return false;
    }
  };

  const updateReportStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/reports/${id}/status`, null, {
        params: { status },
      });
      await fetchReports();
      return true;
    } catch (err: any) {
      console.log('Update report status error:', err?.response?.data || err);
      return false;
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        expenses,
        trips,
        reports,

        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,

        fetchTrips,
        addTrip,
        deleteTrip,
        updateTripStatus,

        fetchReports,
        addReport,
        updateReport,
        deleteReport,
        updateReportStatus,

        currentUser,
        signupUser,
        loginUser,
        logoutUser,
        isLoggedIn,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
