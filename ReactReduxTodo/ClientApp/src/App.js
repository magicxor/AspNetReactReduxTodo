import React from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';

export const App = () => (
  <Layout>
    <Route exact path='/' component={TaskList} />
  </Layout>
);
