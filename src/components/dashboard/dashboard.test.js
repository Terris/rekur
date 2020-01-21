import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr } from '../../../tests/testUtils';
import { Dashboard } from './';

const setup = (props={}) => {
  return shallow(<Dashboard />);
}

it('renders without error', () => {
  const wrapper = setup({});
  const component = findByTestAttr(wrapper, 'dashboard');
  expect(component.length).toBe(1);
});
