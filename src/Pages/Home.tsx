// src/Pages/Home.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import RecipeAnimation from '../Components/RecipeAnimation';
import categories from '../data/categories';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === '') {
      navigate(`/recipes?ingredient=chicken`);
    } else {
      navigate(`/recipes?search=${encodeURIComponent(trimmedQuery)}`);
    }
  };


  return (
    <>
      <MainContainer>
        <MainSection>
          <RecipeAnimation />
          <TextContainer>
            <Title>World of recipes</Title>
            <Subtitle>Cook international dishes with ease</Subtitle>
            <SearchBarContainer>
              <StyledInput
                placeholder="Search for a recipe"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <StyledButton onClick={handleSearch}>Search</StyledButton>
            </SearchBarContainer>
          </TextContainer>
        </MainSection>

        <WaveContainer>
          <Wave viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L80,192C160,160,320,96,480,96C640,96,800,160,960,181.3C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </Wave>
        </WaveContainer>
      </MainContainer>

      <CategorySection>
        <SectionTitle>Categories</SectionTitle>
        <CategoriesContainer>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.area}
              onClick={() =>
                navigate(`/recipes?area=${encodeURIComponent(cat.area)}`)
              }
            >
              <CategoryImage src={cat.image} alt={cat.area} />
              <CategoryLabel>{cat.area}</CategoryLabel>
            </CategoryCard>
          ))}
        </CategoriesContainer>
      </CategorySection>
    </>
  );
};

export default Home;

const MainContainer = styled.div`
  position: relative;
  padding-bottom: 130px;
  min-height: 70vh;
  background-color: #fbb03b;
  font-family: sans-serif;
`;

const MainSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 2rem 2rem 3rem; 
`;

const TextContainer = styled.div`
  max-width: 500px;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;
`;

const SearchBarContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
`;

const StyledButton = styled.button`
  background: #fff;
  color: #fbb03b;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Wave = styled.svg`
  display: block;
  width: 100%;
  height: 320px;
`;

const CategorySection = styled.div`
  position: relative; 
  margin-top: -125px;
  text-align: center;
  background-color: #fff;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: black;
  margin-bottom: 1.5rem;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
`;
const CategoryCard = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const CategoryImage = styled.img`
  width: 60%;
  height: 60%;
  object-fit: contain;
`;

const CategoryLabel = styled.span`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #fbb03b;
  font-weight: bold;
`;
