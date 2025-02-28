import React, { useState } from 'react';

const KapiGiris = () => {
  const [selectedHouse, setSelectedHouse] = useState('');
  const [adSoyad, setAdSoyad] = useState('');
  const [telefon, setTelefon] = useState('');
  const [yetişkinSayısı, setYetişkinSayısı] = useState(0);
  const [çocukSayısı, setÇocukSayısı] = useState(0);
  const [kahvaltı, setKahvaltı] = useState('Kahvaltı Dahil');
  const [message, setMessage] = useState('');

  const houses = [
    'İskaroz Taş Oda',
    'İskorpit Taş Oda',
    'Lopa Taş Oda',
    'İnceburun Vagon Ev',
    'Gökliman Vagon Ev',
    'Armutlusu Vagon Ev',
    'Çetisuyu Vagon Ev',
    'İncirliin Vagon Ev',
    'Hurmalıbük Vagon Ev',
    'Değirmenbükü Vagon Ev',
    'Kızılbük Vagon Ev',
    'Sarıliman Vagon Ev',
    'Yamaç Ev',
    'Mengen Ev',
  ];

  const handleSubmit = () => {
    const formattedTelefon = telefon.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    
    const formatName = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const formattedAdSoyad = formatName(adSoyad);
    const childrenMessage = çocukSayısı > 0 ? `${çocukSayısı} Çocuk` : '';
    const newMessage = `Merhaba\n-"${selectedHouse}" kapı misafiri giriş yaptı.\n-${yetişkinSayısı} Yetişkin ${childrenMessage}\n-${kahvaltı}\n\n${formattedAdSoyad}\n${formattedTelefon}`;
    setMessage(newMessage);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    alert('Mesaj kopyalandı!');
  };

  const handleTelefonChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setTelefon(value);
    }
  };

  return (
    <div className='form-container'>
      <div className='content-wrapper'>
        <div className='left-column'>
          <h2 className='form-title'>Kapı Müşterisi</h2>
          <div className='form-wrapper'>
            <select className='form-select' onChange={(e) => setSelectedHouse(e.target.value)}>
              <option value="">Ev Seçin</option>
              {houses.map((house, index) => (
                <option key={index} value={house}>{house}</option>
              ))}
            </select>
            <select className='form-select' onChange={(e) => setKahvaltı(e.target.value)}>
              <option value="">Kahvaltı Seçin</option>
              <option value="Kahvaltı Dahil">Kahvaltı Dahil</option>
              <option value="Kahvaltı Hariç">Kahvaltı Hariç</option>
            </select>
            <input className='form-input' type="text" placeholder="İsim Soyisim" onChange={(e) => setAdSoyad(e.target.value)} />
            <input className='form-input' type="text" placeholder="Telefon Numarası" onChange={handleTelefonChange} />
            <input className='form-input' type="number" placeholder="Yetişkin Sayısı" onChange={(e) => setYetişkinSayısı(e.target.value)} />
            <input className='form-input' type="number" placeholder="Çocuk Sayısı" onChange={(e) => setÇocukSayısı(e.target.value)} />
            <button className='form-button' onClick={handleSubmit}>Gönder</button>
          </div>
        </div>
        <div className='right-column'>
          {message && (
            <div className='message-container'>
              <pre className='message-text'>{message}</pre>
              <button className='copy-button' onClick={copyToClipboard}>Kopyala</button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .form-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .content-wrapper {
          display: flex;
          gap: 40px;
        }

        .left-column {
          flex: 1;
          max-width: 500px;
        }

        .right-column {
          flex: 1;
          display: flex;
          align-items: flex-start;
          padding-top: 80px;
        }

        .form-title {
          text-align: left;
          color: #333;
          margin-bottom: 30px;
        }

        .message-container {
          width: 100%;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: flex-start;
          width: 100%;
        }

        .form-input, .form-select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
        }

        .form-button, .copy-button {
          padding: 12px 20px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .form-button:hover, .copy-button:hover {
          background-color: #357abd;
        }

        .message-text {
          white-space: pre-wrap;
          margin-bottom: 15px;
          font-family: monospace;
          font-size: 14px;
        }

        /* Number input ok'larını kaldırma */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        .form-input::placeholder {
          text-align: left;
        }

        .form-button {
          padding: 12px 20px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
          margin: 0 auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default KapiGiris; 