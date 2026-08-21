import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import type { MapZone } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

// Custom SVG Icons for Leaflet markers
const createCustomIcon = (status: string) => {
  let color = '#2FA36B'; // Emerald healthy
  if (status === 'moderate') color = '#F59E0B'; // Amber
  if (status === 'critical') color = '#EF4444'; // Red

  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
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
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Sub-component to center map when zone is selected
const MapCenterController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const [zones, setZones] = useState<MapZone[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchZones = async (category: string) => {
    try {
      setLoading(true);
      const res = await api.getMapZones(category);
      setZones(res.zones);
      setCategories(res.categories);
      if (res.zones.length > 0 && !selectedZone) {
        setSelectedZone(res.zones[0]);
      }
    } catch (err) {
      console.warn('Map zones fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones(activeCategory);
  }, [activeCategory]);

  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const activeCenter: [number, number] = selectedZone
    ? [selectedZone.latitude, selectedZone.longitude]
    : defaultCenter;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Local Water & Recharge Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            GIS spatial mapping of localized aquifer depths, recharge structures, and stress zones.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-surface-darkcard border border-slate-200 dark:border-surface-darkborder rounded-xl shadow-sm self-start sm:self-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-navy-800 text-white dark:bg-aqua-500 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* Interactive Leaflet Map */}
        <div className="lg:col-span-8 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-3 shadow-soft overflow-hidden h-[540px] relative">
          {loading && zones.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <LoadingSkeleton type="chart" />
            </div>
          ) : (
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ width: '100%', height: '100%', borderRadius: '1.25rem' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapCenterController center={activeCenter} />

              {zones.map(zone => (
                <Marker
                  key={zone.id}
                  position={[zone.latitude, zone.longitude]}
                  icon={createCustomIcon(zone.status)}
                  eventHandlers={{
                    click: () => {
                      setSelectedZone(zone);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <p className="font-bold text-navy-900">{zone.name}</p>
                      <p className="text-slate-600">Depth: {zone.groundwater_depth_m}m | Potential: {zone.recharge_potential_pct}%</p>
                      <button
                        onClick={() => setSelectedZone(zone)}
                        className="mt-2 text-aqua-600 font-bold underline block"
                      >
                        View Full Details →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Map Status Legend Float */}
          <div className="absolute bottom-6 left-6 z-[400] bg-white/90 dark:bg-navy-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-surface-darkborder shadow-md text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Healthy Aquifer (&lt; 10m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Moderate Drawdown (10-20m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Critical Stress (&gt; 20m)</span>
            </div>
          </div>
        </div>

        {/* Zone Detail Panel Drawer */}
        <div className="lg:col-span-4">
          {selectedZone ? (
            <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 shadow-soft space-y-5 sticky top-24">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-surface-darkborder">
                <div>
                  <StatusBadge status={selectedZone.status} />
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mt-2">
                    {selectedZone.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {selectedZone.description}
              </p>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-surface-darkborder">
                  <span className="text-slate-400 block mb-0.5">Groundwater Depth</span>
                  <span className="text-base font-extrabold text-navy-900 dark:text-white">
                    {selectedZone.groundwater_depth_m} m
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-surface-darkborder">
                  <span className="text-slate-400 block mb-0.5">Recharge Potential</span>
                  <span className="text-base font-extrabold text-aqua-600 dark:text-aqua-400">
                    {selectedZone.recharge_potential_pct}%
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-surface-darkborder">
                  <span className="text-slate-400 block mb-0.5">Annual Rainfall</span>
                  <span className="font-bold text-navy-900 dark:text-white">
                    {selectedZone.annual_rainfall_mm} mm
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-surface-darkborder">
                  <span className="text-slate-400 block mb-0.5">Soil Permeability</span>
                  <span className="font-bold text-navy-900 dark:text-white">
                    {selectedZone.soil_type}
                  </span>
                </div>
              </div>

              {/* Recommended Structure in this Zone */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 text-white space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-aqua-300">
                  Recommended Regional Structure
                </span>
                <p className="text-base font-bold text-white">{selectedZone.recommended_structure}</p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10 text-slate-300">
                  <span>Estimated Annual Recharge:</span>
                  <span className="font-bold text-forest-300">
                    {selectedZone.estimated_recharge_litres.toLocaleString()} L/year
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-surface-darkcard border border-dashed border-slate-200 dark:border-surface-darkborder rounded-3xl p-8 text-center text-slate-400 text-xs">
              Click any map marker to view localized hydrogeological parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
