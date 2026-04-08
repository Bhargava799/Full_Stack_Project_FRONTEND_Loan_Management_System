import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import LoanOversight from './pages/admin/LoanOversight';

// Lender
import LenderDashboard from './pages/lender/LenderDashboard';
import CreateLoanOffer from './pages/lender/CreateLoanOffer';
import PaymentTracking from './pages/lender/PaymentTracking';

// Borrower
import BorrowerDashboard from './pages/borrower/BorrowerDashboard';
import LoanApplication from './pages/borrower/LoanApplication';
import PaymentSchedule from './pages/borrower/PaymentSchedule';
import TransactionHistory from './pages/borrower/TransactionHistory';

// Analyst
import AnalystDashboard from './pages/analyst/AnalystDashboard';
import RiskAssessment from './pages/analyst/RiskAssessment';
import Reports from './pages/analyst/Reports';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const roleHome = { 
        ADMIN: '/admin', 
        LENDER: '/lender', 
        BORROWER: '/borrower', 
        ANALYST: '/analyst' 
    };
    return <Navigate to={roleHome[currentUser.role] || '/login'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated && currentUser?.role ? <Navigate to={`/${currentUser.role.toLowerCase()}`} replace /> : <Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="loans" element={<LoanOversight />} />
      </Route>

      {/* Lender Routes */}
      <Route path="/lender" element={<ProtectedRoute allowedRoles={['LENDER']}><Layout /></ProtectedRoute>}>
        <Route index element={<LenderDashboard />} />
        <Route path="create" element={<CreateLoanOffer />} />
        <Route path="payments" element={<PaymentTracking />} />
      </Route>

      {/* Borrower Routes */}
      <Route path="/borrower" element={<ProtectedRoute allowedRoles={['BORROWER']}><Layout /></ProtectedRoute>}>
        <Route index element={<BorrowerDashboard />} />
        <Route path="apply" element={<LoanApplication />} />
        <Route path="schedule" element={<PaymentSchedule />} />
        <Route path="transactions" element={<TransactionHistory />} />
      </Route>

      {/* Analyst Routes */}
      <Route path="/analyst" element={<ProtectedRoute allowedRoles={['ANALYST']}><Layout /></ProtectedRoute>}>
        <Route index element={<AnalystDashboard />} />
        <Route path="risk" element={<RiskAssessment />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
