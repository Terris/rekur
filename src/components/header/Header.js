import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuthUserContext } from '../session';
import { auth } from '../../firebase';
import { ROUTES } from '../../constants';
import { Alerts } from '../alerts';
import { Drawer } from '../ui';

import './header.css';

const NavigationAuth = ({ authUser }) => (
  <>
    <Alerts authUser={authUser} />
    <nav className="nav-primary">
      <Drawer trigger={<FontAwesomeIcon icon={faBars} />}>
        <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
        <button onClick={auth.signOut}>Sign Out</button>
      </Drawer>
    </nav>
  </>
);

const NavigationNonAuth = () => (
  <Fragment>
    <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </Fragment>
);

const Header = () => {
  const { authUser } = useAuthUserContext();
  
  return (
    <header className="header" data-testid="comp-header">
      <h1 className="logo"><Link to={ROUTES.HOME}>Rekur</Link></h1>
      <nav className="header-actions">
        {authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
      </nav>
    </header>
  );
};

export default Header;
