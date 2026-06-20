import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GitBranch, GitCommit, GitPullRequest, AlertCircle, ExternalLink, Plus } from 'lucide-react';

const ProjectsHub = () => {
  const { t, lang } = useLanguage();
  
  // Dynamic project git commit counts synced with localStorage
  const [projectStats, setProjectStats] = useState(() => {
    const saved = localStorage.getItem('gitm_project_hub_stats');
    return saved ? JSON.parse(saved) : {
      smartTraffic: { commits: 342, prs: 2, issues: 4 },
      swarmNav: { commits: 184, prs: 5, issues: 12 },
      telemetryHub: { commits: 521, prs: 1, issues: 7 },
      edgeHardware: { commits: 45, prs: 0, issues: 2 }
    };
  });

  useEffect(() => {
    localStorage.setItem('gitm_project_hub_stats', JSON.stringify(projectStats));
  }, [projectStats]);

  const handleSimulateCommit = (projId) => {
    setProjectStats(prev => ({
      ...prev,
      [projId]: {
        ...prev[projId],
        commits: prev[projId].commits + 1
      }
    }));
  };

  const projects = [
    {
      id: 'smartTraffic',
      title: t('projects.list.smartTraffic.name'),
      desc: t('projects.list.smartTraffic.desc'),
      repo: t('projects.list.smartTraffic.repo'),
      status: 'deployed',
      color: 'emerald',
    },
    {
      id: 'swarmNav',
      title: t('projects.list.swarmNav.name'),
      desc: t('projects.list.swarmNav.desc'),
      repo: t('projects.list.swarmNav.repo'),
      status: 'testing',
      color: 'cyan',
    },
    {
      id: 'telemetryHub',
      title: t('projects.list.telemetryHub.name'),
      desc: t('projects.list.telemetryHub.desc'),
      repo: t('projects.list.telemetryHub.repo'),
      status: 'development',
      color: 'indigo',
    },
    {
      id: 'edgeHardware',
      title: t('projects.list.edgeHardware.name'),
      desc: t('projects.list.edgeHardware.desc'),
      repo: t('projects.list.edgeHardware.repo'),
      status: 'idea',
      color: 'slate',
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'deployed':
        return {
          text: t('projects.status.deployed'),
          classes: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
        };
      case 'testing':
        return {
          text: t('projects.status.testing'),
          classes: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-600 dark:text-cyan-400'
        };
      case 'development':
        return {
          text: t('projects.status.development'),
          classes: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400'
        };
      default:
        return {
          text: t('projects.status.idea'),
          classes: 'bg-cyan-500/10 border-slate-500/25 text-slate-600 dark:text-slate-400'
        };
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('projects.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm md:text-base">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => {
            const badge = getStatusBadge(proj.status);
            const gitStats = projectStats[proj.id];

            return (
              <div 
                key={proj.id}
                className="p-8 rounded-2xl glass border border-cyan-300 dark:border-white/5 flex flex-col justify-between hover:scale-[1.01] hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300 shadow-md dark:shadow-2xl"
              >
                <div>
                  {/* Title & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-[#1e3a5f] dark:text-white">
                      {proj.title}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${badge.classes}`}>
                      {badge.text}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-cyber-muted text-xs md:text-sm leading-relaxed mb-6">
                    {proj.desc}
                  </p>

                  {/* GitHub Repo Link */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-slate-500 dark:text-cyber-muted mb-6 bg-cyan-100 dark:bg-black/20 p-3 rounded-lg border border-cyan-300 dark:border-white/5">
                    <GitBranch size={14} className="text-[#0d9488] dark:text-emerald-400" />
                    <span className="font-bold flex-1 text-left">{proj.repo}</span>
                    <button 
                      onClick={() => alert(`Redirecting to https://github.com/${proj.repo}`)}
                      className="text-slate-400 hover:text-white"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>

                {/* Git Statistics Dashboard Grid */}
                <div>
                  <div className="grid grid-cols-3 gap-2 border-t border-cyan-300 dark:border-white/5 pt-4 mb-4">
                    <div className="text-center p-2 rounded bg-cyan-100 dark:bg-[#e0fcfc]/5">
                      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[#2d507b] dark:text-white">
                        <GitCommit size={12} className="text-emerald-500" />
                        <span className="text-xs font-bold font-mono">{gitStats?.commits}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-cyber-muted uppercase font-bold tracking-wider">{t('projects.commitsCount')}</span>
                    </div>

                    <div className="text-center p-2 rounded bg-cyan-100 dark:bg-[#e0fcfc]/5">
                      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[#2d507b] dark:text-white">
                        <GitPullRequest size={12} className="text-cyan-500" />
                        <span className="text-xs font-bold font-mono">{gitStats?.prs}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-cyber-muted uppercase font-bold tracking-wider">{t('projects.pullRequests')}</span>
                    </div>

                    <div className="text-center p-2 rounded bg-cyan-100 dark:bg-[#e0fcfc]/5">
                      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse text-[#2d507b] dark:text-white">
                        <AlertCircle size={12} className="text-indigo-500" />
                        <span className="text-xs font-bold font-mono">{gitStats?.issues}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-cyber-muted uppercase font-bold tracking-wider">{t('projects.activeIssues')}</span>
                    </div>
                  </div>

                  {/* Simulate Code Action button */}
                  <button 
                    onClick={() => handleSimulateCommit(proj.id)}
                    className="w-full py-2.5 rounded-lg border border-cyan-400 dark:border-white/10 hover:border-[#0d9488] dark:hover:border-emerald-500/30 bg-cyan-50 dark:bg-[#e0fcfc]/5 hover:bg-[#0d9488]/10 dark:hover:bg-emerald-500/10 text-[#2d507b] dark:text-cyber-text hover:text-[#0d9488] dark:hover:text-emerald-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                  >
                    <Plus size={14} />
                    <span>{lang === 'ar' ? 'محاكاة دفع كود (Commit)' : 'Simulate Code Commit'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ProjectsHub;
