import React from 'react';
import { withPermission } from '../session';
import { ConnectBtn } from '../connect';
import { Loader } from '../ui';

export const Connect = ({ authUser, dbUser }) => {
  return (
    <div className="connect" data-testid="connect">
      <h2>Connect Stripe</h2>
      {!dbUser.stripeConnectStatus
        ? <ConnectBtn authUser={authUser} dbUser={dbUser} />
        : dbUser.stripeConnectStatus === "INIT"
        ? <Loader message="We're wrapping up our Stripe connection. This should only take a moment." />
        : <p>You've successfully connected your Stripe account!</p>
      }
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Connect);