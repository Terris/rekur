import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './Home';

function App() {
  return (
    <div className="App" data-testid="app">
      <Router>
        <Route to={ROUTES.HOME} component={Home} />
      </Router>
    </div>
  );
}

export default App;
