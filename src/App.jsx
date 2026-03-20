import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useTimeData } from './hooks/useTimeData'
import Navbar from './components/Navbar'
import TrackerPage from './pages/TrackerPage'
import ExportPage from './pages/ExportPage'

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <div className="font-mono text-6xl font-bold tracking-widest text-amber-400">CLOCKD</div>
        <p className="font-mono text-zinc-500 text-sm tracking-wide">Remote work time tracker</p>
        <button
          onClick={onLogin}
          className="mt-4 bg-amber-400 text-black font-mono font-bold text-sm px-10 py-3 rounded tracking-widest hover:bg-amber-300 active:scale-95 transition-all"
        >
          SIGN IN / SIGN UP
        </button>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-mono text-zinc-600 tracking-widest animate-pulse">LOADING...</span>
    </div>
  )
}

export default function App() {
  const { user, isLoading, login, logout } = useAuth()
  const { data, activeSession, clockIn, clockOut, addSession, updateSession, deleteSession } = useTimeData(user?.id)

  if (isLoading) return <LoadingScreen />
  if (!user) return <LoginScreen onLogin={login} />

  return (
    <BrowserRouter>
      <div className="min-h-screen text-white">
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route
            path="/"
            element={
              <TrackerPage
                data={data}
                activeSession={activeSession}
                clockIn={clockIn}
                clockOut={clockOut}
                addSession={addSession}
                updateSession={updateSession}
                deleteSession={deleteSession}
              />
            }
          />
          <Route path="/export" element={<ExportPage data={data} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
