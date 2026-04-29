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

// Türkçe binlik ayıracı ile fiyat formatlama (ör: 30000 -> 30.000 ₺)
const formatTRY = (value) => {
  const numeric = Number(value) || 0;
  return `${numeric.toLocaleString('tr-TR')} ₺`;
};

const ROOM_TYPE_OPTIONS = [
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
];

/** `YYYY-MM-DD` + gün sayısı ile çıkış tarihi (mevcut gece mantığı ile uyumlu) */
const addNightsToDateString = (dateStr, nightsStr) => {
  if (!dateStr || nightsStr === '') return '';
  const n = parseInt(nightsStr, 10);
  if (Number.isNaN(n) || n < 1) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const getRoomPhotoUrl = (roomType) => {
  switch (roomType) {
    case 'İskaroz Taş Oda':
      return 'https://bizimevdatca.com/iskaroz-Tas-Oda.html';
    case 'İskorpit Taş Oda':
      return 'https://bizimevdatca.com/iskorpit-Tas-Oda.html';
    case 'Lopa Taş Oda':
      return 'https://bizimevdatca.com/Lopa-Tas-Oda.html';
    case 'İnceburun Vagon Ev':
      return 'https://bizimevdatca.com/Inceburun-Vagon-Ev.html';
    case 'Gökliman Vagon Ev':
      return 'https://bizimevdatca.com/Gokliman-Vagon-Ev.html';
    case 'Armutlusu Vagon Ev':
      return 'https://bizimevdatca.com/Armutlusu-Vagon-Ev.html';
    case 'Çetisuyu Vagon Ev':
      return 'https://bizimevdatca.com/Cetisuyu-Vagon-Ev.html';
    case 'İncirliin Vagon Ev':
      return 'https://bizimevdatca.com/incirliin-Vagon-Ev.html';
    case 'Hurmalıbük Vagon Ev':
      return 'https://bizimevdatca.com/Hurmalibuk-Vagon-Ev.html';
    case 'Değirmenbükü Vagon Ev':
      return 'https://bizimevdatca.com/degirmenbuku-vagon-ev.html';
    case 'Kızılbük Vagon Ev':
      return 'https://bizimevdatca.com/Kizilbuk-Vagon-Ev.html';
    case 'Sarıliman Vagon Ev':
      return 'https://bizimevdatca.com/Sariliman-Vagon-Ev.html';
    default:
      return 'https://bizimevdatca.com';
  }
};

const roomTypeToSummaryBlock = (roomType) => {
  if (roomType === 'Yamaç Ev') {
    return roomType;
  }
  return `${roomType}\n📸 ${getRoomPhotoUrl(roomType)}`;
};

const getEffectiveSegmentRate = (segment, fallbackNightly) => {
  const p = parseInt(segment.price, 10);
  if (!Number.isNaN(p) && p > 0) return p;
  const f = parseInt(fallbackNightly, 10);
  return !Number.isNaN(f) && f > 0 ? f : NaN;
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
  const [roomChangeReservation, setRoomChangeReservation] = useState(false);
  const [staySegments, setStaySegments] = useState([
    { type: 'İskaroz Taş Oda', nights: '', price: '' },
    { type: 'İskaroz Taş Oda', nights: '', price: '' },
  ]);

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
    setRoomChangeReservation(false);
    setStaySegments([
      { type: 'İskaroz Taş Oda', nights: '', price: '' },
      { type: 'İskaroz Taş Oda', nights: '', price: '' },
    ]);
  };

  // checkInDate veya nights değiştiğinde çıkış tarihini otomatik hesapla (oda değişimli değilken)
  useEffect(() => {
    if (roomChangeReservation) return;
    if (checkInDate && nights) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + parseInt(nights));
      
      // YYYY-MM-DD formatına çevir
      const formattedDate = checkOut.toISOString().split('T')[0];
      setCheckOutDate(formattedDate);
    }
  }, [checkInDate, nights, roomChangeReservation]);

  // Oda değişimli: dilimlerden toplam gece ve çıkış tarihi
  useEffect(() => {
    if (!roomChangeReservation || !checkInDate) return;
    const totalNights = staySegments.reduce((sum, seg) => {
      const n = parseInt(seg.nights, 10);
      return sum + (Number.isNaN(n) ? 0 : n);
    }, 0);
    if (totalNights > 0) {
      const co = addNightsToDateString(checkInDate, String(totalNights));
      setCheckOutDate(co);
    } else {
      setCheckOutDate('');
    }
  }, [checkInDate, staySegments, roomChangeReservation]);

  // Oda sayısı değiştiğinde rooms state'ini güncelle
  useEffect(() => {
    if (roomChangeReservation) return;
    const defaultRoomType = 'İskaroz Taş Oda';
    setRooms(prevRooms => {
      const newRooms = Array(numberOfRooms).fill(null).map((_, index) => {
        return prevRooms[index] || { type: defaultRoomType };
      });
      return newRooms;
    });
  }, [numberOfRooms, roomChangeReservation]);

  // Oda tipi değiştiğinde yemek planını güncelle
  useEffect(() => {
    const hasYamac = roomChangeReservation
      ? staySegments.some(s => s.type === 'Yamaç Ev')
      : rooms.some(room => room.type === 'Yamaç Ev');
    if (hasYamac) {
      setMealPlan('Sadece Oda');
    }
  }, [rooms, staySegments, roomChangeReservation]);

  const handleRoomTypeChange = (index, value) => {
    const newRooms = [...rooms];
    newRooms[index] = { type: value };
    setRooms(newRooms);
  };

  const updateSegment = (index, field, value) => {
    setStaySegments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addStaySegment = () => {
    setStaySegments((prev) => [...prev, { type: 'İskaroz Taş Oda', nights: '', price: '' }]);
  };

  const removeLastStaySegment = () => {
    setStaySegments((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
  };

  // Toplam fiyatı hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    if (roomChangeReservation) {
      let total = 0;
      for (const seg of staySegments) {
        const n = parseInt(seg.nights, 10);
        if (Number.isNaN(n) || n < 1) continue;
        const r = getEffectiveSegmentRate(seg, nightlyRate);
        if (Number.isNaN(r)) return 0;
        total += n * r;
      }
      return total;
    }
    const rate = parseInt(nightlyRate, 10);
    if (!nightlyRate || Number.isNaN(rate)) return 0;
    if (nights) {
      return parseInt(nights, 10) * rate * rooms.length;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const totalPrice = calculateTotalPrice();
    const depositAmount = totalPrice;

    if (roomChangeReservation) {
      if (staySegments.length < 2) {
        alert('Oda değişimli rezervasyonda en az iki konaklama dilimi gereklidir.');
        return;
      }
      const invalid = staySegments.some((seg) => {
        const n = parseInt(seg.nights, 10);
        return Number.isNaN(n) || n < 1;
      });
      if (invalid) {
        alert('Her dilim için gece sayısını sayı olarak ve en az 1 olacak şekilde girin.');
        return;
      }
      for (const seg of staySegments) {
        const r = getEffectiveSegmentRate(seg, nightlyRate);
        if (Number.isNaN(r) || r < 1) {
          alert('Her dilim için gecelik fiyat girin veya alttaki varsayılan gecelik fiyatı doldurun.');
          return;
        }
      }
    }
  
    const guestBlockLines = [
      `- ${adults} Yetişkin`,
      ...(children !== '' && parseInt(children, 10) > 0 ? [`- ${children} Çocuk`] : []),
      `- ${mealPlan}`,
    ].join('\n');

    const firstRoomType = roomChangeReservation ? staySegments[0].type : rooms[0].type;
    const bankDetails = firstRoomType === 'Yamaç Ev'
      ? `\n\nHESAP ADI:\nSERKAN SOYTOK - MURAT CENNET\n\nİBAN:\nTR29 0006 4000 0013 6600 3265 59\n\nGönderim sonrasında dekontunuzu rica ederiz`
      : `\n\nHESAP ADI:\nZorlu yavuz aydeniz bizimev\n\nİBAN:\nTR86 0006 4000 0013 6600 3774 28\n\nİş Bankası Datça şubesi\n\nGönderim sonrasında dekontunuzu rica ederiz`;

    if (roomChangeReservation) {
      const hasYamacEv = staySegments.some((s) => s.type === 'Yamaç Ev');

      let cursor = checkInDate;
      const segmentChunks = [];

      staySegments.forEach((seg, idx) => {
        const nt = parseInt(seg.nights, 10);
        const endDate = addNightsToDateString(cursor, String(nt));
        const isFirst = idx === 0;
        const isLast = idx === staySegments.length - 1;
        const lines = [];

        lines.push(`- ${seg.type}`);
        if (seg.type !== 'Yamaç Ev') {
          lines.push(`📸 ${getRoomPhotoUrl(seg.type)}`);
        }
        if (isFirst && !hasYamacEv) {
          lines.push('🚁 Drone görüntümüz:');
          lines.push('https://i.hizliresim.com/mklcp30.jpeg');
          lines.push('');
        }
        lines.push(`- ${formatDate(cursor)} ${getDayOfWeek(cursor)} Giriş`);
        if (isFirst) {
          lines.push('(Check-In: 14.00)');
        }
        lines.push(`- ${formatDate(endDate)} ${getDayOfWeek(endDate)} Çıkış`);
        if (isLast) {
          lines.push('(Check-Out: 11.30)');
        }
        lines.push(`- ${nt} Gece`);

        segmentChunks.push(lines.join('\n'));
        cursor = endDate;
      });

      const priceLines = staySegments
        .map((seg) => {
          const nt = parseInt(seg.nights, 10);
          const r = getEffectiveSegmentRate(seg, nightlyRate);
          const subtotal = nt * r;
          return `- ${seg.type}: ${nt} gece × ${formatTRY(r)} = ${formatTRY(subtotal)}`;
        })
        .join('\n');

      const body = [
        `- ${capitalizeFullName(name)}`,
        '',
        segmentChunks.join('\n\n'),
        '',
        guestBlockLines,
        '',
        priceLines,
        '',
        `- Toplam Fiyat: ${formatTRY(totalPrice)}`,
        `- Ön Ödeme: ${formatTRY(depositAmount)}${bankDetails}`,
      ].join('\n');

      setReservationSummary(body.trim());
      return;
    }

    const formattedCheckInDate = formatDateWithDay(checkInDate, true);
    const formattedCheckOutDate = formatDateWithDay(checkOutDate, false);

    const roomsSummary = rooms.map(room => roomTypeToSummaryBlock(room.type)).join('\n\n');

    const hasYamacEv = rooms.some(room => room.type === 'Yamaç Ev');
    const nightsForSummary = `${nights} Gece`;

    const droneBlock = hasYamacEv
      ? ''
      : `🚁 Drone görüntümüz:
https://i.hizliresim.com/mklcp30.jpeg

`;

    let summary = `
- ${capitalizeFullName(name)}
- ${roomsSummary}
${droneBlock}- ${formattedCheckInDate}
- ${formattedCheckOutDate}
- ${nightsForSummary}
${guestBlockLines}

- Toplam Fiyat: ${formatTRY(totalPrice)}
- Ön Ödeme: ${formatTRY(depositAmount)}${bankDetails}



`.trim();

    setReservationSummary(summary);
  };

  const allSegmentsHaveOwnPrice =
    roomChangeReservation &&
    staySegments.length > 0 &&
    staySegments.every((seg) => {
      const p = parseInt(seg.price, 10);
      return !Number.isNaN(p) && p > 0;
    });

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
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="roomChangeReservation"
                checked={roomChangeReservation}
                onChange={(e) => setRoomChangeReservation(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="roomChangeReservation">
                Oda değişimli rezervasyon — işaretlemek için tıklayın
              </label>
            </div>

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

            {!roomChangeReservation && (
              <>
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
                        {ROOM_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </>
            )}

            {roomChangeReservation && (
              <div className="mb-3 p-2 border rounded bg-light">
                <div className="small text-muted mb-2">
                  Her dilim: oda, gece ve bu oda için gecelik fiyat (farklıysa). Dilimlik fiyat boşsa alttaki varsayılan gecelik kullanılır. İlk dilim, tarih seçimindeki girişle başlar.
                </div>
                {staySegments.map((seg, index) => (
                  <div key={index} className="row g-2 mb-3 align-items-end">
                    <div className="col-12 col-md-4">
                      <label className="form-label small mb-1">{index + 1}. dilim — Oda</label>
                      <select
                        className="form-select form-select-md"
                        value={seg.type}
                        onChange={(e) => updateSegment(index, 'type', e.target.value)}
                      >
                        {ROOM_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small mb-1">Gece</label>
                      <input
                        type="text"
                        className="form-control form-control-md"
                        placeholder="Örn: 2"
                        value={seg.nights}
                        onChange={(e) => updateSegment(index, 'nights', e.target.value)}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small mb-1">Gecelik (₺)</label>
                      <input
                        type="number"
                        className="form-control form-control-md"
                        placeholder="Boşsa alttaki varsayılan"
                        min="0"
                        value={seg.price}
                        onChange={(e) => updateSegment(index, 'price', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addStaySegment}>Dilim ekle</button>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={removeLastStaySegment} disabled={staySegments.length <= 2}>Son dilimi kaldır</button>
                </div>
              </div>
            )}

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

            {!roomChangeReservation ? (
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
            ) : (
              <div className="mb-2">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-moon-stars-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-md bg-light"
                    readOnly
                    value={
                      staySegments.reduce((sum, seg) => sum + (parseInt(seg.nights, 10) || 0), 0) > 0
                        ? `Toplam gece (dilimlerden): ${staySegments.reduce((sum, seg) => sum + (parseInt(seg.nights, 10) || 0), 0)}`
                        : ''
                    }
                    placeholder="Toplam gece dilimlerden hesaplanır"
                  />
                </div>
              </div>
            )}

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
                  disabled={
                    rooms.some(room => room.type === 'Yamaç Ev')
                    || (roomChangeReservation && staySegments.some((s) => s.type === 'Yamaç Ev'))
                  }
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
                  className={`form-control form-control-md${allSegmentsHaveOwnPrice ? ' bg-light' : ''}`}
                  placeholder={roomChangeReservation ? 'Varsayılan gecelik (dilim boşsa)' : 'Gecelik Fiyat'}
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(e.target.value)}
                  disabled={allSegmentsHaveOwnPrice}
                  required={
                    roomChangeReservation
                      ? !allSegmentsHaveOwnPrice
                      : true
                  }
                  title={allSegmentsHaveOwnPrice ? 'Tüm dilimler için gecelik girildi; varsayılan fiyat gerekmiyor.' : ''}
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
