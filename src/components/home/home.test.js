import React from 'react';
import { mount } from 'enzyme';
import { findByTestAttr } from '../../../tests/testUtils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { AuthUserContext } from '../session';
import { Home } from './';


it('renders without crashing', () => {
  const wrapper = mount(<Home />);
  const component = findByTestAttr(wrapper, 'home');
  expect(component.length).toBe(1);
});

it('renders the home page when the user is not signed in', () => {
  const history = createMemoryHistory();
  const authUser = false;
  const wrapper = mount(
    <Router history={history}>
      <AuthUserContext.Provider value={{ authUser }}>
        <Home />
      </AuthUserContext.Provider>
    </Router>
  );
  const component = findByTestAttr(wrapper, 'home-page');
  expect(component.length).toBe(1);
});

it('redirects to the dashboard when the user is signed in', () => {
  const history = createMemoryHistory();
  const authUser = true;
  mount(
    <Router history={history}>
      <AuthUserContext.Provider value={{ authUser }}>
        <Home />
      </AuthUserContext.Provider>
    </Router>
  );
  expect(history.location.pathname).toBe("/dashboard");
});
