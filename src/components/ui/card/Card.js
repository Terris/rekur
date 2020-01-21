import React from 'react';
import './Card.css';

export const Card = ({ children }) => (
  <div className="ui-card" data-testid="card">
    {children}
  </div>
)
