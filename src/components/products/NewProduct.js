import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { functions } from '../../firebase';
import { ROUTES } from '../../constants';
import { Message, Loader, Select } from '../ui';
import { currencyToCents } from '../../utils';

export const NewProduct = ({ dbUser }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [interval, setInterval] = useState("");
  
  const intervalOptions = [
    {value: "day", label: "Day"},
    {value: "week", label: "Week"},
    {value: "month", label: "Month"},
    {value: "year", label: "Year"},
  ]
  
  const processAmount = (amount) => {
    const allowed = ["0","1","2","3","4","5","6","7","8","9",".",","];
    let newAmount = "$" + amount.split('').filter(char => allowed.includes(char)).join('');
    setAmount(newAmount);
  }
  
  const onSubmit = e => {
    e.preventDefault();
    if (name === "") {
      setMessage("Product Name can't be blank.")
    } else {
      setLoading(true);
      setMessage(null);
      const convAmount = currencyToCents(amount);
      functions.createProduct(dbUser.uid, name, convAmount, currency, interval.value)
        .then(response => history.push(ROUTES.PRODUCTS))
        .catch(error => {
          setMessage({ type: "error", message: "Something went wrong. Please try again." });
          setLoading(false);
        })
    }
  }
  
  if ( loading ) {
    return <Loader message="Saving your new product" />
  }
  
  return (
    <div className="newproduct">
      <h3>Create a Subscription Product</h3>
      {message && <Message type={message.type} message={message.message} />}
      <form onSubmit={onSubmit} autoComplete="off">
        <div className="field">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder='Bodacious Plan'
            value={name}
            onChange={e => setName(e.currentTarget.value)} />
        </div>
        <div className="fieldrow">
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input
              type="text"
              name="amount"
              id="amount"
              placeholder='$10.99'
              value={amount}
              onChange={e => processAmount(e.currentTarget.value)} />
          </div>
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <input
              type="text"
              name="currency"
              id="currency"
              placeholder='9.00'
              value={currency}
              onChange={e => setCurrency(e.currentTarget.value)} />
          </div>
          <div className="field">
            <label htmlFor="interval">Interval</label>
            <Select placeholder="Select Interval" options={intervalOptions} defaultValue={{value: "month", label: 'Month'}} onChange={(value) => setInterval(value)} />
          </div>
        </div>
        <div className="field">
          <button type='submit' className="btn" disabled={loading}>Create Subscription Product</button>
        </div>
      </form>
    </div>
  )
}
