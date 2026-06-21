import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Building, TrendingUp, Users, Target, Briefcase, ChevronRight, CheckCircle, FileText, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfileSettings from './UserProfileSettings';

export default function PartnerDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const investments = [
    { id: 1, project: 'Smart Irrigation AI', amount: '$50,000', status: 'Active', roi: '+15%' },
    { id: 2, project: 'National Hackathon 2026', amount: '$10,000', status: 'Completed', roi: 'N/A' }
  ];

  const internRequests = [
    { id: 1, position: 'Junior Frontend Developer', candidates: 12, status: 'Reviewing' },
    { id: 2, position: 'Data Scientist Intern', candidates: 5, status: 'Open' }
  ];

  const tabs = [
    { id: 'overview', icon: TrendingUp, label: lang === 'ar' ? 'العائد على الاستثمار' : 'ROI & Overview' },
    { id: 'recruitment', icon: Briefcase, label: lang === 'ar' ? 'التوظيف والمتدربين' : 'Recruitment' },
    { id: 'projects', icon: Target, label: lang === 'ar' ? 'المشاريع المدعومة' : 'Funded Projects' },
    { id: 'profile', icon: Settings, label: lang === 'ar' ? 'ملف الشركة' : 'Company Profile' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen relative">
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-emerald-200 dark:border-emerald-900/30 shadow-xl">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold text-[#1e3a5f] dark:text-white">{lang === 'ar' ? 'بوابة الشريك الداعم' : 'Partner Portal'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Corporate Sponsor Tier</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    activeTab === tab.id 
                    ? 'bg-emerald-500 text-white shadow-lg translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card rounded-3xl p-6 border-t-4 border-emerald-500">
                    <p className="text-slate-500 text-sm font-bold mb-2">Total Investment</p>
                    <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">$60,000</h3>
                  </div>
                  <div className="glass-card rounded-3xl p-6 border-t-4 border-blue-500">
                    <p className="text-slate-500 text-sm font-bold mb-2">Projects Supported</p>
                    <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">2</h3>
                  </div>
                  <div className="glass-card rounded-3xl p-6 border-t-4 border-purple-500">
                    <p className="text-slate-500 text-sm font-bold mb-2">Talents Hired</p>
                    <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">4</h3>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2 mb-6"><Target className="text-emerald-500"/> {lang==='ar'?'تقرير المشاريع المدعومة':'Funded Projects ROI'}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                          <th className="p-3 font-bold">Project</th>
                          <th className="p-3 font-bold">Amount</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold">ROI / Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {investments.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-3 font-bold text-[#1e3a5f] dark:text-white">{inv.project}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-300 font-mono">{inv.amount}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${inv.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{inv.status}</span>
                            </td>
                            <td className="p-3 font-bold text-emerald-500">{inv.roi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recruitment' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2"><Briefcase className="text-blue-500"/> {lang==='ar'?'طلبات التوظيف والتدريب':'Recruitment & Internships'}</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors">Post New Offer</button>
                </div>
                <div className="space-y-4">
                  {internRequests.map(req => (
                    <div key={req.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white">{req.position}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1"><Users size={14}/> {req.candidates} Candidates Applied</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">{req.status}</span>
                        <button className="text-blue-600 font-bold hover:underline text-sm">View Profiles</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileSettings currentUser={{ name: 'OCP Group', role: 'partner', email: 'contact@ocp.ma', badges: ['corporate_sponsor'], membershipId: 'GITM-PRT-001' }} />
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}