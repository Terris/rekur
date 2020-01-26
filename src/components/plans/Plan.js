import React from 'react';
import { useParams } from 'react-router-dom';
import { useUserPlan } from './hooks';
import { Loader, Message } from '../ui';
import { centsToCurrency } from '../../utils';
import { DeletePlanBtn } from './DeletePlanBtn';

export const Plan = ({ dbUser }) => {
  const { id } = useParams();
  const { loading, message, plan } = useUserPlan(dbUser.uid, id);
  
  if ( loading ) {
    return <Loader />
  }
  return (
    <div className="plan">
      {!!message && <Message type={message.type} message={message.message} />}
      <h2>{plan.name}</h2>
      <h3>{centsToCurrency(plan.amount)} {plan.currency} per {plan.interval}</h3>
      <hr />
      <DeletePlanBtn uid={dbUser.uid} planID={plan.stripePlanID} productID={plan.stripeProductID} />
    </div>
  )
}
