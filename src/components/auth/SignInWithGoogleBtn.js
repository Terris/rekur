import React, { Fragment, useState } from 'react';
import { auth, db } from '../../firebase';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Message } from '../ui';

const SignInWithGoogleBtn = () => {
  
  let history = useHistory();
  const [message, setMessage] = useState("");
  
  const createDbUser = (displayName, email, photoURL, uid) => {
    db.createUser(displayName, email, photoURL, uid)
      .then(() => history.push(ROUTES.DASHBOARD))
      .catch(error => setMessage(error.message))
  }
  
  const signInWithGoogle = () => {
    auth.signInWithGoogle()
    .then(response => {
      if (response.additionalUserInfo.isNewUser === true) {
        createDbUser(response.user.displayName, response.user.email, response.user.photoURL, response.user.uid)
      } else {
        history.push(ROUTES.HOME)
      }
    })
    .catch(error => setMessage(error.messsage))
  }
  
  return (
    <Fragment>
      {message && <Message type="error" message={message} />}
      <button type='button' className="btn" onClick={signInWithGoogle}>
        <FontAwesomeIcon icon={faGoogle} style={{marginRight: "30px"}} />
        Sign In with Google
      </button>
    </Fragment>
  )
}

export default SignInWithGoogleBtn;
