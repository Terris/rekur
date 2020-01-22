import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { withPermission } from '../session';
import { db } from '../../firebase';
import { Loader, Message } from '../ui';

const Connect = ({ dbUser }) => {
  const [ loading, setLoading ] = useState(false);
  const [ message, setMessage ] = useState(null);
  
  const { search } = useLocation();
  const values = queryString.parse(search); // code, state
  
  // TODO: if this connect was already created,
  // it shouldn't do it again.
  
  useEffect(() => {
    if ( dbUser.stripeConnectStateKey === values.state ) {
      setLoading(true);
      db.concludeConnect( dbUser.uid, values.code )
        .then(() => setLoading(false))
        .catch(error => {
          setLoading(false);
          setMessage({ type: "error", message: error.message })
        })
    } else {
      setMessage({ type: "error", message: "Something went wrong. Please try to reconnect to Stripe again." })
    }
  }, [dbUser.stripeConnectStateKey, values.state, values.code, dbUser.uid])
  
  if ( loading ) {
    return <Loader />
  }
  return (
    <div className="connect" data-testid="connect">
      <h2>Connect</h2>
      {!!message && <Message type={message.type} message={message.message} />}
      
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Connect);
