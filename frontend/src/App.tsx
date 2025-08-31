import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.page';
import RegisterPage from './pages/Register.page';
import LoginPage from './pages/Login.page';
import SearchPage from './pages/Search.page';
import BookingPage from './pages/Booking.page';
import Layout from './components/ui/Layout';
import RequireAuth from './guard/RequireAuth';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <SearchPage />
              </RequireAuth>
            }
          />
          <Route
            path="/booking"
            element={
              <RequireAuth>
                <BookingPage />
              </RequireAuth>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
