import React from 'react';
import { useParams } from 'react-router-dom';
import { useUserProduct } from './hooks';
import { Loader, Message } from '../ui';
import { centsToCurrency } from '../../utils';

export const Product = ({ dbUser }) => {
  const { id } = useParams();
  const { loading, message, product } = useUserProduct(dbUser.uid, id);
  
  if ( loading ) {
    return <Loader />
  }
  return (
    <div className="product">
      {!!message && <Message type={message.type} message={message.message} />}
      <h2>{product.name}</h2>
      <h3>{centsToCurrency(product.amount)} {product.currency} per {product.interval}</h3>
    </div>
  )
}
