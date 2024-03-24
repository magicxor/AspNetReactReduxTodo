import './App.css';
import { TaskList } from './components/TaskList';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { About } from './components/About';
import { Home } from './components/Home';
import { DashboardLayout } from './components/DashboardLayout';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/TaskList"
        element={(
          <DashboardLayout>
            <TaskList />
          </DashboardLayout>
        )}
      />
      <Route
        path="/About"
        element={(
          <DashboardLayout>
            <About />
          </DashboardLayout>
        )}
      />
      <Route
        path="/"
        element={(
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        )}
      />
      <Route
        path="*"
        element={(<Navigate to="/" />)}
      />
    </Routes>
  </BrowserRouter>
);
