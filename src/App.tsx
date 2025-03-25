// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop';
import Home from './Pages/Home';
import Recipes from './Pages/Recipes';
import RecipeCard from './Pages/RecipeCard';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import styled from 'styled-components';



const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <NavBar />
        <MainContent>
        <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipe/:id" element={<RecipeCard />} />
          </Routes>
        </MainContent>
        <Footer />
      </AppContainer>
    </Router>
  );
};

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;