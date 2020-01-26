import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import { withPermission } from '../session';
import { ROUTES } from '../../constants';
import { ConnectBtn } from '../connect';
import { Plans, Plan, NewPlan } from '../plans';
import "./Dashboard.css";

const Connected = ({ dbUser }) => {
  return (
    <div className="dashboard-panel">
      <nav className="dashboard-nav">
        <ul>
          <li><NavLink exact to={ROUTES.DASHBOARD} activeClassName="active">Home</NavLink></li>
          <li><NavLink to={ROUTES.PLANS} activeClassName="active">Plans</NavLink></li>
          <li><NavLink exact to={ROUTES.HOME} activeClassName="active">Customers</NavLink></li>
          <li><NavLink exact to={ROUTES.HOME} activeClassName="active">Coupons</NavLink></li>
        </ul>
      </nav>
      <div className="dashboard-main">
        <Switch>
          <Route exact path={ROUTES.NEW_PLAN} render={(props) => <NewPlan {...props} dbUser={dbUser} />} />
          <Route exact path={ROUTES.PLAN} render={(props) => <Plan {...props} dbUser={dbUser} />} />
          <Route exact path={ROUTES.PLANS} render={(props) => <Plans {...props} dbUser={dbUser} />} />
          
        </Switch>
      </div>
    </div>
  )
}

const NotConnected = ({ authUser, dbUser }) => (
  <div style={{ width: '600px', margin: '0 auto'}}>
    <p>To get started creating subscriptions, you'll need to connect your Stripe account. Don't worry if you don't have a Stripe account yet. You can create one in the "Connect" step:</p>
    <ConnectBtn authUser={authUser} dbUser={dbUser} />
  </div>
)

const Dashboard = ({ authUser, dbUser }) => (
  <div className="dashboard" data-testid="dashboard">
    {dbUser.stripeConnectAccountID
      ? <Connected authUser={authUser} dbUser={dbUser} />
      : <NotConnected authUser={authUser} dbUser={dbUser} />
    }
  </div>
);

const condition = authUser => !!authUser;
export default withPermission(condition)(Dashboard);
