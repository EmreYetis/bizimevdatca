// CheckIn.js
import React from 'react';

const CheckIn = () => {
  const welcomeText = `Değerli Misafirimiz Hoşgeldiniz ☘️

📌 Oda Temizlikleri 14.00 - 17.00 Saatleri Arasında Siz Değerli Misafirlerimizin Talepleri Doğrultusunda Yapılmaktadır.

📌 Wifi Bağlantı Ve Şifremiz

bizimev_datca_misafir için - bizimevdatcakargi

BizimEvDatçaKargı için - memduhamca


📌 Restoran Hizmetimiz Ve Odaya Sipariş için 0533 266 10 99 noya ulaşabilirsiniz.

📌 Plaj Havlusu Hizmetimiz Mevcuttur

📌Resepsiyonumuz 08.30 - 23.00 Saatleri Arasında Hizmet Vermektedir.

Keyif Dolu Tatil Dileriz ☘️

Bizim Ev Datça`;

  const handleCopy = () => {
    navigator.clipboard.writeText(welcomeText)
      .then(() => {
        alert('Bilgiler kopyalandı!');
      })
      .catch(err => {
        console.error('Kopyalama hatası:', err);
        alert('Kopyalama başarısız oldu!');
      });
  };

  return (
    <div className='container'>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Check In</h2>
        <button 
          onClick={handleCopy}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Metni Kopyala
        </button>
      </div>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        fontFamily: 'inherit',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        {welcomeText}
      </pre>
    </div>
  );
};

export default CheckIn;