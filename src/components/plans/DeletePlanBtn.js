import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { functions } from '../../firebase';
import { Confirm, Loader, Message } from '../ui';


export const DeletePlanBtn = ({ uid, planID, productID }) => {
  const history = useHistory();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const attemptDelete = () => {
    setConfirmOpen(true);
  }
  
  const handleCancel = () => {
    setConfirmOpen(false);
  }
  
  const handleConfirm = () => {
    setConfirmOpen(false);
    setLoading(true);
    // run firebase function to delete stripe plan & product
    functions.deletePlan(uid, planID, productID)
      .then(() => {
        setLoading(false);
        history.push(ROUTES.PLANS);
      })
      .catch(error => {
        setMessage({type: 'error', message: "Something went wrong. Please try again."});
        setLoading(false);
      })
  };
  
  if (loading) {
    return <Loader message="Deleting your plan." />
  }
  return (
    <>
      {!!message && <Message type={message.type} message={message.message} />}
      <p><button className="btn btn-alert" onClick={() => attemptDelete()}>Delete Plan</button></p>
      {confirmOpen &&
        <Confirm
          message="Are you sure you want to delete this plan?"
          confirmTitle="Delete Plan"
          confirmText="Delete"
          onConfirm={() => handleConfirm()}
          onCancel={() => handleCancel()} />
      }
    </>
  )
}
