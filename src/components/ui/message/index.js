import React from 'react';
import './message.css';

export const Message = ({ type, message, children }) => {
  return (
    <div className={`message message-${type}`}>
      <p>{message}</p>
      {children}
    </div>
  )
}
