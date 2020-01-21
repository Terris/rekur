import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthUserContext } from '../session';
import { ROUTES } from '../../constants';

const HomePage = () => {
  return(
    <div data-testid="home-page">
      <h2>Rekur: Perfectly simple subscriptions.</h2>
    </div>
  )
}

export const Home = () => {
  const { authUser } = useAuthUserContext();
  return (
    <div data-testid="home">
      {authUser ? (<Redirect to={ROUTES.DASHBOARD} />) : (<HomePage />)}
    </div>
  )
}
