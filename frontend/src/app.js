import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import CategoryPage from './pages/categoryPage';
import SeasonalPage from './pages/seasonalPage';
import InfoPage from './pages/infoPage';
import LoginPage from './pages/loginPage';
import CartPage from './pages/cartPage';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/cartContext';
import { aboutSections, faqSections, notFoundSections } from './data/siteContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/build-your-kit" element={<Home />} />
        <Route path="/shop/:speciesSlug/:categorySlug" element={<CategoryPage />} />
        <Route path="/seasonal/:collectionSlug" element={<SeasonalPage />} />
        <Route
          path="/about"
          element={(
            <InfoPage
              title="About Karmy"
              intro="Karmy is being shaped into a flexible pet storefront that can sell everyday essentials, outdoor gear, and seasonal collections without hardcoding every menu update into the UI."
              sections={aboutSections}
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
        <Route path="/cart" element={<CartPage />} />
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