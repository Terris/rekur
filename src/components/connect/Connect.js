import React from 'react';
import { Redirect } from 'react-router-dom';
import { withPermission } from '../session';
import { ROUTES } from '../../constants';
import { ConnectBtn } from '../connect';
import { Loader } from '../ui';

export const Connect = ({ authUser, dbUser }) => {
  
  const connectStatus = dbUser.stripeConnectStatus;
  
  return (
    <div className="connect" data-testid="connect">
      <h2>Stripe Connect</h2>
      {(connectStatus === "CANCELLED" || connectStatus === "INIT") && <p>Please complete your Stripe Connection to continue:</p>}
      {(!connectStatus || connectStatus === "CANCELLED" || connectStatus === "INIT") && <ConnectBtn authUser={authUser} dbUser={dbUser} />}
      {connectStatus === "CONCLUDING" && <Loader message="We're wrapping up your Stripe connection. This should only take a moment." />}
      {connectStatus === "CONNECTED" && <Redirect to={ROUTES.DASHBOARD} />}
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Connect);
