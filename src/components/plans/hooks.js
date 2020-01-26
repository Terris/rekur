import { useEffect, useState } from 'react';
import { db } from '../../firebase';

export const useUserPlans = (uid) => {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    db.usersPlans(uid)
      .get()
      .then(snapshot => {
        const allPlans = snapshot.docs.map(plan => ({
          ...plan.data(),
          id: plan.id,
        }))
        setPlans(allPlans);
        setLoading(false);
      })
      .catch(error => {
        setMessage({type: 'error', message: error.message});
        setLoading(false);
      })
  }, [uid]);
  return { loading, message, plans }
}

export const useUserPlan = (uid, planID) => {
  const [plan, setPlan] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    db.usersPlan(uid, planID)
      .get()
      .then((snapshot) => {
        setPlan(snapshot.data());
        setLoading(false);
      })
      .catch(error => {
        setMessage({type: 'error', message: error.message})
        setLoading(false);
      })
  }, [uid, planID])
  return { loading, message, plan }
}
