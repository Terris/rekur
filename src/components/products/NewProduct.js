import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { functions } from '../../firebase';
import { ROUTES } from '../../constants';
import { Message, Loader } from '../ui';

export const NewProduct = ({ dbUser }) => {
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
      functions.createProduct(dbUser.uid, name)
        .then(response => history.push(`${ROUTES.PRODUCTS}/${response.data.id}/pricing/new`))
        .catch(error => setMessage({ type: "error", message: error }))
    }
  }
  
  if ( loading ) {
    return <Loader message="Saving your new product" />
  }
  
  return (
    <div className="newproduct">
      <h3>Create Subscription Product</h3>
      {message && <Message type="error" message={message} />}
      <form onSubmit={onSubmit} autoComplete="off">
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
