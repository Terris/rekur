import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStripeS } from '@fortawesome/free-brands-svg-icons';
import { stringToHash } from '../../utils';
import { db } from '../../firebase';
import { Message, Loader } from '../ui';

export const ConnectBtn = ({ authUser, dbUser }) => {
  const [ message, setMessage ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const stateKey = stringToHash(authUser.email).toString();
  const connectURL = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write&state=${stateKey}`
  
  const doConnect = () => {
    setLoading(true);
    db.initConnect( dbUser.uid, stateKey )
      .then(() => {
        window.location = connectURL;
      })
      .catch(error => {
        setMessage({type: "error", message: error.message})
        setLoading(false);
      });
  }
  
  if ( loading ) {
    return <Loader />
  }
  
  return (
    <>
      {!!message && <Message type={message.type} message={message.message} />}
      <p><button onClick={() => doConnect()} className="btn" data-testid="connectbtn"><FontAwesomeIcon icon={faStripeS} style={{marginRight: '1rem'}} /> Connect with Stripe</button></p>
    </>
  );
};
