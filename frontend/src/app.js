import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import CategoryPage from './pages/categoryPage';
import SeasonalPage from './pages/seasonalPage';
import InfoPage from './pages/infoPage';
import LoginPage from './pages/loginPage';
import { AuthProvider } from './context/authContext';

const aboutSections = [
  {
    heading: 'What Karmy is building',
    body: 'Karmy is set up as a modern pet shop with category-driven shopping for dogs and cats, plus a build-your-kit flow for custom walk systems and trail-ready setups.',
  },
  {
    heading: 'How the assortment is organized',
    body: 'The storefront is structured around dogs, cats, and seasonal collections so you can expand or hide categories without rebuilding the whole navigation every time.',
  },
  {
    heading: 'What comes next',
    body: 'The current implementation is the first storefront slice. Product detail pages, cart state, checkout, and admin controls can be layered on top of this structure next.',
  },
];

const faqSections = [
  {
    heading: 'Can seasonal pages be hidden?',
    body: 'Yes. Each seasonal collection has a visible flag in the navigation data, so you can switch collections on or off without changing the page components.',
  },
  {
    heading: 'Are dog and cat menus separate?',
    body: 'Yes. Categories are defined per species so you can show different assortments for dogs and cats while keeping the same overall storefront layout.',
  },
  {
    heading: 'Is the build-your-kit flow still available?',
    body: 'Yes. The custom harness and leash builder remains on the site and is available from the main navigation as Build Your Kit.',
  },
];

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
              sections={[
                {
                  heading: 'Available now',
                  body: 'You can browse dog categories, cat categories, active seasonal collections, and the build-your-kit flow from the main navigation.',
                },
              ]}
            />
          )}
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}