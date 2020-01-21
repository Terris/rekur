import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr, checkProps, authContext } from '../../../tests/testUtils';
import { EditUser } from './EditUser';

const setup = (props={}) => {
  const setupProps = {...authContext, ...props}
  return shallow(<EditUser {...setupProps} />);
}

it('does not throw warning with expected props', () => {
  checkProps(EditUser, authContext);
});

it('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'edit-user');
  expect(component.length).toBe(1);
});

it("the email field is diabled if the provider is google", () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'email-field');
  expect(component.is('[disabled]')).toBe(true);
});
