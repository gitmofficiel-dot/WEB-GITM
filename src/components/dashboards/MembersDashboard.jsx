import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Users, Loader2, Edit, Trash2, Shield, Mail, Award, CheckCircle } from 'lucide-react';

export default function MembersDashboard() {
  const { lang } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  // Status feedback
  const [actionStatus, setActionStatus] = useState('');

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setActionStatus('success');
      setTimeout(() => setActionStatus(''), 3000);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      setActionStatus('error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const roles = ['student', 'member', 'instructor', 'content_manager', 'admin'];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } })
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
          <Users className="text-blue-500" /> {lang === 'ar' ? 'إدارة الأعضاء' : 'Members Management'}
        </h3>
        {actionStatus === 'success' && <span className="text-emerald-500 font-bold flex items-center gap-2"><CheckCircle size={16}/> {lang === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully'}</span>}
      </div>

      <div className="glass-card rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" size={32}/></div>
        ) : (
          <div className="space-y-3">
            {users.map((user, i) => (
              <motion.div key={user.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow gap-3"
              >
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0 overflow-hidden">
                    {user.imageUrl ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" /> : <Users size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3a5f] dark:text-white">{user.nameLatin || user.name || user.email}</h4>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12}/> {user.email}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Shield size={12}/> {user.role || 'student'}</span>
                      {user.membershipId && <span className="text-xs text-slate-500 flex items-center gap-1"><Award size={12}/> ID: {user.membershipId}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  {editingUser === user.id ? (
                    <div className="flex gap-2 items-center">
                      <select 
                        className="p-1 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800"
                        defaultValue={user.role || 'student'}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <button onClick={() => setEditingUser(null)} className="text-slate-500 text-xs underline">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                    </div>
                  ) : (
                    <span className="px-3 py-1 text-[10px] rounded-full uppercase font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {user.role || 'student'}
                    </span>
                  )}
                  <div className="flex gap-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                    <button onClick={() => setEditingUser(user.id)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><Edit size={15}/></button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><Trash2 size={15}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
            {users.length === 0 && (
              <p className="text-center text-slate-500 font-bold py-8">{lang === 'ar' ? 'لا يوجد أعضاء' : 'No members found'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
