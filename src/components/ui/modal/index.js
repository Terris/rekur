import React from 'react';
import './modal.css';

const Modal = ({ open, children }) => (
  <div className={`ui-modal ${open ? 'open' : ''}`}>
    <div className="ui-modal-inner wrapper">
      {children}
    </div>
  </div>
);

export default Modal;
