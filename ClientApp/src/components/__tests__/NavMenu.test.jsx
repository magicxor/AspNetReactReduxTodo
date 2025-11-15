import { render, screen } from '@testing-library/react';
import { NavMenu } from '../NavMenu';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('NavMenu', () => {
  const renderNavMenu = () => {
    render(
      <BrowserRouter>
        <NavMenu />
      </BrowserRouter>,
    );
  };

  it('renders brand name', () => {
    renderNavMenu();
    expect(screen.getByText('ReactReduxTodo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderNavMenu();

    // Check if all navigation links are present
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /task list/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
  });

  it('has correct navigation links with icons', () => {
    renderNavMenu();

    // Check if links have correct hrefs
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /task list/i })).toHaveAttribute('href', '/TaskList');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/About');

    // Check if icons are present
    const icons = document.querySelectorAll('.svg-inline--fa');
    expect(icons.length).toBe(3); // One icon for each link
  });

  it('uses correct bootstrap classes', () => {
    renderNavMenu();

    expect(document.querySelector('.navbar')).toHaveClass('bg-light');
    expect(document.querySelector('.navbar')).toHaveClass('flex-column');
    expect(document.querySelector('.navbar-nav')).toHaveClass('flex-column');
  });
});
