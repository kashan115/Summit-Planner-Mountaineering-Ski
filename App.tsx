import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { PlanDashboard } from './components/PlanDashboard';
import { OpenSourceInfo } from './components/OpenSourceInfo';
import { generateMountaineeringPlan } from './services/gemini';
import { ClimbPlan, PlanRequest } from './types';

function App() {
  const [currentPlan, setCurrentPlan] = useState<ClimbPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlanRequest = async (request: PlanRequest) => {
    setIsLoading(true);
    setError(null);
    setCurrentPlan(null);

    try {
      const plan = await generateMountaineeringPlan(request);
      setCurrentPlan(plan);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating your plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPlan(null)}>
              <span className="text-2xl">🏔️</span>
              <span className="text-white font-bold text-xl tracking-tight">Summit Planner AI</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://mountaineers.org" 
                target="_blank" 
                rel="noreferrer"
                className="hidden md:block text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                The Mountaineers
              </a>
            </div>
         </div>
      </header>

      <main className="flex-grow">
        {!currentPlan && (
           <Hero onPlanRequest={handlePlanRequest} isLoading={isLoading} />
        )}
        
        {error && (
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {currentPlan && !isLoading && (
          <div className="animate-fade-in-up pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button 
                onClick={() => setCurrentPlan(null)}
                className="flex items-center text-slate-500 hover:text-blue-600 font-medium mb-4 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                New Plan
              </button>
            </div>
            <PlanDashboard plan={currentPlan} />
          </div>
        )}

        {!currentPlan && !isLoading && !error && (
          <>
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">🎒</div>
                  <h3 className="font-bold text-lg mb-2">Smart Packing Lists</h3>
                  <p className="text-slate-500 text-sm">Get tailored gear lists based on specific route conditions and difficulty.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">🌦️</div>
                  <h3 className="font-bold text-lg mb-2">Real-Time Conditions</h3>
                  <p className="text-slate-500 text-sm">We search the latest avalanche reports (NWAC) and weather forecasts (NOAA) for you.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">🚗</div>
                  <h3 className="font-bold text-lg mb-2">Logistics Solved</h3>
                  <p className="text-slate-500 text-sm">Automatic retrieval of driving directions, required passes, and nearest emergency services.</p>
                </div>
              </div>
            </div>
            
            <OpenSourceInfo />
          </>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Summit Planner AI. Open Source under MIT License.</p>
          <p className="text-xs text-slate-600 max-w-2xl mx-auto">
            Disclaimer: Mountaineering involves inherent risks. This AI-generated plan is for planning purposes only and should not replace professional instruction, official guidebooks, or current local regulations. Always check official sources (NOAA, NWAC) before departing.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
