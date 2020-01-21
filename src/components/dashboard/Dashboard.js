import React from 'react';
import { withPermission } from '../session';

const Dashboard = ({ authUser }) => (
  <div data-testid="dashboard">
    <h2>Dashboard</h2>
  </div>
)

const condition = authUser => !!authUser;
export default withPermission(condition)(Dashboard);
