import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppShell from './App';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { MessagesProvider } from './context/MessagesContext';

test('renders home actions', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <ListingsProvider>
          <MessagesProvider>
            <AppShell />
          </MessagesProvider>
        </ListingsProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  const exploreButton = screen.getByText(/explore listings/i);
  expect(exploreButton).toBeInTheDocument();
});
