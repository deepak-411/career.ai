/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { 
  FileText, 
  Play, 
  Loader2, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
  FileUp,
  Sparkles,
  Zap,
  Target,
  Download,
  Share2,
  GraduationCap,
  Shield,
  Lock,
  Info,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeSkills, generateLearningPath, generateAudioSummary } from './ai/flows';
import { COURSE_CATALOG } from './lib/course-catalog';

export default function App() {
  const [view, setView] = useState<'welcome' | 'dashboard' | 'legal'>('welcome');
  const [legalSection, setLegalSection] = useState<'privacy' | 'security' | 'terms'>('privacy');
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const apiKeyMissing = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY' || process.env.GEMINI_API_KEY === '';

  const handleProcess = async () => {
    if (!resumeText || !jobDescription) return;
    if (apiKeyMissing) {
      setError("GEMINI_API_KEY is missing. Go to Vercel Settings > Environment Variables and add GEMINI_API_KEY.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setAudioData(null);
    
    try {
      const analysis = await analyzeSkills(resumeText, jobDescription);
      if (!analysis || !analysis.gaps) throw new Error("AI could not analyze the skills. Please check your inputs.");
      
      const path = await generateLearningPath(analysis.gaps, COURSE_CATALOG);
      setResult({ analysis, path });
      
      const summaryText = `Your learning path: ${path.learningPath.map((p: any) => `${p.week}: ${p.modules.map((m: any) => m.skill).join(', ')}`).join('. ')}`;
      const audio = await generateAudioSummary(summaryText);
      if (audio) setAudioData(audio);
    } catch (err: any) {
      console.error("Processing failed", err);
      setError(err.message || "Analysis failed. This usually happens due to an invalid API Key or network issues.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (view === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full space-y-12 relative z-10"
        >
          <div className="space-y-6">
            <img 
              src="https://iisc.ac.in/wp-content/uploads/2020/08/IISc_Master_Seal.jpg" 
              alt="IISc Logo" 
              className="h-32 mx-auto drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2">
              <h2 className="text-accent font-headline font-bold tracking-[0.2em] uppercase text-sm">ArtPark CodeForge Hackathon 2026</h2>
              <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-white">
                mycareer<span className="text-accent">.ai</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light">
                The GPS for Professional Growth. Bridge your skill gaps with AI-adaptive onboarding.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center gap-3 group"
            >
              Launch Engine
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => { setView('legal'); setLegalSection('privacy'); }}
              className="h-16 px-10 rounded-2xl glass hover:bg-white/10 text-slate-300 font-headline font-bold text-lg transition-all"
            >
              Learn More
            </button>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-xs font-code uppercase tracking-widest">
              <Shield className="w-4 h-4" /> Neural Security
            </div>
            <div className="flex items-center gap-2 text-xs font-code uppercase tracking-widest">
              <Lock className="w-4 h-4" /> Privacy Engine
            </div>
            <div className="flex items-center gap-2 text-xs font-code uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Adaptive Logic
            </div>
          </div>
        </motion.div>

        <footer className="absolute bottom-8 text-slate-500 text-xs font-code tracking-widest uppercase">
          Developed by Deepak Kumar • IISc Bangalore
        </footer>
      </div>
    );
  }

  if (view === 'legal') {
    return (
      <div className="min-h-screen p-6 lg:p-12 max-w-5xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <button onClick={() => setView('welcome')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" /> Back to Home
          </button>
          <div className="font-headline font-bold text-xl">mycareer<span className="text-accent">.ai</span></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <aside className="space-y-4">
            <button 
              onClick={() => setLegalSection('privacy')}
              className={`w-full text-left p-4 rounded-xl transition-all ${legalSection === 'privacy' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-white/5 text-slate-400'}`}
            >
              Privacy Engine
            </button>
            <button 
              onClick={() => setLegalSection('security')}
              className={`w-full text-left p-4 rounded-xl transition-all ${legalSection === 'security' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-white/5 text-slate-400'}`}
            >
              Neural Security
            </button>
            <button 
              onClick={() => setLegalSection('terms')}
              className={`w-full text-left p-4 rounded-xl transition-all ${legalSection === 'terms' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:bg-white/5 text-slate-400'}`}
            >
              Terms of Service
            </button>
          </aside>

          <main className="md:col-span-3 glass-dark p-8 rounded-3xl space-y-6">
            {legalSection === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-white">Privacy Engine</h2>
                <p className="text-slate-400 leading-relaxed">
                  Our Privacy Engine ensures that your professional data is handled with the highest level of confidentiality. We use zero-retention policies for uploaded resumes and job descriptions. Your data is processed in real-time to generate your roadmap and is never used for model training without explicit consent.
                </p>
                <ul className="space-y-2 text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> No persistent storage of raw documents.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Encrypted data transmission.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> User-controlled data deletion.</li>
                </ul>
              </div>
            )}
            {legalSection === 'security' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-white">Neural Security</h2>
                <p className="text-slate-400 leading-relaxed">
                  Neural Security is our hardened AI architecture designed to prevent prompt injection and data leakage. We use multi-layered validation to ensure that the AI recommendations are safe, accurate, and aligned with professional standards.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-white mb-2">Input Sanitization</h4>
                    <p className="text-xs text-slate-500">All text inputs are scrubbed for malicious patterns before AI processing.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-white mb-2">Output Verification</h4>
                    <p className="text-xs text-slate-500">AI-generated paths are cross-referenced with verified course catalogs.</p>
                  </div>
                </div>
              </div>
            )}
            {legalSection === 'terms' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-white">Terms of Service</h2>
                <p className="text-slate-400 leading-relaxed">
                  By using mycareer.ai, you agree to our terms of service. This platform is provided as an AI-driven advisory tool for professional development. While we strive for accuracy, the generated roadmaps are recommendations and should be used as part of a broader career strategy.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-20 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <button onClick={() => setView('welcome')} className="font-headline text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="tracking-tight">mycareer<span className="text-accent">.ai</span></span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-code text-slate-500 uppercase tracking-widest hidden sm:block">Hackathon Prototype v1.0</span>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-300">DK</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                Input Sequence
              </h2>
            </div>

            <div className="glass-dark rounded-3xl p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Resume Content
                </label>
                <textarea 
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full h-48 bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-sm focus:border-accent/40 outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4" /> Job Description
                </label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="w-full h-48 bg-slate-950/40 border border-white/5 rounded-2xl p-4 text-sm focus:border-accent/40 outline-none transition-all resize-none"
                />
              </div>

              <button 
                onClick={handleProcess}
                disabled={isProcessing || !resumeText || !jobDescription}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Play className="w-5 h-5" /> Initialize Analysis</>}
              </button>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {apiKeyMissing && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] leading-relaxed">
                  <p className="font-bold mb-1 uppercase tracking-wider">Deployment Note:</p>
                  To make this work on Vercel, add <code className="bg-black/20 px-1 rounded">GEMINI_API_KEY</code> to your Environment Variables in the Vercel Dashboard.
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-8">
          {!result ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-6 glass-dark rounded-[3rem] border-dashed border-white/10">
              <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold text-slate-300">Neural Engine Ready</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">Input your professional data to generate a high-fidelity competency roadmap.</p>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-4xl font-headline font-bold text-white">Adaptive Roadmap</h2>
                  <p className="text-slate-500">Growth trajectory optimized for your target role.</p>
                </div>
                {audioData && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={playAudio}
                      className="h-12 w-12 rounded-full bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 transition-all"
                    >
                      {isPlaying ? <X className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs font-code text-accent uppercase tracking-widest">Commute Summary Ready</span>
                    <audio 
                      ref={audioRef} 
                      src={`data:audio/mp3;base64,${audioData}`} 
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-dark p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Current Inventory
                  </h4>
                  <div className="space-y-2">
                    {result.analysis.resumeSkills.slice(0, 5).map((s: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{s.name}</span>
                        <span className="text-accent font-code">L{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-dark p-6 rounded-3xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-primary" /> Competency Gaps
                  </h4>
                  <div className="space-y-2">
                    {result.analysis.gaps.slice(0, 5).map((g: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{g.skill}</span>
                        <span className="text-primary font-code">+{g.targetLevel - g.currentLevel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {result.path.learningPath.map((period: any, idx: number) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 to-transparent" />
                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                    
                    <div className="space-y-6">
                      <h3 className="text-2xl font-headline font-bold text-white">{period.week}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {period.modules.map((mod: any, mIdx: number) => (
                          <div key={mIdx} className="glass-dark p-6 rounded-2xl hover:border-accent/30 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <GraduationCap className="w-5 h-5" />
                              </div>
                              <Badge text="Target" />
                            </div>
                            <h5 className="font-bold text-lg text-white mb-2 group-hover:text-accent transition-colors">{mod.skill}</h5>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">{mod.reasoning}</p>
                            <a 
                              href={mod.learningResource} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-accent flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              Launch Curriculum <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="h-20 border-t border-white/5 bg-slate-950/50 flex items-center justify-between px-8 text-slate-500 text-[10px] font-code uppercase tracking-widest">
        <div>Developed by Deepak Kumar • IISc Bangalore</div>
        <div className="flex gap-6">
          <button onClick={() => { setView('legal'); setLegalSection('privacy'); }}>Privacy</button>
          <button onClick={() => { setView('legal'); setLegalSection('terms'); }}>Terms</button>
        </div>
      </footer>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
      {text}
    </span>
  );
}
