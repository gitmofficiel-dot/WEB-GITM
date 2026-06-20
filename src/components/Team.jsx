import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Github, Linkedin, Mail, Cpu, Brain, Code } from 'lucide-react';

const Team = () => {
  const { t } = useLanguage();

  const members = t('team.members');
  
  const memberIcons = [Cpu, Brain, Code];

  return (
    <section id="team" className="py-24 relative overflow-hidden">
      {/* Background Neon Orbs */}
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-orbitron tracking-wide mb-4 uppercase">
            {t('team.title')}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-muted text-sm md:text-base">
            {t('team.subtitle')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member, idx) => {
            const MemberIcon = memberIcons[idx];
            return (
              <div 
                key={idx}
                className="group relative rounded-2xl glass hover:border-emerald-500/30 p-8 flex flex-col justify-between items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-emerald border border-white/5"
              >
                {/* Accent line on card hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div className="w-full flex flex-col items-center">
                  {/* Member Avatar / Icon */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-black/60 border-2 border-emerald-500/20 group-hover:border-emerald-400 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <MemberIcon size={40} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    {/* Glowing dot */}
                    <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-cyber-bg animate-pulse"></div>
                  </div>

                  {/* Title & Role */}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs font-bold text-cyan-400 font-orbitron tracking-wider uppercase mb-4 block">
                    {member.role}
                  </span>

                  {/* Bio */}
                  <p className="text-xs md:text-sm text-cyber-muted mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="w-full">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2.5 font-orbitron text-center">
                    {t('team.skillsLabel')}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {member.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-0.5 rounded bg-[#e0fcfc]/5 border border-white/10 text-[9px] font-mono text-cyber-muted font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social links */}
                  <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse border-t border-white/5 pt-4">
                    <a href="#github" className="text-cyber-muted hover:text-white transition-colors">
                      <Github size={16} />
                    </a>
                    <a href="#linkedin" className="text-cyber-muted hover:text-emerald-400 transition-colors">
                      <Linkedin size={16} />
                    </a>
                    <a href="#email" className="text-cyber-muted hover:text-cyan-400 transition-colors">
                      <Mail size={16} />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Team;
