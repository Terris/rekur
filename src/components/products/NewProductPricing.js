import React from 'react';
import { useParams } from 'react-router-dom';
import { useUserProduct } from './hooks';
import { Loader, Message } from '../ui';

export const NewProductPricing = ({ dbUser }) => {
  const { id } = useParams();
  const { loading, message, product } = useUserProduct(dbUser.uid, id);
  
  const onSubmit = e => {
    e.preventDefault();
    
  }
  
  if ( loading ) {
    return <Loader />
  }
  return (
    <div className="newproductpricing">
      <h3>Add pricing to {product.name}</h3>
      {!!message && <Message type={message.type} message={message.message} />}
      
      
      
    </div>
  )
}
