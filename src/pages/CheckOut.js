// CheckOut.js
import React from 'react';

const CheckOut = () => {
  const handleCopyClick = () => {
    const text = `BİZİM EV DATÇA 🏡

🏖 Günaydın! ☀️

-Sizleri tesisimizde ağırlamaktan büyük mutluluk duyduk. 😇

-Check-out saatimizin 11:30 olduğunu hatırlatmak isteriz.

-Minibar harcamalarınızı Resepsiyona, ekstra yiyecek ve içecek harcamalarınızı ise Restorana ödeyebilirsiniz.

-Bizi tercih ettiğiniz için teşekkür ederiz. 🍀`;
    
    navigator.clipboard.writeText(text)
      .then(() => alert('Metin kopyalandı!'))
      .catch(err => console.error('Kopyalama başarısız:', err));
  };

  return (
    <div className='container'>
            <h2>Check Out </h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button 
          onClick={handleCopyClick}
          style={{
            padding: '8px 16px',
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
      
          
      <div className="checkout-message">
        <p>BİZİM EV DATÇA 🏡 </p>

<p>🏖 Günaydın! ☀️</p>

<p>-Sizleri tesisimizde ağırlamaktan büyük mutluluk duyduk. 😇</p>

<p>-Check-out saatimizin 11:30 olduğunu hatırlatmak isteriz.</p>

<p>-Minibar harcamalarınızı Resepsiyona, ekstra yiyecek ve içecek harcamalarınızı ise Restorana ödeyebilirsiniz.</p>

<p>-Bizi tercih ettiğiniz için teşekkür ederiz. 🍀</p>
      </div>
    </div>
  );
};

export default CheckOut; // Default export