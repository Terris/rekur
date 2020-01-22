import React from 'react';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import { withPermission } from '../session';

import { useConcludeConnect } from './hooks';
import { Loader, Message } from '../ui';
import { ConnectBtn } from './ConnectBtn';

const ConcludeConnect = ({ authUser, dbUser }) => {
  const history = useHistory();
  const { search } = useLocation();
  const params = queryString.parse(search); // code, state, error
  const { state } = useConcludeConnect(dbUser, params, history);
  
  if (state.loading) {
    return <Loader />
  }
  return (
    <div className="concludeconnect" data-testid="concludeconnect">
      {state.message && (
        <>
          <Message type={state.message.type} message={state.message.message} />
          <ConnectBtn authUser={authUser} dbUser={dbUser} />
        </>
      )}
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(ConcludeConnect);
