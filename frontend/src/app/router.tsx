import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminPage } from '../pages/AdminPage';
import { LoginPage } from '../pages/login/loginPage';
import { ForgotPasswordPage } from "../pages/forgotPassword/forgotPasswordPage";
import { ResetPasswordPage } from "../pages/resetPassword/resetPasswordPage";
import { StartPage } from '../pages/start/startPage';
import { UnauthorizedPage } from '../pages/unauthorized/unauthorizedPage';
import { CapturePage } from '../pages/capture/capturePage';
import { ReviewPage } from '../pages/review/reviewPage';
import { QRCodePage } from '../pages/qrCode/QRCodePage';
import { PhotoFlowProvider } from '../context/PhotoFlowContext';

export function AppRouter() {
  return (
    <AuthProvider>
      <PhotoFlowProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/start"
              element={
                <ProtectedRoute allowedRoles={["PROMOTER"]}>
                  <StartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capture"
              element={
                <ProtectedRoute allowedRoles={["PROMOTER"]}>
                  <CapturePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute allowedRoles={["PROMOTER"]}>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qrcode"
              element={
                <ProtectedRoute allowedRoles={["PROMOTER"]}>
                  <QRCodePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PhotoFlowProvider>
    </AuthProvider>
  );
}
