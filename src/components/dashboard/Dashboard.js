import React from 'react';
import { withPermission } from '../session';

import { ConnectBtn } from '../connect';

const Dashboard = ({ authUser, dbUser }) => (
  <div data-testid="dashboard">
    <h2>Dashboard</h2>
    <ConnectBtn authUser={authUser} dbUser={dbUser} />
  </div>
)

const condition = authUser => !!authUser;
export default withPermission(condition)(Dashboard);
