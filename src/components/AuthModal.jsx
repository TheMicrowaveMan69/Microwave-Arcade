import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { X, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const INTERNAL_DOMAIN = '@microwave.internal';

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateUsername = (name) => {
    // Only allow letters, numbers, and underscores, between 3-15 chars
    const regex = /^[a-zA-Z0-9_]{3,15}$/;
    return regex.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    if (!validateUsername(username)) {
      setError('Username must be 3-15 characters and contain only letters, numbers, or underscores.');
      return;
    }
    
    setError('');
    setLoading(true);

    const email = `${username.toLowerCase()}${INTERNAL_DOMAIN}`;

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        // Sign up
        
        // 1. Check if username is taken
        const usernameRef = doc(db, 'usernames', username.toLowerCase());
        const usernameSnap = await getDoc(usernameRef);
        
        if (usernameSnap.exists()) {
          setError('Username is already taken');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Claim username and create profile
        const userDoc = {
          username: username,
          ownedThemes: ['legacy'],
          customThemes: [],
          playCounts: {},
          updatedAt: serverTimestamp()
        };

        try {
          // Claim username
          await setDoc(usernameRef, { uid: user.uid, createdAt: serverTimestamp() });
          // Create profile
          await setDoc(doc(db, 'users', user.uid), userDoc);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }

        onAuthSuccess(user);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid username or password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Username already taken');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-surface/90 backdrop-blur-2xl">
      <div className="absolute inset-0 tech-grid-pattern opacity-5" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-surface-soft border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/[0.05] flex justify-between items-center">
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight italic">
              {isLogin ? 'Login' : 'Sign Up'}
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-mono"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-mono focus:border-brand/40 outline-none transition-all"
                  placeholder="Enter Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm font-mono focus:border-brand/40 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-lg transition-colors group"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                  ) : (
                    <Eye className="w-4 h-4 text-white/20 group-hover:text-white/60" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-[10px] font-mono text-white/20 ml-1">At least 6 characters</p>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Login' : 'Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-mono text-white/40 uppercase tracking-widest hover:text-brand transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
