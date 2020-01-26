import React from 'react';
import './confirm.css';

export const Confirm = ({ confirmTitle, message, confirmText, onConfirm, onCancel }) => (
  <div className="confirm">
    <div className="confirm-inner">
      <h3>{confirmTitle}</h3>
      <p>{message}</p>
      <p>
        <button className="btn btn-alert" onClick={() => onConfirm()}>{confirmText}</button>
        <button className="btn" onClick={() => onCancel()} style={{ marginLeft: "20px" }}>Cancel</button>
      </p>
    </div>
  </div>
);
