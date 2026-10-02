const fs = require('fs');

const path = 'e:/GITM/src/context/AuthContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const bad = `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user data from Firestore to get their real role using onSnapshot for real-time updates
        try {
          const docRef = doc(db, 'users', user.uid);
          const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setCurrentUser({ ...user, ...docSnap.data() });
            } else {
              setCurrentUser({ ...user, role: 'student', badges: [] });
            }
          }, (error) => {
            console.error("Error listening to user data:", error);
            setCurrentUser({ ...user, role: 'student', badges: [] });
          });
          
          // Cleanup snapshot listener if auth state changes
          return () => unsubscribeDoc();
        } catch (error) {
          console.error("Error setting up user listener:", error);
          setCurrentUser({ ...user, role: 'student', badges: [] });
        }
      } else {
        // Fallback to local storage for demo accounts
        const saved = localStorage.getItem('gitm_user');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);`;

const good = `  useEffect(() => {
    let unsubscribeDoc = null;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ ...user, ...docSnap.data() });
          } else {
            setCurrentUser({ ...user, role: 'student', badges: [] });
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user data:", error);
          setCurrentUser({ ...user, role: 'student', badges: [] });
          setLoading(false);
        });
      } else {
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }
        const saved = localStorage.getItem('gitm_user');
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);`;

content = content.replace(bad.replace(/\n/g, '\r\n'), good.replace(/\n/g, '\r\n'));
content = content.replace(bad, good);

fs.writeFileSync(path, content, 'utf8');
console.log('done');
