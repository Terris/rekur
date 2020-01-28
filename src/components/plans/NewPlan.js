import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { functions } from '../../firebase';
import { ROUTES, PLAN_INTERVALS } from '../../constants';
import { Message, Loader, Select } from '../ui';
import { currencyToCents, processAmountInput } from '../../utils';

export const NewPlan = ({ dbUser }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [intervalCount, setIntervalCount] = useState("");
  const [interval, setInterval] = useState("");
  
  const onSubmit = e => {
    e.preventDefault();
    if (name === "") {
      setMessage("Product Name can't be blank.")
    } else {
      setLoading(true);
      setMessage(null);
      const convAmount = currencyToCents(amount);
      functions.createPlan(dbUser.uid, name, convAmount, currency, interval.value)
        .then(response => history.push(ROUTES.PLANS))
        .catch(error => {
          setMessage({ type: "error", message: "Something went wrong. Please try again." });
          setLoading(false);
        })
    }
  }
  
  if ( loading ) {
    return <Loader message="Saving your new plan." />
  }
  
  return (
    <div className="newproduct">
      <h3>Create a Subscription Plan</h3>
      {message && <Message type={message.type} message={message.message} />}
      <form onSubmit={onSubmit} autoComplete="off">
        <div className="field">
          <label htmlFor="name">Plan Name</label>
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
              onChange={e => setAmount(processAmountInput(e.currentTarget.value))} />
          </div>
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <input
              type="text"
              name="currency"
              id="currency"
              placeholder='USD'
              value={currency}
              onChange={e => setCurrency(e.currentTarget.value)} />
          </div>
          <div className="field">
            <label htmlFor="intervalCount">Interval Count</label>
            <input
              type="number"
              name="intervalCount"
              id="intervalCount"
              placeholder='1'
              value={intervalCount}
              onChange={e => setIntervalCount(e.currentTarget.value)} />
          </div>
          <div className="field">
            <label htmlFor="interval">Interval</label>
            <Select placeholder="Select Interval" options={PLAN_INTERVALS} defaultValue={PLAN_INTERVALS.month} onChange={(value) => setInterval(value)} />
          </div>
        </div>
        <div className="field">
          <button type='submit' className="btn" disabled={loading}>Create Subscription Plan</button>
        </div>
      </form>
    </div>
  )
}
