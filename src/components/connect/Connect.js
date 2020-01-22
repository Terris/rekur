import React from 'react';
import { withPermission } from '../session';
import { ConnectBtn } from '../connect';
import { Loader } from '../ui';

export const Connect = ({ authUser, dbUser }) => {
  
  const connectStatus = dbUser.stripeConnectStatus;
  
  return (
    <div className="connect" data-testid="connect">
      <h2>Stripe Connect</h2>
      {(connectStatus === "CANCELLED" || connectStatus === "INIT") && <p>Please complete your Stripe Connection to continue:</p>}
      {(!connectStatus || connectStatus === "CANCELLED" || connectStatus === "INIT") && <ConnectBtn authUser={authUser} dbUser={dbUser} />}
      {connectStatus === "CONCLUDING" && <Loader message="We're wrapping up our Stripe connection. This should only take a moment." />}
      {connectStatus === "CONNECTED" && <p>You've successfully connected your Stripe account!</p>}
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Connect);
