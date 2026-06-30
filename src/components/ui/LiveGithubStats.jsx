import React, { useState, useEffect } from 'react';
import { Star, GitFork, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveGithubStats({ repoUrl }) {
  const [stats, setStats] = useState({ stars: 0, forks: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!repoUrl) {
        setLoading(false);
        setError(true);
        return;
      }
      
      try {
        // Extract owner and repo from URL
        // Example: https://github.com/facebook/react -> match[1]=facebook, match[2]=react
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) throw new Error('Invalid GitHub URL');
        
        const [, owner, repo] = match;
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setStats({ stars: data.stargazers_count, forks: data.forks_count });
        setError(false);
      } catch (err) {
        console.error('GitHub API Error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [repoUrl]);

  if (!repoUrl) return null;

  return (
    <div className="flex gap-3 text-xs font-medium">
      {loading ? (
        <span className="text-slate-500 animate-pulse">Loading stats...</span>
      ) : error ? (
        <span className="text-slate-500 flex items-center gap-1"><AlertCircle size={12}/> Offline</span>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
            <Star size={14} className="fill-yellow-500" />
            <span>{stats.stars}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <GitFork size={14} />
            <span>{stats.forks}</span>
          </motion.div>
        </>
      )}
    </div>
  );
}
