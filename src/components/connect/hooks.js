import { useReducer, useEffect } from 'react';
import { db } from '../../firebase';
import { ROUTES } from '../../constants';
import { stringToHash } from '../../utils';

export const useConcludeConnect = (dbUser, params, history) => {
  
  const CONNECT_ACTIONS = {
    LOADING: 'LOADING',
    ERROR: 'ERROR',
    STRIPE_ERROR: 'STRIPE_ERROR',
  }
  
  const initialState = {
    loading: true,
    message: null,
  };

  function connectReducer(state, action) {
    switch (action.type) {
      case CONNECT_ACTIONS.LOADING:
        return {
          loading: true,
          message: null,
        }
      case CONNECT_ACTIONS.ERROR:
        return {
          loading: false,
          message: { type: "error", message: action.payload },
        }
      case CONNECT_ACTIONS.STRIPE_ERROR:
        return {
          loading: false,
          message: { type: 'error', message: 'Something went wrong with the Connect process. Please try again.' }
        }
      default:
        return { ...initialState }
    }
  }
  
  const [state, dispatch] = useReducer(connectReducer, initialState);
  
  useEffect(() => {
    // user already has a stripeConnectID
    if ( dbUser.stripeConnectAccountID ) {
      history.push(ROUTES.CONNECT);
    }
    // stripe returned error
    else if ( params.error ) {
      switch (params.error_description) {
        case 'The user denied your request':
          history.push(ROUTES.CONNECT);
          break;
        default:
          dispatch({type: CONNECT_ACTIONS.STRIPE_ERROR})
      }
    }
    // security check: stateKey should match hash(dbUser.uid)
    else if ( stringToHash(dbUser.uid).toString() === params.state ) {
      // check passed, set to loading and conclude the connect
      dispatch({type: CONNECT_ACTIONS.LOADING})
      db.concludeConnect( dbUser.uid, params.code )
        .then(() => {
          // update stripeConnectStatus
          db.user(dbUser.uid).update({ stripeConnectStatus: "CONCLUDING" })
            .then(() => history.push(ROUTES.CONNECT))
            .catch(error => dispatch({type: CONNECT_ACTIONS.ERROR, payload: error.message}))
        })
        .catch(error => dispatch({type: CONNECT_ACTIONS.ERROR, payload: error.message}))
    }
    // catchall
    else {
      dispatch({type: CONNECT_ACTIONS.ERROR, payload: "Something went wrong."})
    }
  }, [
    CONNECT_ACTIONS.ERROR,
    CONNECT_ACTIONS.STRIPE_ERROR,
    CONNECT_ACTIONS.LOADING,
    dbUser.stripeConnectAccountID,
    params.error,
    params.error_description,
    params.state,
    params.code,
    dbUser.uid,
    history,
  ]);
  return { state }
}
