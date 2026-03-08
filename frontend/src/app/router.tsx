import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminPage } from '../pages/admin/adminPage';
import { LoginPage } from '../pages/login/loginPage';
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route
              path="/start"
              element={
                <ProtectedRoute allowedRoles={['PROMOTOR']}>
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
                <ProtectedRoute allowedRoles={["PROMOTOR"]}>
                  <CapturePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review"
              element={
                <ProtectedRoute allowedRoles={['PROMOTOR']}>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qrcode"
              element={
                <ProtectedRoute allowedRoles={['PROMOTOR']}>
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
