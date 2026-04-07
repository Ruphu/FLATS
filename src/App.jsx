import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@pages/Home';
import Profile from '@pages/Profile';
import Registration from '@pages/Registration';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/registration" element={<Registration />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
