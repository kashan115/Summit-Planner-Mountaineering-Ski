import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { PlanDashboard } from './components/PlanDashboard';
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
      <header className="bg-slate-900 border-b border-slate-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏔️</span>
              <span className="text-white font-bold text-xl tracking-tight">Summit Planner AI</span>
            </div>
            <a 
              href="https://mountaineers.org" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              The Mountaineers
            </a>
         </div>
      </header>

      <main className="flex-grow">
        <Hero onPlanRequest={handlePlanRequest} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-4xl mx-auto mt-8 px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
               <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {currentPlan && !isLoading && (
          <div className="animate-fade-in-up">
            <PlanDashboard plan={currentPlan} />
          </div>
        )}

        {!currentPlan && !isLoading && !error && (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">🎒</div>
                <h3 className="font-bold text-lg mb-2">Smart Packing Lists</h3>
                <p className="text-slate-500 text-sm">Get tailored gear lists based on specific route conditions and difficulty.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">🌦️</div>
                <h3 className="font-bold text-lg mb-2">Real-Time Conditions</h3>
                <p className="text-slate-500 text-sm">We search the latest avalanche reports and weather forecasts for you.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">🚑</div>
                <h3 className="font-bold text-lg mb-2">Safety First</h3>
                <p className="text-slate-500 text-sm">Automatic retrieval of nearest hospitals, ranger stations, and emergency contacts.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p className="mb-2">© {new Date().getFullYear()} Summit Planner AI. Open Source under MIT License.</p>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            Disclaimer: Mountaineering involves inherent risks. This AI-generated plan is for planning purposes only and should not replace professional instruction, official guidebooks, or current local regulations. Always check official sources before departing.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;