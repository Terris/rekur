import React from 'react';
import { mount } from 'enzyme';
import { findByTestAttr } from '../../../tests/testUtils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { AuthUserContext } from '../session';
import { Dashboard } from './';


const setup = (props={}) => {
  const authUser = { uid: 1, email: 'test@example.com' };
  const dbUser = { displayName: "jane smith" }
  const loading = false;
  const history = createMemoryHistory();
  return mount(
    <Router history={history}>
      <AuthUserContext.Provider value={{ authUser, dbUser, loading }}>
        <Dashboard authUser={authUser} />
      </AuthUserContext.Provider>
    </Router>
  );
}

it('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'dashboard');
  expect(component.length).toBe(1);
});
