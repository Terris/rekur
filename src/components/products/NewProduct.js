import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withPermission } from '../session';
import { db } from '../../firebase';
import { ROUTES } from '../../constants';
import { Message } from '../ui';

const NewProduct = ({ dbUser }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [name, setName] = useState("");
  
  const onSubmit = e => {
    e.preventDefault();
    if (name === "") {
      setMessage("Product Name can't be blank.")
    } else {
      setLoading(true);
      setMessage(null);
      db.newProduct(dbUser.uid, name)
        .then(() => history.push(ROUTES.PRODUCTS))
        .catch(error => setMessage({ type: "error", message: error.message }))
    }
  }
  return (
    <div className="newproduct">
      <h3>Create Subscription Product</h3>
      {message && <Message type="error" message={message} />}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder='The Bodacious Subscription'
            value={name}
            onChange={e => setName(e.currentTarget.value)} />
        </div>
        <div className="field">
          <button type='submit' className="btn" disabled={loading}>Create Subscription Product</button>
        </div>
      </form>
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(NewProduct);
