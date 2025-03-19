import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import EventPage from './pages/EventPage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<EventPage />} />
      <Route path="/login" element={<Login />}/>
    </Routes>
  );
}

export default App;
