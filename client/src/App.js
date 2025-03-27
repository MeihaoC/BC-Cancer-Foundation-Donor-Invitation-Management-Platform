import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import EventPage from './pages/EventPage'; 
import SingleEventPage from './pages/SingleEventPage';

function App() {
  return (
    <Routes>
      <Route path="/events/:eventId" element={<SingleEventPage />} />
      <Route path="/events" element={<EventPage />} />
      <Route path="/" element={<Login />}/>
    </Routes>
  );
}

export default App;
