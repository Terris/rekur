import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './loader.css';

export const Loader = ({ message }) => (
  <div className="loader">
    {!!message && <h4 className="loader-message">{message}</h4>}
    <div className="loader-icon">
      <FontAwesomeIcon icon={faCircleNotch} />
    </div>
  </div>
);
