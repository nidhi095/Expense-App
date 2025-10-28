// src/context/AppDataContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExpenseItem = {
  id: string;
  name: string;
  merchant?: string;
  category?: string;
  amount?: string;
  date?: string;
  reimburse?: boolean;
};

export type TripItem = {
  id: string;
  name: string;
  purpose?: string;
  travelType?: 'Domestic' | 'International' | string;
  createdAt?: string;
};

export type ReportItem = {
  id: string;
  name: string;
  purpose?: string;
  from?: string;
  to?: string;
};

export type AdvanceItem = {
  id: string;
  amount: string;
  date?: string;
  user?: string;
  trip?: string;
  paidThrough?: string;
  reference?: string;
};

type AppDataContextType = {
  expenses: ExpenseItem[];
  trips: TripItem[];
  reports: ReportItem[];
  advances: AdvanceItem[];
  addExpense: (e: Omit<ExpenseItem, 'id'>) => void;
  addTrip: (t: Omit<TripItem, 'id'>) => void;
  addReport: (r: Omit<ReportItem, 'id'>) => void;
  addAdvance: (a: Omit<AdvanceItem, 'id'>) => void;
};

export const AppDataContext = createContext<AppDataContextType>({
  expenses: [],
  trips: [],
  reports: [],
  advances: [],
  addExpense: () => {},
  addTrip: () => {},
  addReport: () => {},
  addAdvance: () => {},
});

type ProviderProps = { children: ReactNode };

const STORAGE_KEYS = {
  expenses: '@expenses',
  trips: '@trips',
  reports: '@reports',
  advances: '@advances',
};

export const AppDataProvider: React.FC<ProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [advances, setAdvances] = useState<AdvanceItem[]>([]);

  // Helper to generate unique IDs
  const makeId = (prefix: string) => `${prefix}_${Date.now().toString(36)}`;

  // Load data from storage (or set dummy data)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [e, t, r, a] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.expenses),
          AsyncStorage.getItem(STORAGE_KEYS.trips),
          AsyncStorage.getItem(STORAGE_KEYS.reports),
          AsyncStorage.getItem(STORAGE_KEYS.advances),
        ]);

        if (e) setExpenses(JSON.parse(e));
        else {
          const dummy = [
            { id: 'e_a1', name: 'Hotel - A', merchant: 'Taj Bangalore', category: 'Travel', amount: '5200', date: '2025-10-25', reimburse: true },
            { id: 'e_b2', name: 'Taxi - B', merchant: 'Ola', category: 'Transport', amount: '420', date: '2025-10-26', reimburse: false },
          ];
          setExpenses(dummy);
          await AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(dummy));
        }

        if (t) setTrips(JSON.parse(t));
        else {
          const dummy = [
            { id: 't_a1', name: 'Client Visit - A', purpose: 'Client Meeting', travelType: 'Domestic', createdAt: '2025-09-12' },
            { id: 't_b2', name: 'Conference - B', purpose: 'Conference', travelType: 'International', createdAt: '2025-08-05' },
          ];
          setTrips(dummy);
          await AsyncStorage.setItem(STORAGE_KEYS.trips, JSON.stringify(dummy));
        }

        if (r) setReports(JSON.parse(r));
        else setReports([]);

        if (a) setAdvances(JSON.parse(a));
        else setAdvances([]);
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };

    loadData();
  }, []);

  // Generic save function
  const saveData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Failed to save ${key}`, err);
    }
  };

  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const newItem = { id: makeId('e'), ...expense };
    setExpenses((prev) => {
      const updated = [newItem, ...prev];
      saveData(STORAGE_KEYS.expenses, updated);
      return updated;
    });
  };

  const addTrip = (trip: Omit<TripItem, 'id'>) => {
    const newItem = { id: makeId('t'), ...trip };
    setTrips((prev) => {
      const updated = [newItem, ...prev];
      saveData(STORAGE_KEYS.trips, updated);
      return updated;
    });
  };

  const addReport = (report: Omit<ReportItem, 'id'>) => {
    const newItem = { id: makeId('r'), ...report };
    setReports((prev) => {
      const updated = [newItem, ...prev];
      saveData(STORAGE_KEYS.reports, updated);
      return updated;
    });
  };

  const addAdvance = (advance: Omit<AdvanceItem, 'id'>) => {
    const newItem = { id: makeId('adv'), ...advance };
    setAdvances((prev) => {
      const updated = [newItem, ...prev];
      saveData(STORAGE_KEYS.advances, updated);
      return updated;
    });
  };

  return (
    <AppDataContext.Provider value={{ expenses, trips, reports, advances, addExpense, addTrip, addReport, addAdvance }}>
      {children}
    </AppDataContext.Provider>
  );
};
