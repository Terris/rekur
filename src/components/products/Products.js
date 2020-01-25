import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ROUTES } from '../../constants';
import { useUserProducts } from './hooks';
import { Loader, Message } from '../ui';
import { centsToCurrency } from '../../utils';
import './products.css';

export const Products = ({ dbUser }) => {
  const history = useHistory();
  const { loading, message, products } = useUserProducts(dbUser.uid);
  
  if (loading) {
    return <Loader />
  }
  return (
    <div className="products">
      <header className="header-tools">
        {message && <Message type={message.type} message={message.message} />}
        <h3>Products</h3>
        <p><Link to={ROUTES.NEW_PRODUCT}><button className="btn btn-small"><FontAwesomeIcon icon={faPlus} style={{marginRight: "10px"}} /> New Product</button></Link></p>
      </header>
      <div className="table">
        {!products && <p>You haven't created any products yet. <Link to={ROUTES.NEW_PRODUCT}>Create you first product</Link>.</p>}
        {!!products && products.map(product => (
          <div key={product.id} className="table-item products-product" onClick={() => history.push(`${ROUTES.PRODUCTS}/${product.id}`)}>
            <span className="table-item-header">{product.name}</span>
            <span>{centsToCurrency(product.amount)} {product.currency} per {product.interval}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
