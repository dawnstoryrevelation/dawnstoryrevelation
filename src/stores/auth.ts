import { defineStore } from 'pinia';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../main';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    authInitialized: false
  }),
  
  actions: {
    async initAuth() {
      // Only initialize auth once
      if (this.authInitialized) return;
      
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // User is signed in
            this.user = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            };
            this.isAuthenticated = true;
            
            // Get additional user data from Firestore
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                this.user = {
                  ...this.user,
                  ...userDoc.data()
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          } else {
            // User is signed out
            this.user = null;
            this.isAuthenticated = false;
          }
          
          this.isLoading = false;
          this.authInitialized = true;
          unsubscribe();
          resolve();
        });
      });
    },
    
    async register(email, password, displayName) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, { displayName });
        
        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          settings: {
            theme: 'dark',
            notifications: true
          }
        });
        
        // Update local state
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName
        };
        this.isAuthenticated = true;
        
        return user;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
    
    async login(email, password) {
      try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update last login timestamp
        await setDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
        
        // Update local state
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        this.isAuthenticated = true;
        
        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    
    async updateUserProfile(profileData) {
      try {
        if (!auth.currentUser) throw new Error('No authenticated user');
        
        // Update Firebase Auth profile
        if (profileData.displayName || profileData.photoURL) {
          await updateProfile(auth.currentUser, {
            displayName: profileData.displayName || auth.currentUser.displayName,
            photoURL: profileData.photoURL || auth.currentUser.photoURL
          });
        }
        
        // Update Firestore user document
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          ...profileData,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        // Update local state
        this.user = {
          ...this.user,
          ...profileData
        };
        
        return this.user;
      } catch (error) {
        console.error('Profile update error:', error);
        throw error;
      }
    }
  }
});