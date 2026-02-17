import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';

import Header from './components/Header';

function App() {
  return (
    <Router>
      <BookingProvider>
        <Header />
        <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reservar" element={<Booking />} />
            <Route path="/confirmacion" element={<Confirmation />} />
          </Routes>
        </main>
      </BookingProvider>
    </Router>
  );
}

export default App;
