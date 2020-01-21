import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { findByTestAttr, checkProps } from '../../../tests/testUtils';
import { AuthUserContext } from '../session';
import { Account } from './';

const defaultProps = {
  authUser: {
    uid: 1,
    email: 'test@example.com',
    providerData: ["google.com"],
  },
  dbUser: {
    displayName: "Terris",
  },
  loading: false,
};

const setup = (props={}) => {
  const setupProps = {...defaultProps, ...props}
  const history = createMemoryHistory();
  return mount(
    <Router history={history}>
      <AuthUserContext.Provider value={{ ...setupProps }}>
        <Account />
      </AuthUserContext.Provider>
    </Router>
  );
}

it('does not throw warning with expected props', () => {
  checkProps(Account, defaultProps);
});

it('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'account');
  expect(component.length).toBe(1);
});
