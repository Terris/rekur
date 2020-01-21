import React, { useEffect } from 'react';
import { ROUTES } from '../../constants';
import { useAuthUserContext } from '../session';
import { useHistory } from 'react-router-dom';
import { Loader } from '../ui';

const withPermission = (condition) => (Component) => {
  const WithPermission = (props) => {
    
    let history = useHistory();
    const { authUser, dbUser, loading } = useAuthUserContext();
    
    useEffect(() => {
      if (!loading) {
        if (!authUser) {
          history.push(ROUTES.SIGN_IN)
        } else if (!condition(authUser)) {
          history.push(ROUTES.NOT_ALLOWED)
        }
      }
    }, [loading, authUser, dbUser, history])
    
    return (
      <>
        {(authUser && dbUser) ? <Component {...props} authUser={authUser} dbUser={dbUser} /> : <Loader /> }
      </>
    )
  }
  return WithPermission;
}
export default withPermission;
