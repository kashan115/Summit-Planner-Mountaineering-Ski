import React, { useState } from 'react';

export const OpenSourceInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'react' | 'python' | 'ollama'>('python');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const pythonCode = `import os
import google.generativeai as genai
import json

# 1. Install: pip install google-generativeai
# 2. Get Key: https://aistudio.google.com/
os.environ["API_KEY"] = "YOUR_API_KEY_HERE"
genai.configure(api_key=os.environ["API_KEY"])

def plan_trip(destination, activity, month="July"):
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    Act as a smart mountain guide. Create a detailed {activity} plan for {destination} in {month}.
    Include: Route info, Weather/Avalanche resource links (NOAA, NWAC), 
    Driving/Trailhead details, Permits, and a Smart Decision Aid (Go/No-Go criteria).
    Return ONLY valid JSON.
    """
    
    response = model.generate_content(prompt)
    print(response.text)

if __name__ == "__main__":
    plan_trip("Mount Rainier", "Mountaineering", "July")`;

  const ollamaCode = `# Run locally with Ollama (requires ollama installed)
# 1. Pull a model: ollama pull llama3
# 2. Run this curl command:

curl http://localhost:11434/api/generate -d '{
  "model": "llama3",
  "stream": false,
  "prompt": "Act as a smart mountain guide. Create a JSON plan for climbing Mount Rainier in July including decision aids, gear, and permit details."
}'`;

  const reactCode = `# Run this Web App Locally

# 1. Clone the repository
git clone https://github.com/your-username/smart-climb-ai.git

# 2. Install dependencies
npm install

# 3. Set your Gemini API Key
export API_KEY=your_api_key_here

# 4. Start the development server
npm start`;

  return (
    <div className="bg-slate-900 text-slate-300 py-16 px-4 md:px-8 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-4">Open Source & Developer Ready</h2>
          <p className="max-w-2xl mx-auto text-slate-400 mb-6">
            This project is open source under the MIT License. You can run the web app, 
            use our Python scripts for data analysis, or switch to local LLMs like Ollama for offline planning.
          </p>
          
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
            <span className="text-sm font-medium text-white">Have an idea?</span>
            <a href="mailto:features@smartclimb.ai" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-cyan-300 transition-colors">
              ✉️ Email Feature Request
            </a>
            <a href="#" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-cyan-300 transition-colors">
              🤝 Contribute Code
            </a>
          </div>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="flex border-b border-slate-800 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('python')}
              className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === 'python' ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-400' : 'hover:bg-slate-900/50'}`}
            >
              <span className="text-lg">🐍</span> Python Script
            </button>
            <button 
              onClick={() => setActiveTab('ollama')}
              className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === 'ollama' ? 'bg-slate-900 text-orange-400 border-b-2 border-orange-400' : 'hover:bg-slate-900/50'}`}
            >
              <span className="text-lg">🦙</span> Local LLM (Ollama)
            </button>
            <button 
              onClick={() => setActiveTab('react')}
              className={`px-6 py-4 font-medium text-sm transition-colors flex items-center gap-2
                ${activeTab === 'react' ? 'bg-slate-900 text-cyan-400 border-b-2 border-cyan-400' : 'hover:bg-slate-900/50'}`}
            >
              <span className="text-lg">⚛️</span> React Web App
            </button>
          </div>

          <div className="p-6 overflow-x-auto relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => copyToClipboard(
                  activeTab === 'python' ? pythonCode : 
                  activeTab === 'ollama' ? ollamaCode : reactCode
                )}
                className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-700 text-white"
              >
                Copy
              </button>
            </div>

            <pre className="font-mono text-sm leading-relaxed text-slate-300">
              <code>
                {activeTab === 'python' && pythonCode}
                {activeTab === 'ollama' && ollamaCode}
                {activeTab === 'react' && reactCode}
              </code>
            </pre>
          </div>
          
          <div className="bg-slate-900 p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>License: MIT</span>
            <a href="#" className="hover:text-blue-400">View Source on GitHub →</a>
          </div>
        </div>
      </div>
    </div>
  );
};