import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plus, BookOpen, Dumbbell } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/workout/new', icon: Plus, label: 'Nuova' },
  { to: '/catalog', icon: BookOpen, label: 'Catalogo' },
];

function NavItem({ to, icon: Icon, label, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact || to === '/'}
      className={({ isActive }) =>
        [
          'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-150 min-h-[44px] justify-center',
          isActive
            ? 'text-[#E8FF3A]'
            : 'text-white/40 hover:text-white/70',
        ].join(' ')
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarNavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium',
          isActive
            ? 'bg-[#E8FF3A]/10 text-[#E8FF3A] border border-[#E8FF3A]/20'
            : 'text-white/60 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
      aria-label={label}
    >
      {({ isActive }) => (
        <>
          <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  const location = useLocation();
  // Hide layout chrome on training mode for immersive experience
  const isTrainingMode = location.pathname.includes('/train');

  if (isTrainingMode) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/5 bg-[#16213E] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-[#E8FF3A] flex items-center justify-center shrink-0">
            <Dumbbell size={20} className="text-[#1A1A2E]" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold font-['Space_Grotesk'] text-white text-base block leading-tight">
              GymTracker
            </span>
            <span className="text-xs text-white/40">Le tue schede</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Navigazione principale">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-xs text-white/20 text-center">v1.0 · Solo localStorage</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#16213E] border-t border-white/10 flex items-center justify-around px-2 pb-safe"
        aria-label="Navigazione principale"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      >
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}
