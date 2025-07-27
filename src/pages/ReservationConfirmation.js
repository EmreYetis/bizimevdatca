import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Baş harfleri büyük yapma fonksiyonu
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// İsim ve soyismi büyük harfle yazma fonksiyonu
const capitalizeFullName = (fullName) => {
  return fullName.split(' ').map(name => capitalizeFirstLetter(name)).join(' ');
};

// Günü Türkçe formatta döndüren fonksiyon
const getDayOfWeek = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  return days[date.getDay()];
};

const formatDate = (date) => {
  if (!date) return ''; // Eğer tarih yoksa boş döner
  const [year, month, day] = date.split('-'); // Tarihi parçalar
  return `${day}.${month}.${year}`; // Yeni format
};

// Tarih ve gün bilgisini formatlayan fonksiyon
const formatDateWithDay = (date, isCheckIn = true) => {
  if (!date) return '';
  const formattedDate = formatDate(date);
  const dayOfWeek = getDayOfWeek(date);
  const timeInfo = isCheckIn ? "(Check-In: 14.00)" : "(Check-Out: 11.30)";
  return `${formattedDate} ${dayOfWeek} ${isCheckIn ? "Giriş" : "Çıkış"}\n${timeInfo}`;
};

const ReservationConfirmation = () => {
  const [name, setName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nights, setNights] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [mealPlan, setMealPlan] = useState('Kahvaltı Dahil');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [rooms, setRooms] = useState([{ type: 'İskaroz Taş Oda' }]);
  const [nightlyRate, setNightlyRate] = useState('');
  const [reservationSummary, setReservationSummary] = useState('');

  // Form resetleme fonksiyonu
  const handleReset = () => {
    setName('');
    setCheckInDate('');
    setCheckOutDate('');
    setNights('');
    setAdults('');
    setChildren('');
    setMealPlan('Kahvaltı Dahil');
    setNumberOfRooms(1);
    setRooms([{ type: 'İskaroz Taş Oda' }]);
    setNightlyRate('');
    setReservationSummary('');
  };

  // checkInDate veya nights değiştiğinde çıkış tarihini otomatik hesapla
  useEffect(() => {
    if (checkInDate && nights) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + parseInt(nights));
      
      // YYYY-MM-DD formatına çevir
      const formattedDate = checkOut.toISOString().split('T')[0];
      setCheckOutDate(formattedDate);
    }
  }, [checkInDate, nights]);

  // Oda sayısı değiştiğinde rooms state'ini güncelle
  useEffect(() => {
    const defaultRoomType = 'İskaroz Taş Oda';
    setRooms(prevRooms => {
      const newRooms = Array(numberOfRooms).fill(null).map((_, index) => {
        return prevRooms[index] || { type: defaultRoomType };
      });
      return newRooms;
    });
  }, [numberOfRooms]);

  // Oda tipi değiştiğinde yemek planını güncelle
  useEffect(() => {
    if (rooms.some(room => room.type === 'Yamaç Ev')) {
      setMealPlan('Sadece Oda');
    }
  }, [rooms]);

  const handleRoomTypeChange = (index, value) => {
    const newRooms = [...rooms];
    newRooms[index] = { type: value };
    setRooms(newRooms);
  };

  // Toplam fiyatı hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    if (nights && nightlyRate) {
      return parseInt(nights) * parseInt(nightlyRate) * rooms.length;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formattedCheckInDate = formatDateWithDay(checkInDate, true);
    const formattedCheckOutDate = formatDateWithDay(checkOutDate, false);
    const totalPrice = calculateTotalPrice();
    const depositAmount = totalPrice;
  
    const childrenSummary = children > 0 ? `- ${children} Çocuk\n` : '';

    // Oda özetini oluştur
    const roomsSummary = rooms.map(room => room.type).join(' , ');
  
    // Banka bilgilerini ilk odanın tipine göre belirle
    const bankDetails = rooms[0].type === 'Yamaç Ev' 
      ? `\n\nHESAP ADI:\nSERKAN SOYTOK - MURAT CENNET\n\nİBAN:\nTR29 0006 4000 0013 6600 3265 59\n\nGönderim sonrasında dekontunuzu rica ederiz`
      : `\n\nHESAP ADI:\nZorlu yavuz aydeniz bizimev\n\nİBAN:\nTR86 0006 4000 0013 6600 3774 28\n\nİş Bankası Datça şubesi\n\nGönderim sonrasında dekontunuzu rica ederiz`;
  
    let summary = `
- ${capitalizeFullName(name)}
- ${roomsSummary}

- ${formattedCheckInDate}
- ${formattedCheckOutDate}
- ${nights} Gece
- ${adults} Yetişkin
${childrenSummary}- ${mealPlan}

- Toplam Fiyat: ${totalPrice} ₺
- Ön Ödeme: ${depositAmount} ₺${bankDetails}
    `.trim();

    setReservationSummary(summary);
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 text-center d-flex align-items-center justify-content-center">
          <h2 className="mb-4 me-2">Rezervasyon Bilgileri</h2>
          <button 
            type="button" 
            className="btn btn-info mb-4 d-flex align-items-center justify-content-center"
            onClick={handleReset}
            style={{ width: '35px', height: '35px', padding: '0' }}
            title="Formu Sıfırla"
          >
            <i className="bi bi-arrow-clockwise" style={{ fontSize: '20px' }}></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-md"
                  placeholder="İsim Soyisim"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2 d-flex align-items-center">
              <label className="me-2">Oda Sayısı:</label>
              <div className="input-group" style={{ width: 'auto' }}>
                <button 
                  type="button" 
                  className="btn btn-danger d-flex align-items-center justify-content-center"
                  style={{ width: '30px', height: '30px', padding: '0' }}
                  onClick={() => setNumberOfRooms(prev => Math.max(1, prev - 1))}
                >
                  <span style={{ fontSize: '30px', lineHeight: '1' }}>-</span>
                </button>
                <input
                  type="number"
                  className="form-control text-center px-0"
                  min="1"
                  max="6"
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))}
                  style={{ width: '30px', minWidth: '30px', height: '39px' , padding: '0 2px' }}
                  readOnly
                />
                <button 
                  type="button" 
                  className="btn btn-success d-flex align-items-center justify-content-center ml-1"
                  style={{ width: '30px', height: '30px', padding: '0' }}
                  onClick={() => setNumberOfRooms(prev => Math.min(6, prev + 1))}
                >
                  <span style={{ fontSize: '30px', lineHeight: '1' }}>+</span>
                </button>
              </div>
            </div>

            {rooms.map((room, index) => (
              <div key={index} className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-house-fill"></i>
                  </span>
                  <select
                    className="form-select form-select-md"
                    value={room.type}
                    onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                  >
                    <option value="İskaroz Taş Oda">İskaroz Taş Oda</option>
                    <option value="İskorpit Taş Oda">İskorpit Taş Oda</option>
                    <option value="Lopa Taş Oda">Lopa Taş Oda</option>
                    <option value="İnceburun Vagon Ev">İnceburun Vagon Ev</option>
                    <option value="Gökliman Vagon Ev">Gökliman Vagon Ev</option>
                    <option value="Armutlusu Vagon Ev">Armutlusu Vagon Ev</option>
                    <option value="Çetisuyu Vagon Ev">Çetisuyu Vagon Ev</option>
                    <option value="İncirliin Vagon Ev">İncirliin Vagon Ev</option>
                    <option value="Hurmalıbük Vagon Ev">Hurmalıbük Vagon Ev</option>
                    <option value="Değirmenbükü Vagon Ev">Değirmenbükü Vagon Ev</option>
                    <option value="Kızılbük Vagon Ev">Kızılbük Vagon Ev</option>
                    <option value="Sarıliman Vagon Ev">Sarıliman Vagon Ev</option>
                    <option value="Yamaç Ev">Yamaç Ev</option>
                    <option value="Mengen Ev">Mengen Ev</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar-check-fill"></i>
                </span>
                <input
                  type="date"
                  className="form-control form-control-md"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-moon-stars-fill"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-md"
                  placeholder="Gece Sayısı"
                  value={nights}
                  onChange={(e) => setNights(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-people-fill"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-md"
                  placeholder="Yetişkin Sayısı"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-heart"></i>
                </span>
                <input
                  type="text"
                  className="form-control form-control-md"
                  placeholder="Çocuk Sayısı"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-2">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-cup-hot-fill"></i>
                </span>
                <select
                  className="form-select form-select-md"
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value)}
                  disabled={rooms.some(room => room.type === 'Yamaç Ev')}
                >
                  <option value="Kahvaltı Dahil">Kahvaltı Dahil</option>
                  <option value="Sadece Oda">Sadece Oda</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-currency-dollar me-1"></i>
                  <i className="bi bi-currency-lira"></i>
                </span>
                <input
                  type="number"
                  className="form-control form-control-md"
                  placeholder="Gecelik Fiyat"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm w-100">Rezervasyonu Tamamla</button>
          </form>
        </div>

        <div className="col-md-6">
          {reservationSummary && (
            <div className="bg-light p-3 rounded">
              <h3 className="text-center">Rezervasyon Özeti</h3>
              <pre className="small">{reservationSummary}</pre>
              <button
                className="btn btn-success btn-sm w-100 mt-2"
                onClick={() => navigator.clipboard.writeText(reservationSummary)}
              >
                Kopyala
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;
