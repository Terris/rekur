import React from 'react';
import { mount } from 'enzyme';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { findByTestAttr, checkProps, authContext } from '../../../tests/testUtils';
import { AuthUserContext } from '../session';
import { Account } from './';

const setup = (props={}) => {
  const setupProps = {...authContext, ...props}
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
  checkProps(Account, authContext);
});

it('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'account');
  expect(component.length).toBe(1);
});

describe('user info', () => {
  it("displays the user's avatar", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'avatar');
    expect(component.length).toBe(1);
  });
  it("displays the user's displayName", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'displayname');
    expect(component.text()).toBe('Jane Smith');
  });
  it("displays the user's email", () => {
    const wrapper = setup();
    const component = findByTestAttr(wrapper, 'email');
    expect(component.text()).toBe('test@example.com');
  });
})
