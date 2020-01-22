import React, { useEffect, useReducer } from 'react';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { withPermission } from '../session';
import { db } from '../../firebase';
import { ROUTES } from '../../constants';
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
  connectState: "LOADING",
};

function reducer(state, action) {
  switch (action.type) {
    case CONNECT_ACTIONS.ERROR:
      return {
        loading: false,
        message: { type: "error", message: action.payload },
        connectState: "ERROR",
      }
    case CONNECT_ACTIONS.USER_CANCELLED_CONNECT:
      return {
        loading: false,
        message: { type: 'error', message: 'You cancelled the Stripe Connect process.' },
        connectState: "ERROR",
      }
    case CONNECT_ACTIONS.STRIPE_ERROR:
      return {
        loading: false,
        message: { type: 'error', message: 'Something went wrong with the Connect process. Please try again.' },
        connectState: "ERROR",
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
    if ( values.error ) {
      // stripe returned errors
      switch (values.error_description) {
        case 'The user denied your request':
          dispatch({type: CONNECT_ACTIONS.USER_CANCELLED_CONNECT})
          break;
        default:
          dispatch({type: CONNECT_ACTIONS.STRIPE_ERROR})
      }
    } else if ( dbUser.stripeConnectAccountID ) {
      history.push(ROUTES.CONNECT);
    } else if ( dbUser.stripeConnectStateKey === values.state ) {
      dispatch({type: CONNECT_ACTIONS.LOADING})
      // check to see if the stripeConnect already exists.
      db.connectExists(values.code)
        .then(querySnapshot => {
          if ( querySnapshot.empty === true ) {
            db.concludeConnect( dbUser.uid, values.code )
              .then(() => history.push(ROUTES.CONNECT))
              .catch(error => dispatch({type: CONNECT_ACTIONS.ERROR, payload: error.message}))
          } else { history.push(ROUTES.CONNECT) }
        })
        .catch(error => dispatch({type: CONNECT_ACTIONS.ERROR, payload: error.message}))
    } else {
      dispatch({type: CONNECT_ACTIONS.ERROR, payload: "Something went wrong."})
    }
  }, [
    dbUser.stripeConnectStateKey,
    dbUser.stripeConnectAccountID,
    values.error,
    values.error_description,
    values.state,
    values.code, dbUser.uid,
    history,
  ]);
  
  if (state.loading) {
    return <Loader />
  }
  return (
    <div className="connect" data-testid="connect">
      <h2>Connect</h2>
      {!!state.message && <Message type={state.message.type} message={state.message.message} />}
      {state.connectState === "ERROR"
        ? <ConnectBtn authUser={authUser} dbUser={dbUser} />
        : state.connectState === "SUCCESS"
        ? <p>Well done.</p>
        : null
      }
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(ConcludeConnect);
