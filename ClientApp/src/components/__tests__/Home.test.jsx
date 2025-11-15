import { render, screen } from '@testing-library/react';
import { Home } from '../Home';
import { describe, it, expect } from 'vitest';

describe('Home', () => {
  it('renders home page with title and welcome message', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'ReactReduxTodo' })).toBeInTheDocument();
    expect(screen.getByText('Hello world react/redux app')).toBeInTheDocument();
  });
});
