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
  
  // Oda tiplerini ve adlarını burada tanımlayalım
  const roomTypes = {
    'Vagon Ev': ['İnceburun', 'Gökliman', 'Armutlusu', 'Çetisuyu', 'İncirlin', 'Hurmalıbük', 'Sarıliman', 'Kızılbük', 'Değirmenbükü'],
    'Taş Ev': ['İskaroz', 'İskorpit', 'Lopa'],
    'Yamaç Ev': ['Yamaç Ev']
  };

  // Tüm oda isimlerini düz bir liste haline getir
  const allRooms = Object.values(roomTypes).flat();
  
  // Konaklayanlar bölümünde dolu olan odaları al
  const occupiedRooms = stayingGuests
    .filter(guest => guest.room && guest.name)
    .map(guest => guest.room);
  
  // Girişler için kullanılabilir odalar (konaklayanlar bölümünde olmayan odalar)
  const availableRooms = allRooms.filter(room => !occupiedRooms.includes(room));
  
  // Çıkışlar için kullanılabilir odalar (konaklayanlar bölümünde olmayan odalar)
  const checkOutRooms = allRooms.filter(room => !occupiedRooms.includes(room));
  
  // Girişler bölümünde zaten seçilmiş odaları al
  const selectedCheckInRooms = checkIns
    .filter(guest => guest.room && guest.name)
    .map(guest => guest.room);
  
  // Çıkışlar bölümünde zaten seçilmiş odaları al
  const selectedCheckOutRooms = checkOuts
    .filter(guest => guest.room && guest.name)
    .map(guest => guest.room);

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


  const printRoomReport = () => {
    const printWindow = window.open('', '_blank');
  
    if (!printWindow) {
      alert('Yeni pencere açılamadı. Pop-up engelleme ayarlarınızı kontrol edin.');
      return;
    }
  
    const today = new Date();
    const formattedDate = today.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  
    let tableRows = '';

    // Oda tipleri sırasını korumak için anahtarları diziye al
    const roomTypeKeys = Object.keys(roomTypes);

    Object.entries(roomTypes).forEach(([type, rooms], typeIdx) => {
      const totalRows = rooms.length;
      const firstRoom = rooms[0];
      const matchedGuestsFirst = [
        ...checkIns,
        ...stayingGuests
      ].filter(g => g.room === firstRoom && g.name);
      const guestNamesFirst = matchedGuestsFirst.map(g => capitalizeFullName(g.name)).join(', ');
      const checkInRooms = checkIns
        .filter(guest => guest.room && guest.name)
        .map(guest => guest.room);
      const isCheckInRoom = checkInRooms.includes(firstRoom);
      const roomDisplay = isCheckInRoom ? `${firstRoom} ⭐` : firstRoom;

      // Kalın çizgi eklenmesi gereken satır mı?
      let extraClass = '';
      // İlk satır veya Vagon Ev'den Taş Ev'e veya Taş Ev'den Yamaç Ev'e geçerken
      if (
        typeIdx === 0 ||
        (type === 'Taş Ev' && roomTypeKeys[typeIdx - 1] === 'Vagon Ev') ||
        (type === 'Yamaç Ev' && roomTypeKeys[typeIdx - 1] === 'Taş Ev')
      ) {
        extraClass = 'section-border';
      }

      tableRows += `
        <tr class="${extraClass}">
          <td rowspan="${totalRows}" style="border: 1px solid #000;">${type}</td>
          <td style="border: 1px solid #000;">${roomDisplay}</td>
          <td style="border: 1px solid #000;">${guestNamesFirst}</td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
        </tr>
      `;
      for (let i = 1; i < rooms.length; i++) {
        const room = rooms[i];
        const matchedGuests = [
          ...checkIns,
          ...stayingGuests
        ].filter(g => g.room === room && g.name);
        const guestNames = matchedGuests.map(g => capitalizeFullName(g.name)).join(', ');
        const isCheckInRoom = checkInRooms.includes(room);
        const roomDisplay = isCheckInRoom ? `${room} ⭐` : room;
        tableRows += `
          <tr>
            <td style="border: 1px solid #000;">${roomDisplay}</td>
            <td style="border: 1px solid #000;">${guestNames}</td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
            <td style="border: 1px solid #000;"></td>
          </tr>
        `;
      }
    });
  
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>Oda Durumu Raporu - ${formattedDate}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .print-btn {
            display: block;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .section-border td {
            border-top: 3px solid #000 !important;
          }
          @media print {
            .print-btn { display: none; }
            th, td { border: 1px solid #000 !important; }
            .section-border td {
              border-top: 3px solid #000 !important;
            }
          }
        </style>
      </head>
      <body>
        <h2>Oda Durumu Raporu</h2>
        <button class="print-btn" onclick="window.print()">Yazdır</button>
        <table style="width: 100%; table-layout: fixed; border-collapse: collapse; border: 1px solid black;">
          <thead>
            <tr>
              <th rowspan="3" style="width: 12%;">Oda Tipi</th>
              <th rowspan="3" style="width: 12%;">Oda Adı</th>
              <th rowspan="3" style="width: 20%;">Ad-Soyad</th>
              <th rowspan="2" colspan="2" style="width: 12%;">Sayı</th>
              <th rowspan="2" colspan="2" style="width: 12%;">Akşam Yemeği</th>
              <th rowspan="2" colspan="2" style="width: 12%;">Kahvaltı</th>
              <th rowspan="3" style="width: 20%;">Telefon</th>
            </tr>
            <tr>

            </tr>
            <tr>
              <th>Yetişkin</th>
              <th>Çocuk</th>
              <th>Var</th>
              <th>Yok</th>
              <th>Var</th>
              <th>Yok</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
                <select
                  className="form-control"
                  value={checkIn.room}
                  onChange={(e) => {
                    const newCheckIns = [...checkIns];
                    newCheckIns[index].room = e.target.value;
                    setCheckIns(newCheckIns);
                  }}
                >
                  <option value="">Oda Seçin</option>
                  {availableRooms
                    .filter(room => !selectedCheckInRooms.includes(room) || room === checkIn.room)
                    .map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                </select>
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
                <select
                  className="form-control"
                  value={guest.room}
                  onChange={(e) => {
                    const newGuests = [...stayingGuests];
                    newGuests[index].room = e.target.value;
                    setStayingGuests(newGuests);
                  }}
                >
                  <option value="">Oda Seçin</option>
                  {allRooms.map((room) => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
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
                <select
                  className="form-control"
                  value={checkOut.room}
                  onChange={(e) => {
                    const newCheckOuts = [...checkOuts];
                    newCheckOuts[index].room = e.target.value;
                    setCheckOuts(newCheckOuts);
                  }}
                >
                  <option value="">Oda Seçin</option>
                  {checkOutRooms
                    .filter(room => !selectedCheckOutRooms.includes(room) || room === checkOut.room)
                    .map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                </select>
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
          <button className="btn btn-success" onClick={printRoomReport}>Oda Tablosu Oluştur</button>
        </div>
        <pre className="report-preview">{reportMessage}</pre>
      </div>

    </div>
  );
};

export default Report;

