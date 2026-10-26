import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface LocationState {
  activeLocationName: string;
  annualRainfallMm: number;
  roofArea: number;
  surfaceType: string;
  latitude?: number;
  longitude?: number;
  isCustom: boolean;
}

interface LocationContextType extends LocationState {
  setActiveLocationName: (name: string) => void;
  setAnnualRainfallMm: (mm: number) => void;
  setRoofArea: (sqm: number) => void;
  setSurfaceType: (surface: string) => void;
  updateLocationState: (updates: Partial<LocationState>) => void;
  resetToPropertyLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { property } = useAuth();
  const hasInitialized = useRef<boolean>(false);

  const getInitialLocation = () => {
    if (property?.location) {
      return property.location.split(',')[0].trim();
    }
    return 'Karur';
  };

  const [activeLocationName, setActiveLocationName] = useState<string>(getInitialLocation);
  const [annualRainfallMm, setAnnualRainfallMm] = useState<number>(
    property?.annual_rainfall_mm || 1080
  );
  const [roofArea, setRoofAreaState] = useState<number>(
    property?.roof_area_sqm || 120
  );
  const [surfaceType, setSurfaceTypeState] = useState<string>(
    property?.surface_type || 'concrete'
  );
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Synchronize ONLY ONCE when authenticated property profile loads
  useEffect(() => {
    if (property?.location && !hasInitialized.current) {
      hasInitialized.current = true;
      const locName = property.location.split(',')[0].trim();
      setActiveLocationName(locName);
      if (property.annual_rainfall_mm) {
        setAnnualRainfallMm(property.annual_rainfall_mm);
      }
      if (property.roof_area_sqm) {
        setRoofAreaState(property.roof_area_sqm);
      }
      if (property.surface_type) {
        setSurfaceTypeState(property.surface_type);
      }
    }
  }, [property]);

  const updateLocationState = (updates: Partial<LocationState>) => {
    if (updates.activeLocationName !== undefined) {
      const cleanName = updates.activeLocationName.trim();
      setActiveLocationName(prev => {
        if (prev.toLowerCase() === cleanName.toLowerCase()) {
          return prev;
        }
        return cleanName;
      });
    }

    if (updates.annualRainfallMm !== undefined) {
      const rounded = Math.round(updates.annualRainfallMm * 10) / 10;
      setAnnualRainfallMm(prev => (Math.round(prev * 10) === Math.round(rounded * 10) ? prev : rounded));
    }

    if (updates.roofArea !== undefined) {
      setRoofAreaState(prev => (prev === updates.roofArea ? prev : updates.roofArea!));
    }

    if (updates.surfaceType !== undefined) {
      setSurfaceTypeState(prev => (prev === updates.surfaceType ? prev : updates.surfaceType!));
    }

    if (updates.latitude !== undefined) {
      setLatitude(prev => (prev === updates.latitude ? prev : updates.latitude));
    }

    if (updates.longitude !== undefined) {
      setLongitude(prev => (prev === updates.longitude ? prev : updates.longitude));
    }

    if (updates.isCustom !== undefined) {
      setIsCustom(updates.isCustom);
    }
  };

  const setRoofArea = (sqm: number) => {
    setRoofAreaState(prev => (prev === sqm ? prev : sqm));
  };

  const setSurfaceType = (surface: string) => {
    setSurfaceTypeState(prev => (prev === surface ? prev : surface));
  };

  const resetToPropertyLocation = () => {
    const locName = property?.location ? property.location.split(',')[0].trim() : 'Karur';
    setActiveLocationName(locName);
    setAnnualRainfallMm(property?.annual_rainfall_mm || 1080);
    setRoofAreaState(property?.roof_area_sqm || 120);
    setSurfaceTypeState(property?.surface_type || 'concrete');
    setIsCustom(false);
  };

  return (
    <LocationContext.Provider
      value={{
        activeLocationName,
        annualRainfallMm,
        roofArea,
        surfaceType,
        latitude,
        longitude,
        isCustom,
        setActiveLocationName,
        setAnnualRainfallMm,
        setRoofArea,
        setSurfaceType,
        updateLocationState,
        resetToPropertyLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
