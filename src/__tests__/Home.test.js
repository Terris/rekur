import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Home from '../components/Home';

beforeEach(cleanup);

describe('<Home />', () => {
  it('renders the application', () => {
    const { queryByTestId } = render(<App />);
    expect(queryByTestId('route-home')).toBeTruthy();
  });
});
