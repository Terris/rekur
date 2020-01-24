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
