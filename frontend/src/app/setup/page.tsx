'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  User, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Settings, 
  Terminal,
  Activity,
  Lock,
  Globe,
  RefreshCw,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const FINAL_API_URL = API_URL.endsWith('/v1') ? API_URL : `${API_URL}/v1`;

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // Step 0: DB Config, Step 1: Welcome/Status, Step 2: Superuser, Step 3: Site Config, Step 4: Success
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTested, setConnectionTested] = useState(false);
  
  const [formData, setFormData] = useState({
    dbConfig: {
      host: 'localhost',
      port: '5432',
      user: 'portfolio_user',
      password: '',
      dbName: 'portfolio_db'
    },
    superuser: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    siteTitle: 'LƯU ĐÌNH MÁC | System Engineer'
  });

  const checkInterval = useRef<any>(null);

  useEffect(() => {
    checkStatus();
    return () => {
      if (checkInterval.current) clearInterval(checkInterval.current);
    };
  }, []);

  const checkStatus = async () => {
    try {
      const res = await axios.get(`${FINAL_API_URL}/setup/status?t=${Date.now()}`, { timeout: 2000 });
      const currentStatus = res.data;
      setStatus(currentStatus);

      // Auto-fill DB config from existing .env settings
      if (currentStatus.database) {
        setFormData(prev => ({
          ...prev,
          dbConfig: {
            ...prev.dbConfig,
            host: currentStatus.database.host || prev.dbConfig.host,
            port: currentStatus.database.port || prev.dbConfig.port,
            user: currentStatus.database.user || prev.dbConfig.user,
            dbName: currentStatus.database.dbName || prev.dbConfig.dbName,
          }
        }));
      }

      if (currentStatus.isInitialized) {
        toast.success('System already initialized. Redirecting...');
        setTimeout(() => router.push('/'), 2000);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to check setup status:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTested(false);
    try {
      const res = await axios.post(`${FINAL_API_URL}/setup/test-connection`, formData.dbConfig);
      if (res.data.success) {
        toast.success('Connection successful!');
        setConnectionTested(true);
      } else {
        toast.error(`Connection failed: ${res.data.message}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to test connection');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveDbConfig = async () => {
    setIsRestarting(true);
    try {
      await axios.post(`${FINAL_API_URL}/setup/save-db-config`, formData.dbConfig);
      toast.success('Configuration saved. Synchronizing...');
      
      const poll = async () => {
        const result = await checkStatus();
        if (result === false) { // Success response but not initialized
          setIsRestarting(false);
          setStep(1);
          toast.success('Backend synchronized!');
        } else {
          setTimeout(poll, 2000);
        }
      };
      
      setTimeout(poll, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save configuration');
      setIsRestarting(false);
    }
  };

  const handleInitialize = async () => {
    if (formData.superuser.password !== formData.superuser.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsInitializing(true);
    try {
      await axios.post(`${FINAL_API_URL}/setup`, {
        superuser: formData.superuser,
        siteTitle: formData.siteTitle,
        dbName: formData.dbConfig.dbName
      });
      toast.success('Initialization successful!');
      setStep(4); // Success step
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initialize system');
    } finally {
      setIsInitializing(false);
    }
  };

  if (loading || isRestarting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-cyan-500">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-4">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
          >
            <RefreshCw className="w-16 h-16" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-widest uppercase">
              {isRestarting ? 'APPLYING CONFIGURATION' : 'SYNCHRONIZING CORE'}
            </h2>
            <p className="text-slate-500 text-sm animate-pulse">
              {isRestarting 
                ? 'Updating environment variables and restarting backend services. Please stand by...' 
                : 'Connecting to initialization protocol...'}
            </p>
          </div>
          {isRestarting && (
            <div className="flex gap-2 items-center text-xs text-cyan-500/50">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>HEARTBEAT POLLING ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }}>
      </div>
      
      {/* Scanning Line Effect */}
      <motion.div 
        className="absolute inset-x-0 h-[2px] bg-cyan-500/20 z-0 pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-12 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono mb-6"
          >
            <Zap className="w-4 h-4 fill-cyan-400" />
            <span>SYSTEM INSTALLATION INTERFACE v2.0</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-400 to-slate-400 mb-4"
          >
            {step === 0 ? 'Database Setup' : 'Core Config'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 font-mono text-sm uppercase tracking-widest"
          >
            Current State: [ {step === 0 ? 'Configuring Connection' : 'Initializing Data'} ]
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Status */}
          <div className="lg:col-span-1 space-y-4">
            <StatusCard 
              icon={<Globe className="w-5 h-5" />}
              label="Network Status"
              value={status ? 'ONLINE' : 'OFFLINE'}
              status={status ? 'connected' : 'error'}
              active={true}
            />
            <StatusCard 
              icon={<Database className="w-5 h-5" />}
              label="Active Database"
              value={formData.dbConfig.dbName || 'Pending'}
              status={connectionTested ? 'connected' : 'waiting'}
              active={step >= 0}
            />
            <StatusCard 
              icon={<User className="w-5 h-5" />}
              label="Admin Account"
              value={formData.superuser.username || 'Unset'}
              status={formData.superuser.username ? 'configured' : 'waiting'}
              active={step >= 2}
            />
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <motion.div 
              className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div 
                    key="step0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-cyan-400">
                        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Database Configuration</h2>
                          <p className="text-xs text-slate-500 font-mono">Connect your persistent storage layer</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-mono border ${connectionTested ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        {connectionTested ? 'VERIFIED' : 'UNVERIFIED'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        id="db-host"
                        label="HOST" 
                        value={formData.dbConfig.host} 
                        onChange={(v: string) => setFormData({...formData, dbConfig: {...formData.dbConfig, host: v}})} 
                        placeholder="localhost"
                      />
                      <InputField 
                        id="db-port"
                        label="PORT" 
                        value={formData.dbConfig.port} 
                        onChange={(v: string) => setFormData({...formData, dbConfig: {...formData.dbConfig, port: v}})} 
                        placeholder="5432"
                      />
                      <InputField 
                        id="db-user"
                        label="USERNAME" 
                        value={formData.dbConfig.user} 
                        onChange={(v: string) => setFormData({...formData, dbConfig: {...formData.dbConfig, user: v}})} 
                        placeholder="postgres"
                      />
                      <InputField 
                        id="db-password"
                        label="PASSWORD" 
                        type="password"
                        value={formData.dbConfig.password} 
                        onChange={(v: string) => setFormData({...formData, dbConfig: {...formData.dbConfig, password: v}})} 
                        placeholder="••••••••"
                      />
                      <div className="md:col-span-2">
                        <InputField 
                          id="db-name"
                          label="DATABASE NAME" 
                          value={formData.dbConfig.dbName} 
                          onChange={(v: string) => setFormData({...formData, dbConfig: {...formData.dbConfig, dbName: v}})} 
                          placeholder="portfolio_db"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800/50">
                      <button 
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500/5 transition-all disabled:opacity-50"
                      >
                        {isTestingConnection ? <Activity className="animate-spin w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                        TEST CONNECTION
                      </button>
                      <button 
                        onClick={handleSaveDbConfig}
                        disabled={!connectionTested || isTestingConnection}
                        className="flex-[1.5] flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-30 disabled:grayscale"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        SAVE & APPLY CONFIGURATION
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 text-cyan-400 mb-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                        <Terminal className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-bold">System Online</h2>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4">
                      <p className="text-slate-300 leading-relaxed">
                        Database connection verified and active. The system is now ready for core data initialization.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-slate-500">
                        <div className="flex justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                          <span>ACTIVE_DB</span>
                          <span className="text-cyan-400">{formData.dbConfig.dbName}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-slate-900/50 border border-slate-800">
                          <span>ENV_STATE</span>
                          <span className="text-cyan-400">READY</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="w-full group flex items-center justify-center gap-2 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                      BEGIN INITIALIZATION
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <Lock className="w-5 h-5 text-cyan-400" />
                      Superuser Credentials
                    </h2>
                    <div className="space-y-4">
                      <InputField 
                        id="admin-username"
                        label="USERNAME" 
                        value={formData.superuser.username} 
                        onChange={(v: string) => setFormData({...formData, superuser: {...formData.superuser, username: v}})} 
                        placeholder="e.g. admin"
                      />
                      <InputField 
                        id="admin-email"
                        label="EMAIL ADDRESS" 
                        type="email"
                        value={formData.superuser.email} 
                        onChange={(v: string) => setFormData({...formData, superuser: {...formData.superuser, email: v}})} 
                        placeholder="admin@domain.com"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField 
                          id="admin-password"
                          label="PASSWORD" 
                          type="password"
                          value={formData.superuser.password} 
                          onChange={(v: string) => setFormData({...formData, superuser: {...formData.superuser, password: v}})} 
                          placeholder="••••••••"
                        />
                        <InputField 
                          id="admin-confirm"
                          label="CONFIRM" 
                          type="password"
                          value={formData.superuser.confirmPassword} 
                          onChange={(v: string) => setFormData({...formData, superuser: {...formData.superuser, confirmPassword: v}})} 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-4 px-6 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-400 font-bold transition-all">BACK</button>
                      <button 
                        onClick={() => {
                          const { username, email, password, confirmPassword } = formData.superuser;
                          if (!username || !email || !password || !confirmPassword) {
                            toast.error('Please fill in all fields');
                            return;
                          }
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (!emailRegex.test(email)) {
                            toast.error('Invalid email format');
                            return;
                          }
                          if (password !== confirmPassword) {
                            toast.error('Passwords do not match');
                            return;
                          }
                          setStep(3);
                        }} 
                        className="flex-[2] py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
                      >
                        CONTINUE
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <Server className="w-5 h-5 text-cyan-400" />
                      Global Settings
                    </h2>
                    <InputField 
                      id="site-title"
                      label="SITE TITLE" 
                      value={formData.siteTitle} 
                      onChange={(v: string) => setFormData({...formData, siteTitle: v})} 
                      placeholder="The name of your portal"
                    />
                    <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-sm text-cyan-200 leading-relaxed italic">
                      "This identity will represent your system across all notification channels and metadata layers."
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(2)} className="flex-1 py-4 px-6 rounded-2xl border border-slate-700 hover:bg-slate-800 text-slate-400 font-bold transition-all">BACK</button>
                      <button 
                        onClick={handleInitialize} 
                        disabled={isInitializing}
                        className="flex-[2] flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50"
                      >
                        {isInitializing ? (
                          <>
                            <Activity className="animate-spin w-4 h-4" />
                            EXECUTING...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            FINALIZE PROTOCOL
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="flex justify-center">
                      <div className="p-8 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle2 className="w-20 h-20 animate-bounce" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tight">System Initialized</h2>
                      <p className="text-slate-500 font-mono uppercase text-xs tracking-widest">
                        Protocol success. Redirecting to terminal...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Indicator */}
              <div className="absolute bottom-0 left-0 h-1.5 bg-slate-800/50 w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_15px_#06b6d4]" 
                  initial={{ width: '0%' }}
                  animate={{ width: `${(step / 4) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-16 text-center space-y-4">
          <div className="flex justify-center gap-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span> 
              API_{status ? 'STABLE' : 'ERROR'}
            </span>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connectionTested ? 'bg-green-500' : 'bg-yellow-500'}`}></span> 
              DB_{connectionTested ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-600">MACLD CORE SYSTEM // VERSION 2.0.4-LTS // 2026</p>
        </footer>
      </div>
    </div>
  );
}

function StatusCard({ icon, label, value, status, active }: any) {
  const isOnline = status === 'connected';
  const isError = status === 'error';

  return (
    <motion.div 
      className={`p-4 rounded-2xl border transition-all duration-500 ${
        active 
          ? 'bg-slate-900/60 border-slate-700 shadow-xl' 
          : 'bg-slate-950/40 border-slate-900 opacity-40'
      }`}
      whileHover={active ? { y: -2, borderColor: 'rgba(6, 182, 212, 0.3)' } : {}}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${
          isOnline ? 'bg-green-500/10 text-green-400' : 
          isError ? 'bg-red-500/10 text-red-400' :
          'bg-cyan-500/10 text-cyan-400'
        }`}>
          {icon}
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className={`text-xs font-mono font-bold truncate ${
            isOnline ? 'text-green-200' : 
            isError ? 'text-red-200' :
            'text-slate-200'
          }`}>
            {value}
          </p>
        </div>
        <div className="flex-shrink-0">
          {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-slate-700" />}
        </div>
      </div>
    </motion.div>
  );
}

function InputField({ id, label, type = 'text', value, onChange, placeholder }: any) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] px-1"
      >
        {label}
      </label>
      <input 
        id={inputId}
        name={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3.5 text-slate-200 focus:outline-none focus:border-cyan-500/40 focus:bg-slate-950 transition-all font-mono text-sm placeholder:text-slate-800"
      />
    </div>
  );
}
