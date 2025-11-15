import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

// Mock NavMenu component since it contains Router-specific code
vi.mock('../NavMenu', () => ({
  NavMenu: () => <div data-testid="nav-menu">NavMenu</div>,
}));

describe('DashboardLayout', () => {
  it('renders layout with navigation and content', () => {
    const testContent = <div>Test Content</div>;

    render(
      <BrowserRouter>
        <DashboardLayout>{testContent}</DashboardLayout>
      </BrowserRouter>,
    );

    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('uses correct bootstrap classes for layout', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>Content</DashboardLayout>
      </BrowserRouter>,
    );

    expect(document.querySelector('.container-fluid')).toBeInTheDocument();
    expect(document.querySelector('.row')).toBeInTheDocument();
    expect(document.querySelector('.col-sm-3')).toBeInTheDocument();
    expect(document.querySelector('.col-sm-9')).toBeInTheDocument();
  });
});
