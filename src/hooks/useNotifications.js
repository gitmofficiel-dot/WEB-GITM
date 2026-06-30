import { useState, useCallback, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { useAuth } from '../context/AuthContext';
import { toast } from '../utils/toast';

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const { data: notifications, subscribeToDocs, updateDocument, addDocument } = useFirestore('notifications');
  const [unreadCount, setUnreadCount] = useState(0);
  const [knownIds, setKnownIds] = useState(new Set());

  useEffect(() => {
    if (!currentUser) return;
    
    // Subscribe to current user's notifications
    const unsubscribe = subscribeToDocs(
      [{ field: 'userId', operator: '==', value: currentUser.uid }],
      [{ field: 'createdAt', direction: 'desc' }]
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser, subscribeToDocs]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);

    // Trigger toast for new notifications
    if (toast && notifications.length > 0) {
      const newIds = new Set(knownIds);
      let hasNew = false;
      
      notifications.forEach(n => {
        if (!knownIds.has(n.id)) {
          newIds.add(n.id);
          hasNew = true;
          // Only toast if it's unread and we already had some knownIds (prevents toasting all on initial load)
          if (!n.read && knownIds.size > 0) {
            toast.info(n.title || 'New Notification');
          }
        }
      });
      
      if (hasNew) {
        setKnownIds(newIds);
      }
    }
  }, [notifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await updateDocument(notificationId, { read: true });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [updateDocument]);

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => updateDocument(n.id, { read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }, [notifications, updateDocument]);

  const sendNotification = useCallback(async ({ userId, title, message, type = 'system', link = null }) => {
    try {
      await addDocument({
        userId,
        title,
        message,
        type,
        link,
        read: false
      });
    } catch (err) {
      console.error('Failed to send notification:', err);
    }
  }, [addDocument]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendNotification
  };
};
