import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Property } from '../types';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  property: Property | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  quickDemoLogin: () => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  updatePropertyContext: (prop: Partial<Property>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('aquaregen_token');
    if (!token) {
      setUser(null);
      setProperty(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setProperty(data.primary_property);
    } catch (err) {
      console.warn('Session expired or invalid token:', err);
      localStorage.removeItem('aquaregen_token');
      setUser(null);
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('aquaregen_token', res.access_token);
      setUser(res.user);
      const meData = await api.getMe();
      setProperty(meData.primary_property);
      success('Welcome back!', `Signed in as ${res.user.name}`);
    } catch (err: any) {
      error('Login failed', err.message || 'Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('aquaregen_token', res.access_token);
      setUser(res.user);
      const meData = await api.getMe();
      setProperty(meData.primary_property);
      success('Account created!', 'Please proceed with your water profile assessment.');
    } catch (err: any) {
      error('Registration failed', err.message || 'Could not create account.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('demo@aquaregen.com', 'password123');
    } catch (e) {
      // Fallback offline mock demo if server is offline
      localStorage.setItem('aquaregen_token', 'demo_mock_token');
      setUser({
        id: 'usr_demo_01',
        name: 'Sarah Jenkins',
        email: 'demo@aquaregen.com',
        location: 'Bengaluru Urban, KA',
        property_type: 'House',
        property_area: 180,
        onboarding_completed: true,
      });
      setProperty({
        id: 'prop_demo_01',
        user_id: 'usr_demo_01',
        name: 'Green Haven Residence',
        property_type: 'House',
        location: 'Bengaluru Urban, KA',
        roof_area_sqm: 120,
        surface_type: 'concrete',
        annual_rainfall_mm: 850,
        daily_demand_litres: 360,
        occupants: 4,
        storage_capacity_litres: 2000,
        soil_type: 'sandy_loam',
        groundwater_depth_m: 7.4,
        available_land_sqm: 45,
        has_recharge_pit: true,
      });
      success('Demo Mode Active', 'Loaded realistic climate-tech demo property.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('aquaregen_token');
    setUser(null);
    setProperty(null);
    success('Signed out', 'You have been logged out securely.');
    window.location.href = '/login';
  };

  const refreshUserData = async () => {
    await fetchCurrentUser();
  };

  const updatePropertyContext = (updated: Partial<Property>) => {
    setProperty(prev => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        property,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        quickDemoLogin,
        logout,
        refreshUserData,
        updatePropertyContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
