import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('demo@aquaregen.com');
  const [password, setPassword] = useState<string>('password123');
  const [loading, setLoading] = useState<boolean>(false);
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Handled by Toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base dark:bg-surface-dark flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder rounded-3xl p-8 shadow-soft-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-aqua-600 text-white mb-4 shadow-soft cursor-pointer hover:scale-105 transition-transform"
          >
            <Droplets className="w-8 h-8 text-aqua-200" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 dark:text-white tracking-tight">
            Sign in to AquaRegen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your property's water security command center
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <button
          onClick={() => quickDemoLogin().then(() => navigate('/dashboard'))}
          className="w-full mb-6 p-3 rounded-2xl bg-gradient-to-r from-aqua-500/10 via-forest-500/10 to-navy-500/10 border border-aqua-500/30 hover:border-aqua-500 text-navy-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-aqua-500" />
          <span>Quick 1-Click Test Drive (Demo Account)</span>
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-800 to-aqua-600 hover:opacity-95 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-aqua-600 dark:text-aqua-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
