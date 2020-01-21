import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ROUTES } from '../constants';
import { Home } from './Home';

export const App = () => {
  return (
    <div className="App" data-testid="app">
      <Router>
        <Route to={ROUTES.HOME} component={Home} />
      </Router>
    </div>
  );
}
