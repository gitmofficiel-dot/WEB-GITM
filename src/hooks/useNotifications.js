import { useState, useCallback, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const { data: notifications, subscribeToDocs, updateDocument, addDocument } = useFirestore('notifications');
  const [unreadCount, setUnreadCount] = useState(0);

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
