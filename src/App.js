import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import Report from './pages/Report';
import ReservationConfirmation from './pages/ReservationConfirmation';
import KapiGiris from './pages/KapiGiris';

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderComponent = () => {
    switch(selectedComponent) {
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
        <div className="col-md-4">
          <button 
            className="btn btn-warning btn-block mb-3"
            onClick={() => setSelectedComponent('report')}
          >
            Rapor
          </button>
        </div>
        <div className="col-md-4">
          <button 
            className="btn btn-primary btn-block mb-3"
            onClick={() => setSelectedComponent('reservation')}
          >
            Rezervasyon Onay
          </button>
        </div>
        <div className="col-md-4">
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
