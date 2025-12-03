import React, { useState } from 'react';
import { ClimbPlan, GearCategory, GearItem } from '../types';

interface PlanDashboardProps {
  plan: ClimbPlan;
}

export const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gear' | 'logistics' | 'emergency'>('overview');
  const [gearState, setGearState] = useState<GearCategory[]>(plan.gearList);

  const toggleGear = (catIndex: number, itemIndex: number) => {
    const newGear = [...gearState];
    newGear[catIndex].items[itemIndex].checked = !newGear[catIndex].items[itemIndex].checked;
    setGearState(newGear);
  };

  const calculateProgress = () => {
    let total = 0;
    let checked = 0;
    gearState.forEach(cat => {
      cat.items.forEach(item => {
        total++;
        if (item.checked) checked++;
      });
    });
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
              {plan.activity}
            </span>
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
              {plan.difficulty}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{plan.destination}</h2>
          <p className="text-slate-500 text-lg">{plan.routeInfo.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end">
           <div className="text-right text-sm text-slate-500 mb-1">Packing Progress</div>
           <div className="w-48 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }}></div>
           </div>
           <span className="text-xs text-slate-400 mt-1">{calculateProgress()}% Ready</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto gap-4 mb-8 pb-2">
        {(['overview', 'gear', 'logistics', 'emergency'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors
              ${activeTab === tab 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'}
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Route Summary</h3>
                <p className="text-slate-700 leading-relaxed mb-6">{plan.summary}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                  <StatBox label="Length" value={plan.routeInfo.length} icon="📏" />
                  <StatBox label="Elevation Gain" value={plan.routeInfo.elevationGain} icon="🏔️" />
                  <StatBox label="Seasonality" value={plan.conditions.seasonality} icon="📅" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Conditions & Weather</h3>
                <div className="space-y-4">
                   <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-blue-900 mb-1 flex items-center gap-2">
                        ☁️ Weather Forecast
                      </h4>
                      <p className="text-blue-800 text-sm">{plan.conditions.weatherSummary}</p>
                   </div>
                   <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
                        ⚠️ Avalanche & Hazards
                      </h4>
                      <p className="text-orange-800 text-sm">{plan.conditions.avalancheRisk}</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               {/* Grounding Sources / Links */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                 <h3 className="text-lg font-bold text-slate-900 mb-4">Sources & Beta</h3>
                 <ul className="space-y-3">
                   {plan.betaLinks.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium block">
                         {link.title}
                       </a>
                       {link.description && <span className="text-xs text-slate-500">{link.description}</span>}
                     </li>
                   ))}
                   {plan.groundingSources.map((source, idx) => (
                      <li key={`grounding-${idx}`}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-700 hover:underline text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Source: {source.title}
                        </a>
                      </li>
                   ))}
                 </ul>
               </div>

               <div className="bg-slate-900 text-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold mb-3">Technical Notes</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {plan.routeInfo.technicalNotes}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* Gear Tab */}
        {activeTab === 'gear' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gearState.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-slate-800">{category.categoryName}</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {category.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex} 
                      onClick={() => toggleGear(catIndex, itemIndex)}
                      className={`px-6 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${item.checked ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                        ${item.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}
                      `}>
                         {item.checked && (
                           <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                         )}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.item}
                        </div>
                        <div className={`text-xs ${item.checked ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logistics Tab */}
        {activeTab === 'logistics' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InfoCard title="Permits & Red Tape" icon="🎫" content={plan.logistics.permits} />
             <InfoCard title="Parking & Trailhead" icon="🅿️" content={plan.logistics.parking} />
             <InfoCard title="Nearest Town / Resupply" icon="🏪" content={plan.logistics.nearestTown} />
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🚗 Directions</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  Consider downloading offline maps (Google Maps, Gaia GPS, or CalTopo) before leaving service.
                </p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.destination + ' trailhead')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors"
                >
                  Open in Google Maps
                </a>
             </div>
           </div>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
           <div className="space-y-6">
             <div className="bg-red-50 border border-red-100 rounded-xl p-6">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-red-100 text-red-600 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-red-900 mb-1">Emergency Protocol</h3>
                   <p className="text-red-800 text-sm leading-relaxed max-w-2xl">
                     In case of emergency, dial 911 or the local emergency number. Cell service is not guaranteed in the backcountry. A satellite messenger (InReach/Spot) is highly recommended.
                   </p>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard title="Nearest Hospital" icon="🏥" content={plan.emergency.nearestHospital} />
                <InfoCard title="Ranger Station" icon="👮" content={plan.emergency.rangerStation} />
                <InfoCard title="Emergency Phone" icon="📞" content={plan.emergency.emergencyPhone} />
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatBox = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{label}</div>
    <div className="text-sm font-bold text-slate-900">{value}</div>
  </div>
);

const InfoCard = ({ title, icon, content }: { title: string, icon: string, content: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
      <span>{icon}</span> {title}
    </h3>
    <p className="text-slate-700 text-sm leading-relaxed">
      {content}
    </p>
  </div>
);
