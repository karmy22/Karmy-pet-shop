import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import BYOKitPage from './pages/byoKitPage';
import CategoryPage from './pages/categoryPage';
import SeasonalPage from './pages/seasonalPage';
import InfoPage from './pages/infoPage';
import LoginPage from './pages/loginPage';
import CartPage from './pages/cartPage';
import AccountPage from './pages/accountPage';
import AccountOrdersPage from './pages/accountOrdersPage';
import AccountProfilePage from './pages/accountProfilePage';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import AdminPage from './pages/adminPage';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';
import { RequireAdmin, RequireAuth } from './components/routeGuards';
import {
  aboutUsSections,
  contactSections,
  faqSections,
  notFoundSections,
} from './data/siteContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build-your-own-kit" element={<BYOKitPage />} />
        <Route path="/shop/:speciesSlug/:categorySlug" element={<CategoryPage />} />
        <Route path="/seasonal/:collectionSlug" element={<SeasonalPage />} />
        <Route
          path="/about"
          element={(
            <InfoPage
              title="About Us"
              intro="Learn more about Karmy, what we are building, and how we are designing the storefront to grow with your pet's needs through every season."
              sections={aboutUsSections}
            />
          )}
        />
        <Route
          path="/about-us"
          element={(
            <InfoPage
              title="About Us"
              intro="Learn more about Karmy, what we are building, and how we are designing the storefront to grow with your pet's needs through every season."
              sections={aboutUsSections}
            />
          )}
        />
        <Route
          path="/faq"
          element={(
            <InfoPage
              title="Frequently Asked Questions"
              intro="This first storefront version focuses on structure: category navigation, seasonal visibility, and a reusable shopping shell that can keep expanding."
              sections={faqSections}
            />
          )}
        />
        <Route
          path="/contact-us"
          element={(
            <InfoPage
              title="Contact Us"
              intro="We are here to help with orders, products, and account support. Reach out through the details below."
              sections={contactSections}
            />
          )}
        />
        <Route
          path="*"
          element={(
            <InfoPage
              title="Page not found"
              intro="That page is not available yet. Use the main store navigation to jump back into the active catalog sections."
              sections={notFoundSections}
            />
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/account"
          element={(
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          )}
        />
        <Route
          path="/account/orders"
          element={(
            <RequireAuth>
              <AccountOrdersPage />
            </RequireAuth>
          )}
        />
        <Route
          path="/account/profile"
          element={(
            <RequireAuth>
              <AccountProfilePage />
            </RequireAuth>
          )}
        />
        <Route
          path="/admin"
          element={(
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
}