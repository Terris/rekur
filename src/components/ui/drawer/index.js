import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './drawer.css';

export const Drawer = ({ trigger, children, openDefault = false }) => {
  const [open, setOpen] = useState(openDefault);
  
  return (
    <div className="ui-drawer">
      <button onClick={() => setOpen(open ? false : true)}>{trigger}</button>
      {open && (
        <div className="ui-drawer-contents">
          <div className="ui-drawer-contents-inner wrapper" onClick={() => setOpen(false)}>
            <button className="ui-drawer-close-btn"><FontAwesomeIcon icon={faArrowLeft} /></button>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
