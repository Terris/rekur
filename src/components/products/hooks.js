import { useEffect, useState } from 'react';
import { db } from '../../firebase';

export const useUserProducts = (uid) => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    db.usersProducts(uid)
      .get()
      .then(snapshot => {
        const allProducts = snapshot.docs.map(product => ({
          ...product.data(),
          id: product.id,
        }))
        setProducts(allProducts);
        setLoading(false);
      })
      .catch(error => {
        setMessage({type: 'error', message: error.message});
        setLoading(false);
      })
  }, [uid]);
  return { loading, message, products }
}

export const useUserProduct = (uid, productID) => {
  const [product, setProduct] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    db.usersProduct(uid, productID)
      .get()
      .then((snapshot) => {
        setProduct(snapshot.data());
        setLoading(false);
      })
      .catch(error => {
        setMessage({type: 'error', message: error.message})
        setLoading(false);
      })
  }, [uid, productID])
  return { loading, product, message }
}
