import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [roofArea, setRoofArea] = useState<number>(
    property?.roof_area_sqm || 120
  );
  const [surfaceType, setSurfaceType] = useState<string>(
    property?.surface_type || 'concrete'
  );
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // Synchronize when authenticated property profile changes
  useEffect(() => {
    if (property?.location && !isCustom) {
      const locName = property.location.split(',')[0].trim();
      setActiveLocationName(locName);
      if (property.annual_rainfall_mm) {
        setAnnualRainfallMm(property.annual_rainfall_mm);
      }
      if (property.roof_area_sqm) {
        setRoofArea(property.roof_area_sqm);
      }
      if (property.surface_type) {
        setSurfaceType(property.surface_type);
      }
    }
  }, [property]);

  const updateLocationState = (updates: Partial<LocationState>) => {
    if (updates.activeLocationName !== undefined) {
      setActiveLocationName(updates.activeLocationName);
      setIsCustom(true);
    }
    if (updates.annualRainfallMm !== undefined) {
      setAnnualRainfallMm(updates.annualRainfallMm);
    }
    if (updates.roofArea !== undefined) {
      setRoofArea(updates.roofArea);
    }
    if (updates.surfaceType !== undefined) {
      setSurfaceType(updates.surfaceType);
    }
    if (updates.latitude !== undefined) {
      setLatitude(updates.latitude);
    }
    if (updates.longitude !== undefined) {
      setLongitude(updates.longitude);
    }
    if (updates.isCustom !== undefined) {
      setIsCustom(updates.isCustom);
    }
  };

  const resetToPropertyLocation = () => {
    const locName = property?.location ? property.location.split(',')[0].trim() : 'Karur';
    setActiveLocationName(locName);
    setAnnualRainfallMm(property?.annual_rainfall_mm || 1080);
    setRoofArea(property?.roof_area_sqm || 120);
    setSurfaceType(property?.surface_type || 'concrete');
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
