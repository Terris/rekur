import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Home } from '../components/Home';

beforeEach(cleanup);

describe('<Home />', () => {
  it('renders the home page', () => {
    const { queryByTestId } = render(<Home />);
    expect(queryByTestId('home')).toBeTruthy();
  });
});
