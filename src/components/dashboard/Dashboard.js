import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { withPermission } from '../session';
import { ROUTES } from '../../constants';
import { ConnectBtn } from '../connect';
import { Products, NewProduct, NewProductPricing } from '../products';
import "./Dashboard.css";

const Connected = ({ dbUser }) => {
  return (
    <div className="dashboard-panel">
      <nav className="dashboard-nav">
        <ul>
          <li><NavLink to={ROUTES.PRODUCTS} activeClassName="active">Products</NavLink></li>
        </ul>
      </nav>
      <div className="dashboard-main">
        <Route exact path={ROUTES.PRODUCTS} render={(props) => <Products {...props} dbUser={dbUser} />} />
        <Route exact path={ROUTES.NEW_PRODUCT} render={(props) => <NewProduct {...props} dbUser={dbUser} />} />
        <Route exact path={ROUTES.NEW_PRODUCT_PRICING} render={(props) => <NewProductPricing {...props} dbUser={dbUser} />} />
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
