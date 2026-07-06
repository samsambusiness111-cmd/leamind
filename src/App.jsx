import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Course from './pages/Course';
import Summary from './pages/Summary';
import Profile from './pages/Profile';
import SubscriptionGuard from './components/SubscriptionGuard';
import PaymentSuccess from './pages/PaymentSuccess';
import SuccessLeamind from './pages/SuccessLeamind';
import Privacy from './pages/Privacy';
import DeleteAccount from './pages/DeleteAccount';

import AuthGuard from './components/AuthGuard';
import BottomTabs from './components/BottomTabs';

const pageVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const pageTransition = { duration: 0.22, ease: 'easeInOut' };

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Force light theme always
    document.documentElement.classList.remove('dark');
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '4px solid #e2e8f0', borderTopColor: '#1A365D' }}></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      if (location.pathname !== '/') {
        // Not logged in — redirect to landing page
        window.location.replace('/');
        return null;
      }
      // On landing page — allow through publicly
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          style={{ minHeight: '100dvh' }}
        >
      <Routes location={location}>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/success-leamind" element={<SuccessLeamind />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />

        <Route path="/" element={isAuthenticated ? <Home /> : <Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/Course" element={<AuthGuard><SubscriptionGuard><Course /></SubscriptionGuard></AuthGuard>} />
        <Route path="/Summary" element={<AuthGuard><SubscriptionGuard><Summary /></SubscriptionGuard></AuthGuard>} />
        <Route path="/Profile" element={<AuthGuard><SubscriptionGuard><Profile /></SubscriptionGuard></AuthGuard>} />
        <Route path="*" element={<PageNotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {isAuthenticated && <BottomTabs />}
    </>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App