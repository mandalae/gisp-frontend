import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Renders the page title', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/COVID-19 GP Information Sharing Portal/i);
  expect(linkElement).toBeInTheDocument();
});
