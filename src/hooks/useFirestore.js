import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Enhanced Firestore hook with pagination, filtering, search, and real-time support.
 */
export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const getCollectionRef = () => collection(db, collectionName);

  // Fetch documents with optional constraints and pagination
  const fetchDocs = useCallback(async ({ 
    filters = [], 
    sorts = [], 
    limitCount = 10, 
    paginate = false,
    reset = false
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      let q = query(getCollectionRef());

      // Apply where clauses
      filters.forEach(f => {
        q = query(q, where(f.field, f.operator, f.value));
      });

      // Apply orderBy clauses
      sorts.forEach(s => {
        q = query(q, orderBy(s.field, s.direction || 'asc'));
      });

      // Apply pagination limit
      q = query(q, limit(limitCount));

      // Apply startAfter if paginating and not resetting
      if (paginate && lastVisible && !reset) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }

      setData(prev => reset ? docs : [...prev, ...docs]);
      return docs;
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionName, lastVisible]);

  // Real-time listener
  const subscribeToDocs = useCallback((filters = [], sorts = [], callback) => {
    setLoading(true);
    let q = query(getCollectionRef());

    filters.forEach(f => {
      q = query(q, where(f.field, f.operator, f.value));
    });

    sorts.forEach(s => {
      q = query(q, orderBy(s.field, s.direction || 'asc'));
    });

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setLoading(false);
      if (callback) callback(docs);
    }, (err) => {
      console.error(`Error subscribing to ${collectionName}:`, err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  // Read single document
  const getDocument = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (err) {
      console.error(`Error getting doc ${id}:`, err);
      throw err;
    }
  };

  // Create
  const addDocument = async (docData) => {
    try {
      const docRef = await addDoc(getCollectionRef(), {
        ...docData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err);
      throw err;
    }
  };

  // Update
  const updateDocument = async (id, docData) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...docData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Error updating ${id}:`, err);
      throw err;
    }
  };

  // Delete
  const deleteDocument = async (id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error(`Error deleting ${id}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    hasMore,
    fetchDocs,
    subscribeToDocs,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument
  };
};
