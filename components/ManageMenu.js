import { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ManageMenu() {
  const [menus, setMenus] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      const querySnapshot = await getDocs(collection(db, 'menus'));
      setMenus(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMenus();
  }, []);

  const addMenu = async () => {
    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `menus/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }
    await addDoc(collection(db, 'menus'), { name, price: parseInt(price), imageUrl });
    setName(''); setPrice(''); setImage(null);
    // Refresh
  };

  const deleteMenu = async (id) => {
    await deleteDoc(doc(db, 'menus', id));
  };

  return (
    <div>
      <h2>Kelola Menu</h2>
      <input type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={addMenu}>Tambah Menu</button>
      <ul>
        {menus.map(menu => (
          <li key={menu.id}>
            {menu.name} - Rp{menu.price}
            <button onClick={() => deleteMenu(menu.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}