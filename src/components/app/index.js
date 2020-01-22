import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthUserContext, useAuthState } from '../session';
import { ROUTES } from '../../constants';
import { Header } from '../header';
import { Loader } from '../ui';
import { Home } from '../home';
import { Dashboard } from '../dashboard';
import { SignUp, SignIn, ForgotPassword } from '../auth';
import { Account } from '../account';
import { Connect } from '../connect';
import { NotAllowed, NoMatch } from '../static';
import './app.css';

export const App = () => {
  
  const { authUser, dbUser, loading } = useAuthState();
  
  if (loading) {
    return <Loader />
  }
  return (
    <AuthUserContext.Provider value={{ authUser, dbUser, loading }}>
      <div className="app" data-testid="app">
        <Header />
        <main className="main">
          <Switch>
            <Route exact path={ROUTES.HOME} component={Home} />
            <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
            <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
            <Route exact path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
            <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
            <Route exact path={ROUTES.ACCOUNT} component={Account} />
            <Route exact path={ROUTES.NOT_ALLOWED} component={NotAllowed} />
            <Route path={ROUTES.CONNECT} component={Connect} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </div>
    </AuthUserContext.Provider>
  )
}
