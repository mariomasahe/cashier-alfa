import { useState } from 'react';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';

export default function GenerateQR() {
  const [qrs, setQrs] = useState([]);
  const baseUrl = 'https://menu-app.vercel.app/menu/'; // Ganti dengan URL Vercel menu-app Anda

  const generateQRs = () => {
    const qrList = [];
    for (let i = 1; i <= 13; i++) {
      qrList.push({
        table: i,
        url: `${baseUrl}${i}`,
        dataUrl: '' // Akan diisi saat render
      });
    }
    setQrs(qrList);
  };

  const downloadQR = (table, dataUrl) => {
    if (dataUrl) {
      saveAs(dataUrl, `meja-${table}.png`);
    }
  };

  const handleQRRender = (table, canvas) => {
    if (canvas) {
      canvas.toBlob((blob) => {
        const dataUrl = URL.createObjectURL(blob);
        setQrs(prev => prev.map(qr => qr.table === table ? { ...qr, dataUrl } : qr));
      });
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', background: 'black', minHeight: '100vh' }}>
      <h1>Generate QR Code untuk Meja</h1>
      <button onClick={generateQRs} style={{ background: '#00d4ff', color: 'black', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Generate QR untuk 13 Meja
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {qrs.map(qr => (
          <div key={qr.table} style={{ background: '#333', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <h3>Meja {qr.table}</h3>
            <QRCode
              value={qr.url}
              size={150}
              onRender={(canvas) => handleQRRender(qr.table, canvas)}
            />
            <br />
            <button onClick={() => downloadQR(qr.table, qr.dataUrl)} style={{ background: '#ff6b6b', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}