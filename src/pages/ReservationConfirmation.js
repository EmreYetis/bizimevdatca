import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Baş harfleri büyük yapma fonksiyonu
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// İsim ve soyismi büyük harfle yazma fonksiyonu
const capitalizeFullName = (fullName) => {
  return fullName.split(' ').map(name => capitalizeFirstLetter(name)).join(' ');
};

const formatDate = (date) => {
  if (!date) return ''; // Eğer tarih yoksa boş döner
  const [year, month, day] = date.split('-'); // Tarihi parçalar
  return `${day}.${month}.${year}`; // Yeni format
};

const ReservationConfirmation = () => {
  const [name, setName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nights, setNights] = useState('');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [mealPlan, setMealPlan] = useState('Kahvaltı Dahil'); // Yemek planı için varsayılan değer
  const [nightlyRate, setNightlyRate] = useState(''); // Gecelik fiyat için yeni state
  const [roomType, setRoomType] = useState('İskaroz Taş Oda'); // Oda tipi için varsayılan değer
  const [reservationSummary, setReservationSummary] = useState('');

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

  // Oda tipi değiştiğinde yemek planını güncelle
  useEffect(() => {
    if (roomType === 'Yamaç Ev') {
      setMealPlan('Sadece Oda');
    }
  }, [roomType]);

  // Toplam fiyatı hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    if (nights && nightlyRate) {
      return parseInt(nights) * parseInt(nightlyRate);
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);
    const totalPrice = calculateTotalPrice();
    const depositAmount = totalPrice; // Ön ödeme artık her zaman toplam tutar
  
    const childrenSummary = children > 0 ? `- ${children} Çocuk\n` : '';
  
    // Banka bilgilerini oda tipine göre belirleme
    const bankDetails = roomType === 'Yamaç Ev' 
      ? `\n\nHESAP ADI:\nSERKAN SOYTOK - MURAT CENNET\n\nİBAN:\nTR29 0006 4000 0013 6600 3265 59\n\nGönderim sonrasında dekontunuzu rica ederiz`
      : `\n\nHESAP ADI:\nZorlu yavuz aydeniz bizimev\n\nİBAN:\nTR86 0006 4000 0013 6600 3774 28\n\nİş Bankası Datça şubesi\n\nGönderim sonrasında dekontunuzu rica ederiz`;
  
    let summary = `
- ${capitalizeFullName(name)}
- ${roomType}

- ${formattedCheckInDate} Giriş
- ${formattedCheckOutDate} Çıkış
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
        <div className="col-12 text-center">
          <h2 className="mb-4">Rezervasyon Bilgileri</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-md"
                placeholder="İsim Soyisim"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <select
                className="form-select form-select-md"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
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
            <div className="mb-2">
              <input
                type="date"
                className="form-control form-control-md"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-md"
                placeholder="Gece Sayısı"
                value={nights}
                onChange={(e) => setNights(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-md"
                placeholder="Yetişkin Sayısı"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-md"
                placeholder="Çocuk Sayısı"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <select
                className="form-select form-select-md"
                value={mealPlan}
                onChange={(e) => setMealPlan(e.target.value)}
                disabled={roomType === 'Yamaç Ev'}
              >
                <option value="Kahvaltı Dahil">Kahvaltı Dahil</option>
                <option value="Sadece Oda">Sadece Oda</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control form-control-md"
                placeholder="Gecelik Fiyat"
                value={nightlyRate}
                onChange={(e) => setNightlyRate(e.target.value)}
                required
              />
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
