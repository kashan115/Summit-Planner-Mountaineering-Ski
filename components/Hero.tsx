import React, { useState } from 'react';
import { ActivityType, PlanRequest } from '../types';

interface HeroProps {
  onPlanRequest: (req: PlanRequest) => void;
  isLoading: boolean;
}

const ACTIVITIES: ActivityType[] = [
  'Mountaineering', 'Alpine Climbing', 'Ski Touring', 'Hiking', 'Scrambling', 'Rock Climbing'
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Hero: React.FC<HeroProps> = ({ onPlanRequest, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [activity, setActivity] = useState<ActivityType>('Mountaineering');
  const [month, setMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long' }));
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onPlanRequest({ destination, activity, month, details });
    }
  };

  return (
    <div className="bg-slate-900 text-white pb-16 pt-10 px-4 md:px-8 shadow-xl relative overflow-hidden">
      {/* Abstract background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-200 to-purple-200 bg-clip-text text-transparent">
          Smart Climb AI
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          The futuristic trip planner for modern alpinists. 
          Analyze weather, route beta, and logistics with intelligent decision support.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 shadow-2xl max-w-3xl mx-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Objective / Mountain</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Mount Rainier, Disappointment Cleaver"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Activity Type</label>
              <select 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityType)}
              >
                {ACTIVITIES.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Target Month</label>
              <select 
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Additional Context (Optional)</label>
              <textarea 
                placeholder="e.g. 2-day trip, intermediate experience level, looking for ski descent options."
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none h-20 resize-none placeholder-slate-500"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2
                ${isLoading 
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/20 active:transform active:scale-95'}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Route...
                </>
              ) : (
                <>
                  Generate Smart Plan
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