import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import Report from './pages/Report';
import ReservationConfirmation from './pages/ReservationConfirmation';
import KapiGiris from './pages/KapiGiris';

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderComponent = () => {
    switch(selectedComponent) {
      case 'checkin':
        return <CheckIn />;
      case 'checkout':
        return <CheckOut />;
      case 'report':
        return <Report />;
      case 'reservation':
        return <ReservationConfirmation />;
      case 'kapigiris':
        return <KapiGiris />;
      default:
        return null;
    }
  };

  return (
    <div className="App container text-center">
      <h1>BED Resepsiyon</h1>
      <div className="row mt-5">
        <div className="col-md-6">
          <button 
            className="btn btn-success btn-block mb-3" 
            onClick={() => setSelectedComponent('checkin')}
          >
            Check In
          </button>
          <button 
            className="btn btn-danger btn-block mb-3"
            onClick={() => setSelectedComponent('checkout')}
          >
            Check Out
          </button>
        </div>
        <div className="col-md-6">
          <button 
            className="btn btn-warning btn-block mb-3"
            onClick={() => setSelectedComponent('report')}
          >
            Rapor
          </button>
          <button 
            className="btn btn-primary btn-block mb-3"
            onClick={() => setSelectedComponent('reservation')}
          >
            Rezervasyon Onay
          </button>
        </div>
        <div className='col-md-6'>
          <button 
            className="btn btn-info btn-block mb-3"
            onClick={() => setSelectedComponent('kapigiris')}
          >
            Kapı Müşterisi
          </button>
        </div>
      </div>
      <div className="mt-4">
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
