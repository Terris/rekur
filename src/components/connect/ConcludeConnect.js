import React, { useEffect, useReducer } from 'react';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { withPermission } from '../session';
import { db } from '../../firebase';
import { ROUTES } from '../../constants';
import { stringToHash } from '../../utils';
import { Loader, Message } from '../ui';
import { ConnectBtn } from './ConnectBtn';

const CONNECT_ACTIONS = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  USER_CANCELLED_CONNECT: 'USER_CANCELLED_CONNECT',
  STRIPE_ERROR: 'STRIPE_ERROR',
  CONNECT_ALREADY_EXISTS: 'CONNECT_ALREADY_EXISTS',
  SUCCESS: 'SUCCESS',
}

const initialState = {
  loading: true,
  message: null,
};

function reducer(state, action) {
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

const ConcludeConnect = ({ authUser, dbUser }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const { search } = useLocation();
  const values = queryString.parse(search); // code, state
  
  useEffect(() => {
    // user already has a stripeConnectID
    if ( dbUser.stripeConnectAccountID ) {
      history.push(ROUTES.CONNECT);
    }
    // stripe returned error
    else if ( values.error ) {
      switch (values.error_description) {
        case 'The user denied your request':
          history.push(ROUTES.CONNECT);
          break;
        default:
          dispatch({type: CONNECT_ACTIONS.STRIPE_ERROR})
      }
    }
    // security check: stateKey should match hash(dbUser.uid)
    else if ( stringToHash(dbUser.uid).toString() === values.state ) {
      // check passed, set to loading and conclude the connect
      dispatch({type: CONNECT_ACTIONS.LOADING})
      db.concludeConnect( dbUser.uid, values.code )
        .then(() => {
          // update stripeConnectStatus
          db.user(dbUser.uid).set({ stripeConnectStatus: "CONCLUDING" })
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
    dbUser.stripeConnectAccountID,
    values.error,
    values.error_description,
    values.state,
    values.code,
    dbUser.uid,
    history,
  ]);
  
  if (state.loading) {
    return <Loader />
  }
  return (
    <div className="concludeconnect" data-testid="concludeconnect">
      {!!state.message && <Message type={state.message.type} message={state.message.message} />}
      {state.connectState === "ERROR" && <ConnectBtn authUser={authUser} dbUser={dbUser} />}
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(ConcludeConnect);
