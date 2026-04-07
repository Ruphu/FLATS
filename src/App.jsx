import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Register from '@pages/Register';
import { AuthProvider } from '@shared/api/auth/AuthContext';
import RequireAuth from '@shared/api/auth/RequireAuth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
              path="/profile"
            />
            <Route element={<Navigate replace to="/register" />} path="/registration" />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
