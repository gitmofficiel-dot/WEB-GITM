import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, ShieldAlert } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuth } from '../../context/AuthContext';
import { useAI } from '../../hooks/useAI';
import { useLanguage } from '../../context/LanguageContext';

const CommentsSection = ({ targetId, targetType = 'news' }) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { data: comments, subscribeToDocs, addDocument, deleteDocument } = useFirestore('comments');
  const { moderateContent } = useAI();
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocs(
      [
        { field: 'targetId', operator: '==', value: targetId },
        { field: 'targetType', operator: '==', value: targetType }
      ],
      [{ field: 'createdAt', direction: 'desc' }]
    );
    return () => unsubscribe();
  }, [targetId, targetType, subscribeToDocs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // AI Moderation before posting
      const moderationResult = await moderateContent(newComment);
      
      if (!moderationResult.isApproved) {
        setError(t('commentRejected', 'Your comment was flagged for inappropriate content.'));
        setIsSubmitting(false);
        return;
      }
      
      await addDocument({
        targetId,
        targetType,
        text: newComment.trim(),
        userId: currentUser.uid,
        userName: currentUser.name || 'Anonymous',
        userRole: currentUser.role || 'member',
        userPhotoUrl: currentUser.photoURL || null
      });
      
      setNewComment('');
    } catch (err) {
      console.error(err);
      setError(t('commentError', 'Failed to post comment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm(t('confirmDelete', 'Are you sure you want to delete this comment?'))) {
      await deleteDocument(commentId);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('default', { 
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-cyan-500" />
        {t('comments', 'Comments')} ({comments.length})
      </h3>

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30 overflow-hidden flex-shrink-0">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-cyan-400 font-bold uppercase">{currentUser.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('writeComment', 'Write a comment...')}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                rows="3"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg disabled:opacity-50 hover:scale-105 transition-transform rtl:right-auto rtl:left-3"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-red-400 text-sm flex items-center gap-1 ml-14 rtl:ml-0 rtl:mr-14">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}
        </form>
      ) : (
        <div className="mb-8 p-4 bg-black/20 rounded-xl text-center border border-white/5">
          <p className="text-gray-400">{t('loginToComment', 'Please log in to join the conversation.')}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              {comment.userPhotoUrl ? (
                <img src={comment.userPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 font-bold uppercase">{comment.userName?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="bg-black/20 border border-white/5 rounded-2xl rounded-tl-none p-4 rtl:rounded-tl-2xl rtl:rounded-tr-none">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-white mr-2">{comment.userName}</span>
                    {comment.userRole === 'president' && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">Admin</span>
                    )}
                    {comment.userRole === 'teacher' && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Instructor</span>
                    )}
                  </div>
                  {(currentUser?.uid === comment.userId || currentUser?.role === 'president') && (
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{comment.text}</p>
              </div>
              <div className="mt-1 ml-2 text-xs text-gray-500 flex gap-4 rtl:ml-0 rtl:mr-2">
                <span>{formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
