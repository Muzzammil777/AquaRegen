import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Layers,
  Waves,
  Droplets,
  AlertTriangle,
  Info,
  ShieldCheck,
  X,
  ExternalLink,
  Navigation,
  Home,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { MapZone } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

// Custom SVG Icons for Leaflet markers
const createCustomIcon = (status: string, isUserProperty: boolean = false) => {
  if (isUserProperty) {
    return L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #0B3558, #159BD7);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 16px rgba(21, 155, 215, 0.8), 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        ">
          🏠
        </div>
      `,
      className: 'custom-user-marker',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19],
    });
  }

  let color = '#2FA36B'; // Emerald healthy
  if (status === 'moderate') color = '#F59E0B'; // Amber
  if (status === 'critical') color = '#EF4444'; // Red

  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

// Sub-component to center map when zone or recenter is requested
const MapCenterController: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const { property } = useAuth();
  const [zones, setZones] = useState<MapZone[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number]>([12.9716, 77.5946]);
  const [locationLabel, setLocationLabel] = useState<string>('Your Location');
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Resolve real user coordinates from property
  useEffect(() => {
    const resolveUserLocation = async () => {
      const propLocation = property?.location || 'Bengaluru Urban, KA';
      setLocationLabel(propLocation.split(',')[0]);

      // Check if property has custom non-default coordinates
      const isDefaultBangaloreCoords =
        Math.abs((property?.latitude || 0) - 12.9716) < 0.001 &&
        Math.abs((property?.longitude || 0) - 77.5946) < 0.001;

      if (property?.latitude && property?.longitude && !isDefaultBangaloreCoords) {
        setUserCoords([property.latitude, property.longitude]);
        return;
      }

      // If coordinates are default or missing, geocode the actual city/town string
      try {
        const geoRes = await api.searchLocation(propLocation);
        if (geoRes.found && geoRes.location) {
          const lat = geoRes.location.latitude;
          const lon = geoRes.location.longitude;
          setUserCoords([lat, lon]);
          return;
        }
      } catch (err) {
        console.warn('Geocoding fallback:', err);
      }

      // Fallback
      setUserCoords([property?.latitude || 12.9716, property?.longitude || 77.5946]);
    };

    resolveUserLocation();
  }, [property]);

  const handleUseGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserCoords([lat, lon]);
        setLocationLabel('My GPS Location');
      },
      (err) => console.warn('GPS denied:', err),
      { timeout: 8000 }
    );
  };

  // 2. Fetch zones centered on user's real location
  const fetchZones = async (category: string, lat: number, lon: number, locName: string) => {
    try {
      setLoading(true);
      const res = await api.getMapZones(category, lat, lon, locName);
      setZones(res.zones);
      setCategories(res.categories);
      if (res.zones.length > 0) {
        setSelectedZone(res.zones[0]);
      }
    } catch (err) {
      console.warn('Map zones fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones(activeCategory, userCoords[0], userCoords[1], locationLabel);
  }, [activeCategory, userCoords, locationLabel]);

  const activeCenter: [number, number] = selectedZone
    ? [selectedZone.latitude, selectedZone.longitude]
    : userCoords;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-aqua-50 dark:bg-aqua-950 text-aqua-700 dark:text-aqua-300 text-[10px] font-extrabold border border-aqua-200 dark:border-aqua-800">
              <Compass className="w-3 h-3 text-aqua-500 animate-spin" />
              LOCATION SYNCED: {locationLabel.toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Local Water & Recharge Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time geospatial observation nodes, artificial recharge zones, and groundwater monitoring around {locationLabel}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleUseGPS}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-aqua-50 dark:bg-aqua-950/60 hover:bg-aqua-100 dark:hover:bg-aqua-900/60 text-aqua-700 dark:text-aqua-300 border border-aqua-200 dark:border-aqua-800 text-xs font-bold shadow-soft transition-all"
            title="Use device GPS location"
          >
            <MapPin className="w-3.5 h-3.5 text-aqua-500" />
            <span>Use Live GPS</span>
          </button>

          <button
            onClick={() => {
              if (zones.length > 0) {
                setSelectedZone(zones[0]);
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-soft transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-aqua-400" />
            <span>Center on My Property</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 pl-1 pr-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
              activeCategory === cat.id
                ? 'bg-navy-800 text-white border-navy-800 dark:bg-aqua-500 dark:border-aqua-500 shadow-sm'
                : 'bg-white dark:bg-surface-darkcard text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-surface-darkborder hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map + Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-8 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-3 sm:p-4 shadow-soft h-[540px] relative overflow-hidden flex flex-col">
          {loading ? (
            <LoadingSkeleton type="chart" />
          ) : (
            <div className="w-full h-full rounded-2xl overflow-hidden relative z-0">
              <MapContainer
                center={userCoords}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <MapCenterController center={activeCenter} zoom={13} />

                {/* OpenStreetMap Base Tile Layer */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Zone & Property Markers */}
                {zones.map(zone => {
                  const isUserProp = zone.id === 'zone_user_property';
                  return (
                    <Marker
                      key={zone.id}
                      position={[zone.latitude, zone.longitude]}
                      icon={createCustomIcon(zone.status, isUserProp)}
                      eventHandlers={{
                        click: () => setSelectedZone(zone),
                      }}
                    >
                      <Popup>
                        <div className="p-1 space-y-1 text-xs">
                          <p className="font-extrabold text-navy-900">{zone.name}</p>
                          <p className="text-slate-600">{zone.description}</p>
                          <p className="font-bold text-aqua-600">Recharge: {zone.recharge_potential_pct}%</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Map Legend Overlay */}
              <div className="absolute bottom-4 left-4 z-1000 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 p-3 rounded-2xl shadow-lg text-[11px] space-y-1.5 pointer-events-auto">
                <p className="font-extrabold text-navy-900 dark:text-white pb-1 border-b border-slate-200/60 dark:border-slate-800">
                  Aquifer Health Legend
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-navy-800 to-aqua-500 border border-white" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">Your Property Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Healthy Aquifer (&lt; 10m depth)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400">Moderate Drawdown (10-20m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-slate-600 dark:text-slate-400">Critical Stress (&gt; 20m depth)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Zone Detail Panel */}
        <div className="lg:col-span-4 flex flex-col">
          {selectedZone ? (
            <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 shadow-soft flex-1 flex flex-col justify-between space-y-5 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <StatusBadge
                    status={selectedZone.status}
                    label={
                      selectedZone.status === 'healthy'
                        ? 'Healthy Aquifer'
                        : selectedZone.status === 'moderate'
                        ? 'Moderate Stress'
                        : 'Critical Depletion'
                    }
                  />
                  <span className="text-[11px] font-mono text-slate-400">
                    {selectedZone.latitude.toFixed(4)}, {selectedZone.longitude.toFixed(4)}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-navy-900 dark:text-white tracking-tight leading-snug">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {selectedZone.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder">
                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">
                      Groundwater Depth
                    </span>
                    <p className="text-lg font-black text-navy-900 dark:text-white">
                      {selectedZone.groundwater_depth_m} <span className="text-xs font-normal">m</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder">
                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">
                      Recharge Potential
                    </span>
                    <p className="text-lg font-black text-aqua-600 dark:text-aqua-400">
                      {selectedZone.recharge_potential_pct}%
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder">
                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">
                      Annual Rainfall
                    </span>
                    <p className="text-sm font-bold text-navy-900 dark:text-white">
                      {selectedZone.annual_rainfall_mm} mm
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder">
                    <span className="text-[11px] text-slate-400 font-medium block mb-0.5">
                      Soil Permeability
                    </span>
                    <p className="text-sm font-bold text-navy-900 dark:text-white">
                      {selectedZone.soil_type}
                    </p>
                  </div>
                </div>

                {/* Recommended Regional Structure */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-white space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-aqua-300">
                    Recommended Regional Intervention
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    {selectedZone.recommended_structure}
                  </h4>
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-white/10 text-slate-300">
                    <span>Estimated Annual Recharge:</span>
                    <span className="font-extrabold text-emerald-300">
                      {selectedZone.estimated_recharge_litres.toLocaleString()} L/year
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps?q=${selectedZone.latitude},${selectedZone.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-surface-dark hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open in External GIS Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-aqua-500" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 shadow-soft flex-1 flex flex-col items-center justify-center text-center">
              <Info className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">Click any map pin to inspect hydrological zone metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
