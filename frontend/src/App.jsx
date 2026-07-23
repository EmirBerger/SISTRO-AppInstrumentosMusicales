import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import Welcome from './pages/Welcome/Welcome'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import RegisterSuccess from './pages/RegisterSuccess/RegisterSuccess'
import Home from './pages/Home/Home'
import InstrumentList from './pages/InstrumentList/InstrumentList'
import InstrumentMap from './pages/InstrumentMap/InstrumentMap'
import Lesson from './pages/Lesson/Lesson'
import Songs from './pages/Songs/Songs'
import SongDetail from './pages/SongDetail/SongDetail'
import Tuner from './pages/Tuner/Tuner'
import Profile from './pages/Profile/Profile'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import AdminInstruments from './pages/AdminInstruments/AdminInstruments'
import AdminSongs from './pages/AdminSongs/AdminSongs'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas (sin Navbar) */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registro-exitoso" element={<RegisterSuccess />} />

          {/* Rutas protegidas (con Navbar) */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/inicio" element={<Home />} />
            <Route path="/instrumentos" element={<InstrumentList />} />
            <Route path="/instrumento/:id" element={<InstrumentMap />} />
            <Route path="/clase/:id" element={<Lesson />} />
            <Route path="/canciones" element={<Songs />} />
            <Route path="/cancion/:id" element={<SongDetail />} />
            <Route path="/afinador" element={<Tuner />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Rutas de administración */}
          <Route element={
            <AdminRoute>
              <AppLayout />
            </AdminRoute>
          }>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/instrumentos" element={<AdminInstruments />} />
            <Route path="/admin/canciones" element={<AdminSongs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
