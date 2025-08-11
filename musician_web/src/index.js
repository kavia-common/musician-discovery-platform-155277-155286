import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppShell from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { MessagesProvider } from './context/MessagesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <MessagesProvider>
            <AppShell />
          </MessagesProvider>
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
