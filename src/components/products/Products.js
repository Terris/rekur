import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ROUTES } from '../../constants';
import { withPermission } from '../session';
import { useUserProducts } from './hooks';
import { Loader } from '../ui';

const Products = ({ dbUser }) => {
  const { loading, message, products } = useUserProducts(dbUser.uid);
  
  if (loading) {
    return <Loader />
  }
  return (
    <div className="products">
      <header className="header-tools">
        <h3>Products</h3>
        <p><Link to={ROUTES.NEW_PRODUCT}><button className="btn btn-small"><FontAwesomeIcon icon={faPlus} style={{marginRight: "10px"}} /> New Product</button></Link></p>
      </header>
      <div className="table">
        {!!products && products.map(product => (
          <div className="table-item products-product">
            <h4>{product.name}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

const condition = authUser => !!authUser;
export default withPermission(condition)(Products);
