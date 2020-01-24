import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { withPermission } from '../session';
import { ROUTES } from '../../constants';
import { ConnectBtn } from '../connect';
import { Products, NewProduct } from '../products';
import "./Dashboard.css";

const Connected = () => {
  return (
    <div className="dashboard-panel">
      <nav className="dashboard-nav">
        <ul>
          <li><NavLink to={ROUTES.PRODUCTS} activeClassName="active">Products</NavLink></li>
        </ul>
      </nav>
      <div className="dashboard-main">
        <Route exact path={ROUTES.PRODUCTS} component={Products} />
        <Route exact path={ROUTES.NEW_PRODUCT} component={NewProduct} />
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
      ? <Connected />
      : <NotConnected authUser={authUser} dbUser={dbUser} />
    }
  </div>
);

const condition = authUser => !!authUser;
export default withPermission(condition)(Dashboard);
