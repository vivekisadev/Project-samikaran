import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  LayoutDashboard, 
  FolderHeart, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Bell,
  Search,
  UserPlus,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  Calendar,
  Image as ImageIcon,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Newspaper,
  TrendingUp,
  X,
  Menu,
  UserCheck,
  Send,
  Eye,
  Edit3,
  FileText,
  Megaphone,
  LayoutTemplate
} from 'lucide-react';
import { convertDriveLinkToDirect } from '../utils/googleDriveParser';
import logo from '../assets/media/1.png.png';

const apiBase = '';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DECORATIVE & UI COMPONENTS ---
const GridBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(249,250,251,0.9)_100%)]" />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.2] stroke-gray-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
            x="50%"
            y="-1"
          >
            <path d="M.5 32V.5H32" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
};

const SpotlightCard = ({ children, className, title, subtitle, delay = 0 }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden group/spotlight",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.06), transparent 80%)`
          ),
        }}
      />
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const PremiumInput = ({ label, icon: Icon, type = 'text', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest transition-colors duration-200">
        {label}
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-xl bg-gray-50/50 border transition-all duration-200",
          isFocused 
            ? "border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {Icon && (
          <div className="pl-4 flex items-center justify-center text-gray-400">
            <Icon size={18} className={cn("transition-colors duration-200", isFocused && "text-indigo-500")} />
          </div>
        )}
        <input
          type={type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full bg-transparent px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-normal",
            Icon && "pl-3"
          )}
          {...props}
        />
      </div>
    </div>
  );
};

const ShinyButton = ({ 
  children, 
  className, 
  loading, 
  icon: Icon, 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyles = "relative flex items-center justify-center gap-2 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 overflow-hidden select-none px-6 py-3.5 shadow-sm active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md border border-indigo-600",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger: "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-600/10 border border-red-600",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={loading}
      {...props}
    >
      {variant !== 'secondary' && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      )}
      
      {loading ? (
        <RefreshCcw className="animate-spin" size={18} />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

const useAuth = () => {
  // DEVELOPMENT BYPASS - Always return a valid token so login is skipped
  const [token, setToken] = useState('bypass_token_for_dev');
  const login = (t) => { localStorage.setItem('admin_token', t); setToken(t); };
  const logout = () => { localStorage.removeItem('admin_token'); setToken(''); };
  return { token, login, logout };
};

// --- TOAST SYSTEM ---
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Bell className="text-blue-500" size={20} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="fixed bottom-10 right-10 z-[100] flex items-center gap-4 bg-white border border-gray-100 p-6 rounded-xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] min-w-[320px]"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        type === 'success' ? 'bg-emerald-50' : type === 'error' ? 'bg-red-50' : 'bg-blue-50'
      )}>
        {icons[type]}
      </div>
      <div className="flex-1">
        <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{type === 'error' ? 'Alert' : 'Notification'}</h4>
        <p className="text-sm font-semibold text-gray-900 tracking-tight mt-1">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors">
        <Plus className="rotate-45" size={20} />
      </button>
    </motion.div>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 mx-auto">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center leading-tight">{title}</h3>
          <p className="text-gray-500 text-sm text-center mt-3 leading-relaxed">{message}</p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={onCancel}
              className="py-3 rounded-xl bg-gray-50 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="py-3 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center"
            >
              {loading ? <RefreshCcw className="animate-spin" size={18} /> : "Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const FormModal = ({ isOpen, title, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl bg-white rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- PAGE COMPONENTS ---

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // DEVELOPMENT BYPASS
    if (email && password) {
      setTimeout(() => {
        onLogin('bypass_token_for_dev');
        navigate('/admin');
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection refused by server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <GridBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 rounded-xl bg-gray-900 flex items-center justify-center shadow-2xl mb-8"
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900">SAMIKARAN</h1>
          <p className="text-gray-400 font-semibold mt-3 uppercase tracking-[0.3em] text-[10px]">Security Control Panel</p>
        </div>
        
        <SpotlightCard className="p-12">
          <form onSubmit={submit} className="space-y-8">
            <PremiumInput 
              label="Operator Identifier"
              icon={Mail}
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              type="email" 
              placeholder="admin@samikaran.org" 
              required 
            />
            <PremiumInput 
              label="Encrypted Access Key"
              icon={ShieldCheck}
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••" 
              required 
            />
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 text-red-600 font-bold text-sm bg-red-50/50 p-5 rounded-xl border border-red-100"
                >
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <ShinyButton className="w-full py-5 text-lg" loading={loading}>
              Authorize Access
            </ShinyButton>
          </form>
          
          <div className="mt-10 pt-10 border-t border-gray-50 text-center">
            <Link to="/admin/bootstrap" className="text-xs font-semibold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
              Initialize Local Core Environment →
            </Link>
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
};

const Bootstrap = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();
  
  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch(`${apiBase}/api/admin/bootstrap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', msg: 'Core initialized successfully' });
        setTimeout(()=>navigate('/admin'), 1500);
      } else {
        setStatus({ type: 'error', msg: data.message || 'Core setup failed' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server connectivity issue' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <GridBackground />
      <SpotlightCard className="w-full max-w-lg p-12" title="System Initialization" subtitle="Create primary administrator account">
        <form onSubmit={submit} className="space-y-6 mt-8">
          <PremiumInput label="Operator Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Master Admin" required />
          <PremiumInput label="Access Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" placeholder="admin@samikaran.org" required />
          <PremiumInput label="Secure Key" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="••••••••" required />
          
          <AnimatePresence>
            {status.msg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 p-5 rounded-xl text-sm font-semibold uppercase tracking-wider",
                  status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                )}
              >
                {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>{status.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <ShinyButton className="w-full mt-4">Initialize Core</ShinyButton>
        </form>
      </SpotlightCard>
    </div>
  );
};

const AdminLayout = ({ onLogout, showToast }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Close sidebar on path change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', name: 'Projects', icon: FolderHeart },
    { path: '/admin/reports', name: 'Reporting', icon: FileText },
    { path: '/admin/announcements', name: 'Announcements', icon: Megaphone },
    { path: '/admin/site-content', name: 'Site Content', icon: LayoutTemplate },
    { path: '/admin/subscribers', name: 'Audience', icon: UserCheck },
    { path: '/admin/settings', name: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative w-full">
      <GridBackground />
      
      {/* Mobile Header */}
      <div className="md:hidden shrink-0 bg-white border-b border-gray-200 z-40 px-6 py-3 flex items-center justify-between shadow-sm">
        <Link to="/admin" className="flex items-center h-10 overflow-hidden">
          <img src={logo} alt="Samikaran Logo" className="h-28 w-auto object-contain -my-8" />
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Premium Sidebar */}
      <aside className={cn(
        "w-[280px] bg-white border-r border-gray-200 px-4 py-6 z-50 flex flex-col fixed md:sticky top-0 h-screen transition-transform duration-300 ease-in-out shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <Link to="/admin" className="px-2 mb-6 block flex items-center h-20 overflow-hidden">
          <img src={logo} alt="Samikaran Logo" className="h-44 w-auto object-contain -my-12 drop-shadow-sm transition-transform duration-300 hover:scale-105" />
        </Link>
        
        <div className="relative mb-6 px-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            placeholder="Search" 
            className="w-full pl-10 pr-12 py-2 rounded-lg bg-white border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all text-sm text-gray-900 placeholder-gray-500" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center px-1.5 h-5 rounded border border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-500">
             ⌘K
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden -mx-1 px-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200",
                  isActive ? "bg-gray-50 text-gray-900" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn("transition-colors", isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700")} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={cn("text-[15px]", isActive ? "font-medium" : "font-medium")}>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto space-y-1 pt-4">
           <Link to="#" className="group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
               <div className="flex items-center gap-3">
                   <ShieldCheck size={20} className="text-gray-500 group-hover:text-gray-700" strokeWidth={2} />
                   <span className="text-[15px] font-medium">Support</span>
               </div>
               <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[11px] font-medium">Online</span>
               </div>
           </Link>
           <Link to="/" target="_blank" className="group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
               <div className="flex items-center gap-3">
                   <ExternalLink size={20} className="text-gray-500 group-hover:text-gray-700" strokeWidth={2} />
                   <span className="text-[15px] font-medium">Open in browser</span>
               </div>
               <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-500" />
           </Link>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200">
           <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors" onClick={onLogout} title="Click to logout">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                      <span className="text-[14px] font-semibold text-gray-900 truncate">Caitlyn King</span>
                      <span className="text-[13px] text-gray-500 truncate">caitlyn@samikaran.org</span>
                  </div>
              </div>
              <LogOut size={16} className="text-gray-400 group-hover:text-red-500 shrink-0 ml-2 transition-colors" />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 relative z-10 w-full min-w-0">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8 md:gap-0"
          >
            <div>
              <p className="text-gray-400 font-semibold uppercase tracking-[0.3em] text-[10px] mb-2 md:mb-3">Management Engine v4.0</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {menuItems.find(i => i.path === location.pathname)?.name || 'DASHBOARD'}
              </h1>
            </div>
            
            <div className="flex flex-row items-center gap-4 hidden md:flex">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={20} />
                <input 
                  placeholder="Universal Search..." 
                  className="pl-14 pr-8 py-[18px] rounded-full bg-white border border-gray-100 shadow-sm focus:shadow-md focus:border-gray-200 outline-none transition-all w-full md:w-80 font-bold text-gray-900 placeholder-gray-400" 
                />
              </div>
              <button className="relative w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:scale-105 hover:shadow-md shrink-0">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-[3px] border-white"></span>
              </button>
            </div>
          </motion.div>
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard showToast={showToast} />} />
              <Route path="/projects" element={<Projects showToast={showToast} />} />
              <Route path="/reports" element={<Reports showToast={showToast} />} />
              <Route path="/announcements" element={<Announcements showToast={showToast} />} />
              <Route path="/site-content" element={<SiteContentManager showToast={showToast} />} />
              <Route path="/subscribers" element={<Subscribers showToast={showToast} />} />
              <Route path="/settings" element={<Settings showToast={showToast} />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const Dashboard = ({ showToast }) => {
  const [stats, setStats] = useState({ projects: 0, media: 0, admins: 0, subscribers: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [impact, setImpact] = useState({ studentsReached: '0', target: 85 });
  const token = localStorage.getItem('admin_token') || '';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [p, m, a, s, settings] = await Promise.all([
          fetch(`${apiBase}/api/projects`).then(r=>r.json()),
          fetch(`${apiBase}/api/media`).then(r=>r.json()),
          fetch(`${apiBase}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
          fetch(`${apiBase}/api/subscribers`, { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()),
          fetch(`${apiBase}/api/settings`).then(r=>r.json()),
        ]);

        setStats({
          projects: p.success ? p.projects.length : 0,
          media: m.success ? m.media.length : 0,
          admins: a.success ? a.admins.length : 0,
          subscribers: s.success ? s.subscribers.length : 0,
        });

        if (settings.success && settings.settings.impactStats) {
          setImpact({
            studentsReached: settings.settings.impactStats.studentsReached,
            target: 85 // Static target for now
          });
        }

        // Aggregate recent activity
        const activities = [];
        if (p.success) p.projects.slice(0, 3).forEach(item => activities.push({ type: 'PROJECT', name: item.title, time: item.createdAt, icon: FolderHeart, color: 'text-emerald-500' }));
        if (m.success) m.media.slice(0, 3).forEach(item => activities.push({ type: 'MEDIA', name: item.title, time: item.createdAt, icon: Newspaper, color: 'text-blue-500' }));
        if (s.success) s.subscribers.slice(0, 3).forEach(item => activities.push({ type: 'SUBSCRIBER', name: item.email, time: item.createdAt, icon: Mail, color: 'text-purple-500' }));
        
        setRecentActivity(activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5));
      } catch (err) {
        showToast('Failed to sync dashboard telemetry', 'error');
      }
    };
    fetchDashboardData();
  }, [token, showToast]);

  const metrics = [
    { label: 'Live Projects', value: stats.projects, icon: FolderHeart, trend: 'Operational', color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Broadcasts', value: stats.media, icon: Newspaper, trend: 'Published', color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Subscribers', value: stats.subscribers, icon: UserCheck, trend: 'Newsletter', color: 'bg-purple-500/10 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <SpotlightCard key={i} delay={i * 0.1}>
            <div className="flex items-center justify-between mb-8">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", m.color)}>
                <m.icon size={24} />
              </div>
              <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 border border-gray-200">
                {m.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{m.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{m.value}</h3>
          </SpotlightCard>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpotlightCard title="Mission Repository" subtitle="Recent global operations" delay={0.3}>
          <div className="space-y-8">
            {recentActivity.length > 0 ? recentActivity.map((act, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-6">
                  <div className={cn("w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-all", act.color)}>
                    <act.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm tracking-tight uppercase truncate max-w-[200px]">{act.name}</h4>
                    <p className="text-gray-500 font-medium text-xs mt-1">{act.type}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">
                  {new Date(act.time).toLocaleDateString()}
                </span>
              </div>
            )) : (
              <div className="py-10 text-center text-gray-300 font-semibold uppercase tracking-widest text-xs">No recent telemetry</div>
            )}
            
            <Link to="/admin/projects" className="flex items-center justify-center gap-2 py-4 mt-4 rounded-xl border border-dashed border-gray-200 text-gray-500 font-medium text-sm hover:border-gray-900 hover:text-gray-900 transition-all">
              Access Full Archives <ChevronRight size={14} />
            </Link>
          </div>
        </SpotlightCard>
        
        <SpotlightCard title="Impact Telemetry" subtitle="Real-time mission metrics" delay={0.4}>
          <div className="flex flex-col items-center justify-center h-full pb-10 space-y-8">
            <div className="relative w-48 h-48">
              <motion.div 
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-50" />
                  <motion.circle 
                    cx="96" 
                    cy="96" 
                    r="80" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray="502" 
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 502 - (502 * impact.target / 100) }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="text-gray-900" 
                  />
                </svg>
              </motion.div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{impact.target}%</span>
                <span className="text-gray-500 font-medium text-xs mt-1">Goal Reached</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 w-full pt-6">
              <div className="flex items-center justify-between p-6 rounded-xl bg-gray-50/50 border border-gray-100">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{impact.studentsReached}</div>
                  <div className="text-gray-500 font-medium text-xs mt-1">Students Reached</div>
                </div>
                <Sparkles className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {[
          { label: 'System Engine', status: 'v4.0.2-Stable', icon: Cpu, color: 'text-emerald-500' },
          { label: 'Storage Node', status: 'Memory Hybrid', icon: Layers, color: 'text-blue-500' },
          { label: 'Security Layer', status: 'JWT-Bcrypt Encrypted', icon: ShieldCheck, color: 'text-purple-500' },
        ].map((s, i) => (
          <SpotlightCard key={i} className="p-6" delay={0.5 + i * 0.1}>
            <div className="flex items-center gap-5">
              <div className={cn("w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center", s.color)}>
                <s.icon size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{s.label}</h4>
                <p className="font-semibold text-gray-900 text-sm tracking-tight mt-1">{s.status}</p>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};

const Projects = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', image:'', status:'Active' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/projects`);
      const data = await res.json();
      if (data.success) setItems(data.projects);
    } catch (err) {
      showToast('Failed to load projects', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `${apiBase}/api/projects/${editingId}` : `${apiBase}/api/projects`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Mission updated successfully' : 'New mission deployed');
        setForm({ title:'', description:'', image:'', status:'Active' }); 
        setEditingId(null);
        load(); 
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image || '',
      status: p.status || 'Active'
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title:'', description:'', image:'', status:'Active' });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/projects/${confirmDelete.id}`, { 
        method:'DELETE', 
        headers:{ Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Mission record purged');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Purge Record?" 
        message="This will permanently delete the mission record and all associated metadata. This action is irreversible." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mission Repository</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Authenticated Archive Records</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Repository..." 
              className="pl-12 pr-6 py-[18px] rounded-full bg-white border border-gray-100 shadow-sm focus:shadow-md focus:border-gray-200 outline-none transition-all w-full md:w-72 font-bold text-gray-900 placeholder-gray-400" 
            />
          </div>
          <ShinyButton 
            onClick={() => setIsFormOpen(!isFormOpen)} 
            variant={isFormOpen ? "danger" : "primary"}
            className={cn("transition-all rounded-full px-8 py-4", isFormOpen && "transform -rotate-[15deg] bg-red-50 text-red-500 border border-red-100 shadow-none hover:bg-red-100")}
          >
            {isFormOpen ? <X size={20} /> : "Initiate Mission"}
          </ShinyButton>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="overflow-hidden"
          >
            <SpotlightCard 
              title={editingId ? "Modify Mission" : "Deploy Mission"} 
              subtitle={editingId ? "Update existing operational unit" : "Register new operational unit"}
              className="max-w-4xl mx-auto border-2 border-gray-900/5 shadow-2xl"
              action={editingId && (
                <button onClick={cancelEdit} className="text-[10px] font-semibold text-red-500 uppercase tracking-widest hover:underline">
                  Abort Editing
                </button>
              )}
            >
              <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <PremiumInput label="Mission Designation" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Project Title" required />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Upload Visual Asset</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                if (file.size > 61440) return showToast('Image cannot exceed 60KB', 'error');
                                const reader = new FileReader();
                                reader.onloadend = () => setForm({...form, image: reader.result});
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-[13px] outline-none text-xs font-bold text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {form.image && <img src={form.image} alt="Preview" className="h-20 w-32 object-cover rounded-xl mt-2 border border-gray-200" />}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Operational Status</label>
                    <select 
                      value={form.status} 
                      onChange={e=>setForm({...form,status:e.target.value})} 
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-4 outline-none focus:bg-white focus:border-gray-900/20 font-semibold text-xs tracking-widest text-gray-800 transition-all uppercase"
                    >
                      <option value="Active">Active Operation</option>
                      <option value="Pending">Deployment Pending</option>
                      <option value="Completed">Mission Success</option>
                      <option value="Archive">Archived Node</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Contextual intel</label>
                  <textarea 
                    value={form.description} 
                    onChange={e=>setForm({...form,description:e.target.value})} 
                    placeholder="Brief mission details..." 
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-5 outline-none focus:bg-white focus:border-gray-900/20 focus:ring-8 focus:ring-gray-900/5 h-32 resize-none font-bold text-gray-800 transition-all" 
                    required 
                  />
                </div>
                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading} icon={editingId ? Edit3 : Plus}>
                    {editingId ? "Finalize Updates" : "Initiate Deployment"}
                  </ShinyButton>
                  {isFormOpen && (
                    <ShinyButton variant="secondary" onClick={cancelEdit}>
                      Dismiss
                    </ShinyButton>
                  )}
                </div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-10">
        <AnimatePresence>
          {filteredItems.map((p, i)=>(
            <motion.div 
              key={p._id || p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="h-60 bg-gray-50 relative overflow-hidden">
                {p.image ? (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.5 }}
                    src={p.image} 
                    className="w-full h-full object-cover" 
                    alt={p.title} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={48} /></div>
                )}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-semibold text-gray-900 uppercase tracking-[0.2em] shadow-xl">
                  {p.status}
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight line-clamp-1 uppercase">{p.title}</h3>
                <p className="text-gray-400 font-bold text-sm line-clamp-2 leading-relaxed mb-10 opacity-80">{p.description}</p>
                <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                  <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-[0.3em]">SECURE_ID: {String(p._id || p.id).slice(-6)}</span>
                  <div className="flex gap-3">
                    <button onClick={() => startEdit(p)} className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:scale-110 transition-all"><Edit3 size={20} /></button>
                    <button onClick={()=>setConfirmDelete({ open: true, id: p._id || p.id })} className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:scale-110 transition-all shadow-red-100"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-40 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border-4 border-dashed border-gray-100">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-200 mb-8">
              <FolderHeart size={48} />
            </div>
            <h4 className="text-2xl font-semibold text-gray-300 tracking-tight uppercase">No Missions Found</h4>
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-[0.2em] mt-3">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Reports = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', type:'Report', description:'', media:'', link:'', date:'', fullContent:'', stats:[] });

  const handleStatChange = (index, field, value) => {
    const newStats = [...form.stats];
    newStats[index][field] = value;
    setForm({...form, stats: newStats});
  };
  const addStat = () => setForm({...form, stats: [...(form.stats || []), { label: '', value: '' }]});
  const removeStat = (index) => setForm({...form, stats: form.stats.filter((_, i) => i !== index)});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/reports`);
      const data = await res.json();
      if (data.success) setItems(data.reports);
    } catch (err) {
      showToast('Failed to load reports', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `${apiBase}/api/reports/${editingId}` : `${apiBase}/api/reports`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Report updated successfully' : 'New report published');
        setForm({ title:'', type:'Report', description:'', media:'', link:'', date:'', fullContent:'', stats:[] }); 
        setEditingId(null);
        load(); 
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      title: p.title || '',
      type: p.type || 'Report',
      description: p.description || '',
      media: p.media || '',
      link: p.link || '',
      date: p.date || '',
      fullContent: p.fullContent || '',
      stats: p.stats || []
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title:'', type:'Report', description:'', media:'', link:'', date:'', fullContent:'', stats:[] });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/reports/${confirmDelete.id}`, { 
        method:'DELETE', 
        headers:{ Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Report record purged');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Purge Report?" 
        message="This will permanently delete the report. This action is irreversible." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Impact Reports</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Authenticated Archive Records</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Reports..." 
              className="pl-12 pr-6 py-[18px] rounded-full bg-white border border-gray-100 shadow-sm focus:shadow-md focus:border-gray-200 outline-none transition-all w-full md:w-72 font-bold text-gray-900 placeholder-gray-400" 
            />
          </div>
          <ShinyButton onClick={() => setIsFormOpen(!isFormOpen)} variant={isFormOpen ? "danger" : "primary"} className={cn("transition-all rounded-full px-8 py-4", isFormOpen && "transform -rotate-[15deg] bg-red-50 text-red-500 border border-red-100 shadow-none hover:bg-red-100")}>
            {isFormOpen ? <X size={20} /> : "Publish New"}
          </ShinyButton>
        </div>
      </div>
      <FormModal isOpen={isFormOpen} title={editingId ? "Modify Report" : "Publish Report"} onClose={cancelEdit}>
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <PremiumInput label="Report Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Upload Cover Media</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                if (file.size > 61440) return showToast('Image cannot exceed 60KB', 'error');
                                const reader = new FileReader();
                                reader.onloadend = () => setForm({...form, media: reader.result});
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-[13px] outline-none text-xs font-bold text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {form.media && <img src={form.media} alt="Preview" className="h-20 w-32 object-cover rounded-xl mt-2 border border-gray-200" />}
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <PremiumInput label="Type (e.g. Report)" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} />
                  <PremiumInput label="Date Override" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="e.g. March 15, 2024" />
                  <PremiumInput label="External Link" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="https..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Short Description (Preview)</label>
                  <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 h-24 focus:bg-white outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Full HTML Content (Detailed View)</label>
                  <textarea value={form.fullContent} onChange={e=>setForm({...form,fullContent:e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 h-48 focus:bg-white outline-none font-mono text-[10px]" placeholder="<p>Detailed content here...</p>" />
                </div>
                <div className="space-y-4 border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Impact Statistics</label>
                    <button type="button" onClick={addStat} className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">+ Add Stat</button>
                  </div>
                  {form.stats && form.stats.map((stat, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <input placeholder="Label (e.g. Pages)" value={stat.label} onChange={e=>handleStatChange(i, 'label', e.target.value)} className="flex-1 bg-gray-50 rounded-xl px-4 py-2 outline-none text-sm font-bold" />
                      <input placeholder="Value (e.g. 45)" value={stat.value} onChange={e=>handleStatChange(i, 'value', e.target.value)} className="flex-1 bg-gray-50 rounded-xl px-4 py-2 outline-none text-sm font-bold" />
                      <button type="button" onClick={()=>removeStat(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>{editingId ? "Update" : "Publish"}</ShinyButton>
                  {isFormOpen && <ShinyButton variant="secondary" onClick={cancelEdit}>Dismiss</ShinyButton>}
                </div>
              </form>
          </FormModal>
      <div className="grid sm:grid-cols-2 gap-10">
        <AnimatePresence>
          {filteredItems.map((p, i)=>(
            <motion.div key={p._id || p.id} layout className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden p-8">
                {p.media && <img src={p.media} className="w-full h-40 object-cover rounded-xl mb-6" alt="Cover" />}
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{p.description}</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => startEdit(p)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:scale-110 transition-all"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: p._id || p.id })} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:scale-110 transition-all"><Trash2 size={16} /></button>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Announcements = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', description:'', media:'' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/announcements`);
      const data = await res.json();
      if (data.success) setItems(data.announcements);
    } catch (err) {
      showToast('Failed to load announcements', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `${apiBase}/api/announcements/${editingId}` : `${apiBase}/api/announcements`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast('Announcement saved');
        setForm({ title:'', description:'', media:'' }); 
        setEditingId(null);
        load(); 
      } else showToast(data.message, 'error');
    } catch (err) { showToast('Error', 'error'); } finally { setLoading(false); }
  };

  const startEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({ title: p.title, description: p.description, media: p.media || ''});
    setIsFormOpen(true);
  };
  const cancelEdit = () => { setEditingId(null); setForm({ title:'', description:'', media:'' }); setIsFormOpen(false); };
  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/announcements/${confirmDelete.id}`, { method:'DELETE', headers:{ Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { showToast('Purged.'); setConfirmDelete({ open: false, id: null }); load(); }
    } catch (err) { showToast('Failed', 'error'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-12">
      <ConfirmModal isOpen={confirmDelete.open} title="Purge Record?" message="Confirm permanent deletion." onConfirm={remove} onCancel={() => setConfirmDelete({ open: false, id: null })} loading={loading}/>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Future Updates</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Authenticated Archive Records</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Announcements..." 
              className="pl-12 pr-6 py-[18px] rounded-full bg-white border border-gray-100 shadow-sm focus:shadow-md focus:border-gray-200 outline-none transition-all w-full md:w-72 font-bold text-gray-900 placeholder-gray-400" 
            />
          </div>
          <ShinyButton onClick={() => setIsFormOpen(!isFormOpen)} variant={isFormOpen ? "danger" : "primary"} className={cn("transition-all rounded-full px-8 py-4", isFormOpen && "transform -rotate-[15deg] bg-red-50 text-red-500 border border-red-100 shadow-none hover:bg-red-100")}>
            {isFormOpen ? <X size={20} /> : "New Broadcast"}
          </ShinyButton>
        </div>
      </div>
      <AnimatePresence>
        {isFormOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <SpotlightCard title="Create Announcement">
              <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput label="Headline" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Upload Media Cover</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 61440) return showToast('Image cannot exceed 60KB', 'error');
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, media: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-[13px] outline-none text-xs font-bold text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {form.media && <img src={form.media} alt="Preview" className="h-20 w-32 object-cover rounded-xl mt-2 border border-gray-200" />}
                </div>
                <div className="space-y-2"><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-6 h-32 focus:bg-white" placeholder="Content..."/></div>
                <div className="flex gap-4"><ShinyButton className="flex-1" loading={loading}>{editingId?"Update":"Post"}</ShinyButton></div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-6">
        {filteredItems.map(p=>(
          <div key={p._id || p.id} className="bg-white rounded-xl p-8 border border-gray-100 shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-lg">{p.description}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>startEdit(p)} className="p-3 bg-gray-100 rounded-xl"><Edit3 size={16}/></button>
              <button onClick={()=>setConfirmDelete({open:true,id:p._id || p.id})} className="p-3 bg-red-50 text-red-500 rounded-xl"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Subscribers = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/subscribers`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setItems(data.subscribers);
    } catch (err) {
      showToast('Failed to load audience repository', 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filteredItems = items.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/subscribers/${confirmDelete.id}`, { 
        method: 'DELETE', 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Subscriber entry purged');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to purge entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Revoke Subscription?" 
        message="This will remove the email from our active distribution lists. This action is irreversible." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Audience</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Authenticated Subscriber Database</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Audience..." 
              className="pl-12 pr-6 py-[18px] rounded-full bg-white border border-gray-100 shadow-sm focus:shadow-md focus:border-gray-200 outline-none transition-all w-full md:w-72 font-bold text-gray-900 placeholder-gray-400" 
            />
          </div>
          <ShinyButton icon={Send} variant="secondary" onClick={() => showToast('Broadcast system currently in maintenance mode', 'info')} className="rounded-full px-8 py-4">
            Broadcast
          </ShinyButton>
        </div>
      </div>

      <SpotlightCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-6 text-xs font-semibold text-gray-500 px-4">Email Identity</th>
                <th className="pb-6 text-xs font-semibold text-gray-500 px-4">Status</th>
                <th className="pb-6 text-xs font-semibold text-gray-500 px-4">Joined Date</th>
                <th className="pb-6 text-xs font-semibold text-gray-500 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((s) => (
                <tr key={s._id || s.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Mail size={18} />
                      </div>
                      <span className="font-bold text-gray-800">{s.email}</span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-semibold uppercase tracking-widest border border-emerald-100">
                      {s.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-xs font-bold text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button onClick={() => setConfirmDelete({ open: true, id: s._id || s.id })} className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all ml-auto">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && !loading && (
            <div className="py-20 text-center">
              <UserCheck size={48} className="text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No subscribers found</p>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};

const Settings = ({ showToast }) => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'admin' });
  const [site, setSite] = useState({ 
    address:'', 
    phone:'', 
    email:'' ,
    impactStats: {
      studentsReached: '1650+',
      institutions: '14+',
      workshops: '20+'
    }
  });
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const resAdmins = await fetch(`${apiBase}/api/admin/users`, { headers:{ Authorization: `Bearer ${token}` } });
      const dataAdmins = await resAdmins.json();
      if (dataAdmins.success) setAdmins(dataAdmins.admins);
      
      const resSettings = await fetch(`${apiBase}/api/settings`);
      const dataSettings = await resSettings.json();
      if (dataSettings.success) setSite(dataSettings.settings);
    } catch (err) {
      showToast('Failed to sync global registry', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const createAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/users`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast('New personnel authorized');
        setForm({ name:'', email:'', password:'', role:'admin' }); 
        load(); 
      } else {
        showToast(data.message || 'Authorization failed', 'error');
      }
    } catch (err) {
      showToast('Core communication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/admin/users/${confirmDelete.id}`, { 
        method:'DELETE', 
        headers:{ Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Access credentials revoked');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Revocation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/api/settings`, {
        method:'PUT',
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(site)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Global registry synchronized');
        load();
      }
    } catch (err) {
      showToast('Synchronization failed', 'error');
    }
  };

  return (
    <div className="space-y-16">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Revoke Clearance?" 
        message="This will immediately terminate the personnel's access to the core engine. This action is irreversible." 
        onConfirm={removeAdmin} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="grid lg:grid-cols-2 gap-16">
        <SpotlightCard title="Access Authorization" subtitle="Onboard new core administrators">
          <form onSubmit={createAdmin} className="space-y-8 mt-6">
            <PremiumInput label="Personnel Identity" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Operator Name" required />
            <PremiumInput label="Registry Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" placeholder="user@local" required />
            <PremiumInput label="Primary Secret" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="••••••••" required />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Clearance Level</label>
              <select 
                value={form.role} 
                onChange={e=>setForm({...form,role:e.target.value})} 
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-6 py-4 outline-none focus:bg-white focus:border-gray-900/20 font-semibold text-xs tracking-widest text-gray-800 transition-all uppercase"
              >
                <option value="admin">Operator (Level 1)</option>
                <option value="superadmin">Commander (Level 2)</option>
              </select>
            </div>
            <ShinyButton className="w-full" loading={loading} icon={UserPlus}>Authorize Personnel</ShinyButton>
          </form>
        </SpotlightCard>

        <SpotlightCard title="Authorized Personnel" subtitle="Active security clearanced accounts">
          <div className="space-y-6 max-h-[700px] overflow-auto pr-2 custom-scrollbar">
            {admins.map(a=>(
              <div key={a._id || a.id} className="flex justify-between items-center p-8 rounded-xl border border-gray-50 bg-[#fbfbfd] hover:border-gray-200 transition-all group shadow-sm hover:shadow-md">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gray-900 text-white flex items-center justify-center font-semibold text-2xl shadow-xl">
                    {a.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg tracking-tight uppercase leading-tight">{a.name}</h4>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.25em] mt-2">{a.role} • {a.email}</p>
                  </div>
                </div>
                <button onClick={()=>setConfirmDelete({ open: true, id: a._id || a.id })} className="w-14 h-14 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all hover:scale-110"><Trash2 size={22} /></button>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      <SpotlightCard title="Global Registry" subtitle="Platform-wide identity metadata">
        <form onSubmit={saveSettings} className="space-y-12 mt-10">
          <div className="grid md:grid-cols-3 gap-12">
            <PremiumInput label="Operational HQ" icon={MapPin} value={site.address||''} onChange={e=>setSite({...site,address:e.target.value})} placeholder="Street, Sector, City" />
            <PremiumInput label="Comm Hotline" icon={Phone} value={site.phone||''} onChange={e=>setSite({...site,phone:e.target.value})} placeholder="+91 00000 00000" />
            <PremiumInput label="Secure Inbox" icon={Mail} value={site.email||''} onChange={e=>setSite({...site,email:e.target.value})} type="email" placeholder="core@samikaran.org" />
          </div>

          <div className="pt-10 border-t border-gray-50">
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 tracking-tight uppercase">Public Impact Stats</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Live counters shown on landing page</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <PremiumInput label="Students Reached" value={site.impactStats.studentsReached} onChange={e=>setSite({...site, impactStats: {...site.impactStats, studentsReached: e.target.value}})} />
              <PremiumInput label="Institutions" value={site.impactStats.institutions} onChange={e=>setSite({...site, impactStats: {...site.impactStats, institutions: e.target.value}})} />
              <PremiumInput label="Workshops Conducted" value={site.impactStats.workshops} onChange={e=>setSite({...site, impactStats: {...site.impactStats, workshops: e.target.value}})} />
            </div>
          </div>

          <div className="pt-10 border-t border-gray-50 flex justify-end">
            <ShinyButton className="w-full md:w-auto px-16" icon={CheckCircle2}>Synchronize All Nodes</ShinyButton>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
};

const CarouselManager = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/media`);
      const data = await res.json();
      if (data.success) setItems(data.media);
    } catch (err) {
      showToast('Failed to load media archive', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, gallery: [] };
      const url = editingId ? `${apiBase}/api/media/${editingId}` : `${apiBase}/api/media`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Carousel Image updated' : 'Carousel Image added successfully');
        setForm({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' }); 
        setEditingId(null);
        load(); 
        setIsFormOpen(false);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id || m.id);
    setForm({
      title: m.title,
      type: 'image',
      description: m.description || '',
      mainImage: m.mainImage || m.url, // Fallback to url if mainImage missing
      gallery: [],
      link: m.link || ''
    });
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/media/${confirmDelete.id}`, { 
        method:'DELETE', 
        headers:{ Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image removed');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Remove Image?" 
        message="This will remove the image from the 3D Carousel." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Carousel Images..." 
            className="pl-12 pr-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm outline-none transition-all w-full font-medium text-gray-900" 
          />
        </div>
        <ShinyButton 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          variant={isFormOpen ? "danger" : "primary"}
          className="rounded-xl px-6 py-3"
        >
          {isFormOpen ? "Cancel" : "Add New Image"}
        </ShinyButton>
      </div>

      <FormModal isOpen={isFormOpen} title={editingId ? "Edit Image" : "Add Image"} onClose={cancelEdit}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput label="Image Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g., Workshop 2024" required />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Upload Image</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 2000000) return showToast('Image too large', 'error'); // 2MB limit
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, mainImage: reader.result, url: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800"
                  />
                  {form.mainImage && <img src={form.mainImage} alt="Preview" className="h-32 w-auto object-cover rounded-xl mt-2 border border-gray-200" />}
                </div>

                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>
                    {editingId ? "Update Image" : "Save Image"}
                  </ShinyButton>
                </div>
              </form>
          </FormModal>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((m)=>(
            <motion.div 
              key={m._id || m.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                <img 
                  src={m.mainImage || m.url} 
                  className="w-full h-full object-cover" 
                  alt={m.title} 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{m.title}</h3>
                <div className="flex gap-2 mt-auto justify-end">
                  <button onClick={() => startEdit(m)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: m._id || m.id })} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TestimonialsAdmin = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', role:'', text:'', avatar:'', is_active: true });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/testimonials`);
      const data = await res.json();
      if (data.success) setItems(data.testimonials);
    } catch (err) {
      showToast('Failed to load testimonials', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? `${apiBase}/api/testimonials/${editingId}` : `${apiBase}/api/testimonials`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Testimonial updated' : 'Testimonial added');
        setForm({ name:'', role:'', text:'', avatar:'', is_active: true }); 
        setEditingId(null);
        load(); 
        setIsFormOpen(false);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role || '',
      text: t.text,
      avatar: t.avatar || '',
      is_active: t.is_active
    });
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name:'', role:'', text:'', avatar:'', is_active: true });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/testimonials/${confirmDelete.id}`, { 
        method:'DELETE', 
        headers:{ Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial removed');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Remove Testimonial?" 
        message="Are you sure you want to delete this testimonial?" 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Testimonials..." 
            className="pl-12 pr-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm outline-none transition-all w-full font-medium text-gray-900" 
          />
        </div>
        <ShinyButton 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          variant={isFormOpen ? "danger" : "primary"}
          className="rounded-xl px-6 py-3"
        >
          {isFormOpen ? "Cancel" : "Add Testimonial"}
        </ShinyButton>
      </div>

      <FormModal isOpen={isFormOpen} title={editingId ? "Edit Testimonial" : "Add Testimonial"} onClose={cancelEdit}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <PremiumInput label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g., John Doe" required />
                  <PremiumInput label="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g., Student" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Testimonial Text</label>
                  <textarea 
                    value={form.text} 
                    onChange={e=>setForm({...form,text:e.target.value})} 
                    placeholder="Their feedback..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800 h-24 resize-none" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1">Avatar Image (Optional)</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 2000000) return showToast('Image too large', 'error'); // 2MB limit
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, avatar: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800"
                  />
                  {form.avatar && <img src={form.avatar} alt="Preview" className="h-16 w-16 object-cover rounded-full mt-2 border border-gray-200" />}
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})} className="w-4 h-4 rounded border-gray-300" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible on website)</label>
                </div>

                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>
                    {editingId ? "Update Testimonial" : "Save Testimonial"}
                  </ShinyButton>
                </div>
              </form>
          </FormModal>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((t)=>(
            <motion.div 
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xl">{t.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-4 italic flex-1">"{t.text}"</p>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {t.is_active ? 'Active' : 'Hidden'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(t)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: t.id })} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SiteContentManager = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('carousel');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('carousel')} 
          className={`pb-2 px-4 text-sm font-bold transition-all ${activeTab === 'carousel' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Carousel Photos
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')} 
          className={`pb-2 px-4 text-sm font-bold transition-all ${activeTab === 'testimonials' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Testimonials
        </button>
      </div>
      
      {activeTab === 'carousel' ? (
        <CarouselManager showToast={showToast} />
      ) : (
        <TestimonialsAdmin showToast={showToast} />
      )}
    </div>
  );
};

const AdminApp = () => {
  const auth = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (!auth.token) {
    return (
      <div className="font-sans selection:bg-gray-900 selection:text-white">
        <AnimatePresence>
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
        <Routes>
          <Route path="/bootstrap" element={<Bootstrap />} />
          <Route path="*" element={<Login onLogin={auth.login} />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="font-sans selection:bg-gray-900 selection:text-white">
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
      <AdminLayout onLogout={auth.logout} showToast={showToast} />
    </div>
  );
};

export default AdminApp;
