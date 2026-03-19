import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation()

  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-mono font-bold text-amber-400 text-lg tracking-widest">CLOCKD</span>
          <div className="flex gap-4 text-sm">
            <Link
              to="/"
              className={`font-mono transition-colors ${pathname === '/' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Tracker
            </Link>
            <Link
              to="/export"
              className={`font-mono transition-colors ${pathname === '/export' ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Export
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-500 text-xs truncate max-w-[180px]">{user.email}</span>
          <button
            onClick={onLogout}
            className="font-mono text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-2 py-1 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
