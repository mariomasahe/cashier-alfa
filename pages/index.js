import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import ManageMenu from '../components/ManageMenu';
import Reports from '../components/Reports';
import Link from 'next/link';

export default function Cashier() {
  const [orders, setOrders] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const handleAdminAccess = () => {
    if (user) {
      setShowAdmin(!showAdmin);
    } else {
      alert('Login sebagai admin terlebih dahulu!');
    }
  };

  return (
    <div className="space-simple">
      <div className="moon"></div>
      <div className="container">
        <h1>Sistem Kasir Luar Angkasa</h1>
        <button onClick={handleAdminAccess} className="admin-btn">Akses Admin</button>
        {showAdmin && user && (
          <div className="admin-panel">
            <Link href="/generate-qr">
                <button>Generate QR Code</button>
            </Link>
            <ManageMenu />
            <Reports />
          </div>
        )}
        <h2>Pesanan</h2>
        {orders.filter(o => o.status === 'pending').map(order => (
          <div key={order.id} className="order">
            <p>Meja {order.table} - Total: Rp{order.total}</p>
            <ul>
              {order.items.map((item, idx) => <li key={idx}>{item.name} x1</li>)}
            </ul>
            <button onClick={() => updateStatus(order.id, 'completed')}>Selesai</button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .space-simple { background: black; min-height: 100vh; color: white; position: relative; }
        .moon { position: absolute; top: 20px; right: 20px; width: 100px; height: 100px; background: #ddd; border-radius: 50%; }
        .container { padding: 20px; }
        .admin-btn { background: #00d4ff; color: black; border: none; padding: 10px; border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
        .admin-panel { background: #333; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .order { background: #333; padding: 10px; margin: 10px 0; border-radius: 5px; }
        button { background: #00d4ff; color: black; border: none; padding: 5px 10px; cursor: pointer; }
      `}</style>
    </div>
  );
}