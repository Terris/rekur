import React from 'react';
import PropTypes from 'prop-types';
import { withPermission } from '../session';
import { Avatar } from '../ui';
import { EditUser } from './EditUser';
import './account.css';

const Account = ({ authUser, dbUser }) => (
  <div className="ui-account" data-testid="account">
    <div className="ui-account-header">
      <Avatar user={dbUser} wrapperClass={"ui-account-avatar"} />
      <h2 className="ui-account-display-name" data-testid="displayname">{dbUser.displayName}</h2>
      <p className="ui-account-email" data-testid="email">{authUser.email}</p>
    </div>
    <EditUser authUser={authUser} dbUser={dbUser} />
  </div>
);

Account.propTypes = {
  authUser: PropTypes.object.isRequired,
  dbUser: PropTypes.object.isRequired,
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Account);
