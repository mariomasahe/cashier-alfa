import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const allOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(allOrders);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisYear = new Date(now.getFullYear(), 0, 1);

      setDaily(allOrders.filter(o => o.status === 'completed' && new Date(o.timestamp.toDate()) >= today).reduce((sum, o) => sum + o.total, 0));
      setMonthly(allOrders.filter(o => o.status === 'completed' && new Date(o.timestamp.toDate()) >= thisMonth).reduce((sum, o) => sum + o.total, 0));
      setYearly(allOrders.filter(o => o.status === 'completed' && new Date(o.timestamp.toDate()) >= thisYear).reduce((sum, o) => sum + o.total, 0));
    };
    fetchOrders();
  }, []);

  const deleteHistory = async () => {
    const oldOrders = orders.filter(o => new Date(o.timestamp.toDate()) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // >30 hari
    for (const order of oldOrders) {
      await deleteDoc(doc(db, 'orders', order.id));
    }
  };    

  return (
    <div className="space-bg reports-bg"> 
      <div className="container reports-container"> 
        <h1>Laporan</h1>
        <div className="reports-content"></div>
        <div className="reports-content">
          <h2>Penjualan Harian</h2>
          <p>{daily}</p>
        </div>
        <div className="reports-content">
          <h2>Penjualan Bulanan</h2>
          <p>{monthly}</p>
        </div>
        <div className="reports-content">
          <h2>Penjualan Tahunan</h2>
          <p>{yearly}</p>
        </div>
        <button onClick={deleteHistory}>Hapus Riwayat</button>
      </div>    
    </div>             
  );
}   