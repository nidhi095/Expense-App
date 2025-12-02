// App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AppDataProvider } from './src/context/AppDataContext';

export default function App() {
  return (
    <AppDataProvider>
      <AppNavigator />
    </AppDataProvider>
  );
}
