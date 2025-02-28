import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';
import Report from './pages/Report';
import ReservationConfirmation from './pages/ReservationConfirmation';
import KapiGiris from './pages/KapiGiris';

function App() {
  return (
    <Router>
      <div className="App container text-center">
        <h1>BED Resepsiyon</h1>
        <div className="row mt-5">
          <div className="col-md-6">
            <Link to="/checkin">
              <button className="btn btn-success btn-block mb-3">Check In</button>
            </Link>
            <Link to="/checkout">
              <button className="btn btn-danger btn-block mb-3">Check Out</button>
            </Link>
          </div>
          <div className="col-md-6">
            <Link to="/report">
              <button className="btn btn-warning btn-block mb-3">Rapor</button>
            </Link>
            <Link to="/reservation">
              <button className="btn btn-primary btn-block mb-3">Rezervasyon Onay</button>
            </Link>
          </div>
          <div className='col-md-6'>
          <Link to="/kapigiris">
              <button className="btn btn-info btn-block mb-3">Kapı Müşterisi</button>
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/report" element={<Report />} />
          <Route path="/reservation" element={<ReservationConfirmation />} />
          <Route path="/kapigiris" element={<KapiGiris />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
