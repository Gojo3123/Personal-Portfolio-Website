import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BackToTop from './components/BackToTop.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import GlobalSearch from './components/GlobalSearch.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Projects from './pages/Projects.jsx'
import Education from './pages/Education.jsx'
import Certificates from './pages/Certificates.jsx'
import Contact from './pages/Contact.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import Dashboard from './admin/Dashboard.jsx'
import ProfileManagement from './admin/ProfileManagement.jsx'
import ProjectsManagement from './admin/ProjectsManagement.jsx'
import SkillsManagement from './admin/SkillsManagement.jsx'
import EducationManagement from './admin/EducationManagement.jsx'
import CertificatesManagement from './admin/CertificatesManagement.jsx'
import AchievementsManagement from './admin/AchievementsManagement.jsx'
import MessagesManagement from './admin/MessagesManagement.jsx'
import UsersManagement from './admin/UsersManagement.jsx'
import Settings from './admin/Settings.jsx'

function PublicLayout() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <BackToTop />
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="education" element={<EducationManagement />} />
        <Route path="certificates" element={<CertificatesManagement />} />
        <Route path="achievements" element={<AchievementsManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PublicLayout />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <CartProvider>
                <AuthProvider>
                  <DataProvider>
                    <ScrollToTop />
                    <AppRoutes />
                  </DataProvider>
                </AuthProvider>
              </CartProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
