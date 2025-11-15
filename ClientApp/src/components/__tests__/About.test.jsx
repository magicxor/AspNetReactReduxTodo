import { render, screen } from '@testing-library/react';
import { About } from '../About';
import { describe, it, expect } from 'vitest';

describe('About', () => {
  it('renders about page with title and license information', () => {
    render(<About />);

    expect(screen.getByRole('heading', { name: 'About ReactReduxTodo' })).toBeInTheDocument();
    expect(screen.getByText(/MIT License/)).toBeInTheDocument();
    expect(screen.getByText(/Copyright \(c\) 2025 Ilia Burakov/)).toBeInTheDocument();
  });
});
