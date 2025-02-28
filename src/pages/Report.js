import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './Report.css'; // CSS dosyasını ekleyin

// Baş harfleri büyük yapma fonksiyonu
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// İsim ve soyismi büyük harfle yazma fonksiyonu
const capitalizeFullName = (fullName) => {
  return fullName.split(' ').map(name => capitalizeFirstLetter(name)).join(' ');
};

const Report = () => {
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [checkOuts, setCheckOuts] = useState(() => {
    const savedCheckOuts = localStorage.getItem('checkOuts');
    return savedCheckOuts ? JSON.parse(savedCheckOuts) : [{ name: '', room: '' }];
  });
  const [stayingGuests, setStayingGuests] = useState(() => {
    const savedStayingGuests = localStorage.getItem('stayingGuests');
    return savedStayingGuests ? JSON.parse(savedStayingGuests) : [{ name: '', room: '' }];
  });
  const [checkIns, setCheckIns] = useState(() => {
    const savedCheckIns = localStorage.getItem('checkIns');
    return savedCheckIns ? JSON.parse(savedCheckIns) : [{ name: '', room: '' }];
  });
  const [reportMessage, setReportMessage] = useState('');

  // Verileri localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('checkOuts', JSON.stringify(checkOuts));
  }, [checkOuts]);

  useEffect(() => {
    localStorage.setItem('stayingGuests', JSON.stringify(stayingGuests));
  }, [stayingGuests]);

  useEffect(() => {
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
  }, [checkIns]);

  // Tüm verileri temizleme fonksiyonu
  const clearAllData = () => {
    if (window.confirm('Tüm verileri silmek istediğinizden emin misiniz?')) {
      setCheckOuts([{ name: '', room: '' }]);
      setStayingGuests([{ name: '', room: '' }]);
      setCheckIns([{ name: '', room: '' }]);
      localStorage.removeItem('checkOuts');
      localStorage.removeItem('stayingGuests');
      localStorage.removeItem('checkIns');
    }
  };

  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dayOptions = { weekday: 'long' };
    setDate(today.toLocaleDateString('tr-TR', options));
    setDay(today.toLocaleDateString('tr-TR', dayOptions));
  }, []);

  const generateReport = () => {
    const filteredCheckIns = checkIns.filter(guest => guest.name && guest.room);
    const filteredStaying = stayingGuests.filter(guest => guest.name && guest.room);
    const filteredCheckOuts = checkOuts.filter(guest => guest.name && guest.room);

    const checkInList = filteredCheckIns.map((guest) => `${capitalizeFirstLetter(guest.room)} - ${capitalizeFullName(guest.name)}`).join('\n . ');
    const stayingList = filteredStaying.map((guest) => `${capitalizeFirstLetter(guest.room)} - ${capitalizeFullName(guest.name)}`).join('\n . ');
    const checkOutList = filteredCheckOuts.map((guest) => `${capitalizeFirstLetter(guest.room)} - ${capitalizeFullName(guest.name)}`).join('\n . ');

    let message = `
${date} / ${day}

         Günaydın ☀️ 

- ${filteredCheckIns.length > 0 
    ? `⁠Giriş yapacak ${filteredCheckIns.length} odamız bulunmaktadır.`
    : 'Giriş yapacak odamız bulunmamaktadır.'}
- ${filteredStaying.length > 0 
    ? `Konaklamaya devam eden ${filteredStaying.length} odamız bulunmaktadır.`
    : 'Konaklamaya devam eden odamız bulunmamaktadır.'}
- ${filteredCheckOuts.length > 0 
    ? `Çıkış yapacak ⁠${filteredCheckOuts.length} odamız bulunmaktadır.`
    : 'Çıkış yapacak odamız bulunmamaktadır.'}\n`;

    if (filteredCheckIns.length > 0) {
      message += `\nGirişler ;\n\n . ${checkInList}\n`;
    }

    if (filteredStaying.length > 0) {
      message += `\nKonaklayanlar ;\n\n . ${stayingList}\n`;
    }

    if (filteredCheckOuts.length > 0) {
      message += `\nÇıkışlar ;\n\n . ${checkOutList}\n`;
    }

    message += '\n                    Saygılar ☘️';
    setReportMessage(message);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMessage);
    alert('Mesaj kopyalandı!');
  };

  const moveToCheckOut = (guest, sourceIndex, sourceState, setSourceState) => {
    // Kaynaktan girdiyi kaldır
    const newSource = sourceState.filter((_, i) => i !== sourceIndex);
    setSourceState(newSource);
    
    // Çıkışlara ekle
    setCheckOuts(prevCheckOuts => [...prevCheckOuts, { name: guest.name, room: guest.room }]);
  };

  const moveToStaying = (guest, sourceIndex, sourceState, setSourceState) => {
    // Kaynaktan girdiyi kaldır
    const newSource = sourceState.filter((_, i) => i !== sourceIndex);
    setSourceState(newSource);
    
    // Konaklamaya ekle
    setStayingGuests(prevStaying => [...prevStaying, { name: guest.name, room: guest.room }]);
  };

  const moveToCheckIn = (guest, sourceIndex, sourceState, setSourceState) => {
    // Kaynaktan girdiyi kaldır
    const newSource = sourceState.filter((_, i) => i !== sourceIndex);
    setSourceState(newSource);
    
    // Girişlere ekle
    setCheckIns(prevCheckIns => [...prevCheckIns, { name: guest.name, room: guest.room }]);
  };

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Rapor Oluşturma Sayfası</h2>
        <button 
          className="btn btn-warning"
          onClick={clearAllData}
        >
          Tüm Verileri Temizle
        </button>
      </div>
      
      {/* Girdiler Bölümü */}
      <div className='row mb-5'>
        {/* Girişler */}
        <div className='col-md-4'>
          <h3>Girişler</h3>
          {checkIns.map((checkIn, index) => (
            <div className="form-row mb-2" key={index}>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Oda"
                  value={checkIn.room}
                  onChange={(e) => {
                    const newCheckIns = [...checkIns];
                    newCheckIns[index].room = e.target.value;
                    setCheckIns(newCheckIns);
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="İsim Soyisim"
                  value={checkIn.name}
                  onChange={(e) => {
                    const newCheckIns = [...checkIns];
                    newCheckIns[index].name = e.target.value;
                    setCheckIns(newCheckIns);
                  }}
                />
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => moveToStaying(checkIn, index, checkIns, setCheckIns)}
                  title="Konaklamaya Taşı"
                >
                  →K
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => moveToCheckOut(checkIn, index, checkIns, setCheckIns)}
                  title="Çıkışlara Taşı"
                >
                  →Ç
                </button>
                <button 
                  className="btn btn-danger btn-sm delete-btn"
                  onClick={() => {
                    const newCheckIns = checkIns.filter((_, i) => i !== index);
                    setCheckIns(newCheckIns);
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-success" onClick={() => setCheckIns([...checkIns, { name: '', room: '' }])}>Giriş Ekle</button>
        </div>

        {/* Konaklayanlar */}
        <div className='col-md-4'>
          <h3>Konaklayanlar</h3>
          {stayingGuests.map((guest, index) => (
            <div className="form-row mb-2" key={index}>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Oda"
                  value={guest.room}
                  onChange={(e) => {
                    const newGuests = [...stayingGuests];
                    newGuests[index].room = e.target.value;
                    setStayingGuests(newGuests);
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="İsim Soyisim"
                  value={guest.name}
                  onChange={(e) => {
                    const newGuests = [...stayingGuests];
                    newGuests[index].name = e.target.value;
                    setStayingGuests(newGuests);
                  }}
                />
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={() => moveToCheckIn(guest, index, stayingGuests, setStayingGuests)}
                  title="Girişlere Taşı"
                >
                  →G
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => moveToCheckOut(guest, index, stayingGuests, setStayingGuests)}
                  title="Çıkışlara Taşı"
                >
                  →Ç
                </button>
                <button 
                  className="btn btn-danger btn-sm delete-btn"
                  onClick={() => {
                    const newGuests = stayingGuests.filter((_, i) => i !== index);
                    setStayingGuests(newGuests);
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-success" onClick={() => setStayingGuests([...stayingGuests, { name: '', room: '' }])}>Konaklayan Ekle</button>
        </div>

        {/* Çıkışlar */}
        <div className='col-md-4'>
          <h3>Çıkışlar</h3>
          {checkOuts.map((checkOut, index) => (
            <div className="form-row mb-2" key={index}>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Oda"
                  value={checkOut.room}
                  onChange={(e) => {
                    const newCheckOuts = [...checkOuts];
                    newCheckOuts[index].room = e.target.value;
                    setCheckOuts(newCheckOuts);
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="İsim Soyisim"
                  value={checkOut.name}
                  onChange={(e) => {
                    const newCheckOuts = [...checkOuts];
                    newCheckOuts[index].name = e.target.value;
                    setCheckOuts(newCheckOuts);
                  }}
                />
              </div>
              <div className="btn-group">
                <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={() => moveToCheckIn(checkOut, index, checkOuts, setCheckOuts)}
                  title="Girişlere Taşı"
                >
                  →G
                </button>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => moveToStaying(checkOut, index, checkOuts, setCheckOuts)}
                  title="Konaklamaya Taşı"
                >
                  →K
                </button>
                <button 
                  className="btn btn-danger btn-sm delete-btn"
                  onClick={() => {
                    const newCheckOuts = checkOuts.filter((_, i) => i !== index);
                    setCheckOuts(newCheckOuts);
                  }}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <button className="btn btn-success" onClick={() => setCheckOuts([...checkOuts, { name: '', room: '' }])}>Çıkış Ekle</button>
        </div>
      </div>

      {/* Rapor Bölümü */}
      <div className="report-section">
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-primary" onClick={generateReport}>Raporu Oluştur</button>
          <button className="btn btn-secondary" onClick={handleCopy} disabled={!reportMessage}>Raporu Kopyala</button>
        </div>
        <pre className="report-preview">{reportMessage}</pre>
      </div>
    </div>
  );
};

export default Report;