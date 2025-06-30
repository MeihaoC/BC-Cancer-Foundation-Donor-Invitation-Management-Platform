import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import EventPage from './pages/EventPage'; 
import SingleEventPage from './pages/SingleEventPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/events/:eventId" element={
        <ProtectedRoute>
          <SingleEventPage />
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute>
          <EventPage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Login />}/>
    </Routes>
  );
}

export default App;
