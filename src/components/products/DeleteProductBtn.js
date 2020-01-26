import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { functions } from '../../firebase';
import { Confirm, Loader, Message } from '../ui';


export const DeleteProductBtn = ({ uid, productID }) => {
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
    // run firebase function to delete stripe product
    functions.deleteProduct(uid, productID)
      .then(() => {
        setLoading(false);
        history.push(ROUTES.PRODUCTS);
      })
      .catch(error => {
        setMessage({type: 'error', message: "Something went wrong. Please try again."});
        setLoading(false);
      })
  };
  
  if (loading) {
    return <Loader />
  }
  return (
    <>
      {!!message && <Message type={message.type} message={message.message} />}
      <p><button className="btn btn-alert" onClick={() => attemptDelete()}>Delete Product</button></p>
      {confirmOpen &&
        <Confirm
          message="Are you sure you want to delete this product?"
          confirmTitle="Delete Product"
          confirmText="Delete"
          onConfirm={() => handleConfirm()}
          onCancel={() => handleCancel()} />
      }
    </>
  )
}
