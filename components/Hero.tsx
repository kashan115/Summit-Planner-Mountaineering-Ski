import React, { useState } from 'react';
import { ActivityType, PlanRequest } from '../types';

interface HeroProps {
  onPlanRequest: (req: PlanRequest) => void;
  isLoading: boolean;
}

const ACTIVITIES: ActivityType[] = [
  'Mountaineering', 'Alpine Climbing', 'Ski Touring', 'Hiking', 'Scrambling', 'Rock Climbing'
];

export const Hero: React.FC<HeroProps> = ({ onPlanRequest, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState<ActivityType>('Mountaineering');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onPlanRequest({ destination, activity, details });
    }
  };

  return (
    <div className="bg-slate-900 text-white pb-16 pt-10 px-4 md:px-8 shadow-xl">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
          Plan Your Next Ascent
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Comprehensive trip planning for mountaineers, skiers, and climbers. 
          Get permits, gear lists, weather analysis, and beta grounded in real-time data.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl max-w-3xl mx-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Objective / Mountain</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Mount Rainier, Disappointment Cleaver"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Activity Type</label>
              <select 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityType)}
              >
                {ACTIVITIES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Additional Context (Optional)</label>
              <textarea 
                placeholder="e.g. Planning for late June, 2-day trip, intermediate experience level."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
                ${isLoading 
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/20 active:transform active:scale-95'}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gathering Beta...
                </>
              ) : (
                <>
                  Generate Plan
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};