import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';
import { RequireAdmin, RequireAuth } from './components/routeGuards';
import {
  aboutUsSections,
  contactSections,
  faqSections,
  notFoundSections,
  returnsSections,
  shippingSections,
} from './data/siteContent';

const Home = lazy(() => import('./pages/home'));
const BYOKitPage = lazy(() => import('./pages/byoKitPage'));
const CategoryPage = lazy(() => import('./pages/categoryPage'));
const SeasonalPage = lazy(() => import('./pages/seasonalPage'));
const InfoPage = lazy(() => import('./pages/infoPage'));
const LoginPage = lazy(() => import('./pages/loginPage'));
const CartPage = lazy(() => import('./pages/cartPage'));
const AccountPage = lazy(() => import('./pages/accountPage'));
const AccountOrdersPage = lazy(() => import('./pages/accountOrdersPage'));
const AccountProfilePage = lazy(() => import('./pages/accountProfilePage'));
const AccountAddressesPage = lazy(() => import('./pages/accountAddressesPage'));
const AccountRewardsPage = lazy(() => import('./pages/accountRewardsPage'));
const AccountPetCareGuidesPage = lazy(() => import('./pages/accountPetCareGuidesPage'));
const ForgotPasswordPage = lazy(() => import('./pages/forgotPasswordPage'));
const AdminPage = lazy(() => import('./pages/adminPage'));

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--mid)' }}>
      Loading page...
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
                intro="Find quick answers about products, orders, shipping, returns, and account support."
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
            path="/shipping-policy"
            element={(
              <InfoPage
                title="Shipping Policy"
                intro="Review processing times, delivery expectations, and shipping support before placing an order."
                sections={shippingSections}
              />
            )}
          />
          <Route
            path="/returns-refunds"
            element={(
              <InfoPage
                title="Returns & Refunds"
                intro="Learn how return requests, refund reviews, and order issue support are handled."
                sections={returnsSections}
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
            path="/account/addresses"
            element={(
              <RequireAuth>
                <AccountAddressesPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/account/rewards"
            element={(
              <RequireAuth>
                <AccountRewardsPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/account/pet-care-guides"
            element={(
              <RequireAuth>
                <AccountPetCareGuidesPage />
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
        </Routes>
      </Suspense>
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
