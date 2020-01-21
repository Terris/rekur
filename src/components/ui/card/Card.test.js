import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr } from '../../../../tests/testUtils';
import { Card } from './';

const setup = (props={}) => {
  return shallow(<Card />);
}

it('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'card');
  expect(component.length).toBe(1);
});
