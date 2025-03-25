// src/Pages/Recipes.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import categories from '../data/categories';


type Recipe = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
};



const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const areaParam = searchParams.get('area') || '';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Paginare
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Funcție: preia rețete pe baza parametrilor (prioritizăm: category > area > search > toate)
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      if (categoryParam.trim() !== '') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryParam)}`;
      } else if (areaParam.trim() !== '') {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(areaParam)}`;
      } else if (query.trim() !== '') {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
      } else {
        // Dacă nu e niciun filtru, folosim o interogare pentru litere (toate rețetele)
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let combined: Recipe[] = [];
        for (const letter of letters) {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
          const data = await res.json();
          if (Array.isArray(data.meals)) {
            combined = [...combined, ...data.meals];
          }
        }
        // Elimină duplicatele
        const uniqueRecipes = Array.from(new Map(combined.map(r => [r.idMeal, r])).values());
        setRecipes(uniqueRecipes);
        setCurrentPage(1);
        setLoading(false);
        return;
      }
      // Dacă avem un URL, efectuăm fetch
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data.meals)) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError('Nu s-au găsit rețete pentru filtrul ales.');
      }
      setCurrentPage(1);
    } catch (err) {
      setError('Eroare la preluarea rețetelor.');
    } finally {
      setLoading(false);
    }
  }, [query, categoryParam, areaParam]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Paginare
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecipes = recipes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Funcții de navigare pentru filtrare
  const handleCategoryFilter = (cat: string) => {
    navigate(`/recipes?category=${encodeURIComponent(cat)}`);
  };

  const getFlagImage = (area?: string): string | null => {
    if (!area) return null;
    const match = categories.find(c => c.area.toLowerCase() === area.toLowerCase());
    return match ? match.image : null;
  };
  
  return (
    <PageContainer>
      <Sidebar>
        <FilterSection>
        <FilterTitle>
        Filter
      </FilterTitle>
          <FilterOptions>
            {['Seafood', 'Miscellaneous', 'Vegetarian', 'Dessert','Chicken','Beef','Pork','Starter','Pasta','Breakfast','Lamb','Goat','Vegan'].map((cat) => (
              <FilterButton key={cat} onClick={() => handleCategoryFilter(cat)}>
                {cat}
              </FilterButton>
            ))}
          </FilterOptions>
        </FilterSection>
      </Sidebar>
      <Content>
      <Header>
        <MainTitle>Recipes</MainTitle>

        {(categoryParam || areaParam || query.trim() !== '') && (
          <SubTitleBox>
            {categoryParam && <span>Category: <strong>{categoryParam}</strong></span>}
            {areaParam && <span>Area: <strong>{areaParam}</strong></span>}
            {query.trim() !== '' && <span>Search: <strong>{query}</strong></span>}
          </SubTitleBox>
        )}
      </Header>

        {loading && <Message>Se încarcă...</Message>}
        {error && <Message>{error}</Message>}

        <RecipesGrid>
          {currentRecipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} onClick={() => navigate(`/recipe/${recipe.idMeal}`)}>
            <RecipeImage src={recipe.strMealThumb} alt={recipe.strMeal} />
          
            <TagsContainer>
              {getFlagImage(recipe.strArea) && (
                <Flag src={getFlagImage(recipe.strArea)!} alt={recipe.strArea} />
              )}
              {recipe.strCategory && <CategoryTag>{recipe.strCategory}</CategoryTag>}
            </TagsContainer>
          
            <RecipeTitle>{recipe.strMeal}</RecipeTitle>
          </RecipeCard>
          ))}
        </RecipesGrid>

        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationButton
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              active={currentPage === index + 1}
            >
              {index + 1}
            </PaginationButton>
          ))}
        </PaginationContainer>
      </Content>
    </PageContainer>
  );
};

export default Recipes;

const PageContainer = styled.div`
  display: flex;
  background-color: #fff;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
`;

const Sidebar = styled.aside`
  width: 260px;
  padding: 2rem 1.5rem;
  background: #fff;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  position: relative;
  z-index: 10;
`;

const FilterSection = styled.div`
  margin-bottom: 3rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  color: #fbb03b;
  margin-bottom: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  background-color: #fdfdfd;
  color: #444;
  border: 1px solid #ddd;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;

  &:hover {
    background-color: #fbb03b;
    color: #fff;
    border-color: #fbb03b;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(251, 176, 59, 0.2);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #fbb03b;
  margin-bottom: 1rem;
`;

const SubTitleBox = styled.div`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #fff5e1;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  animation: fadeIn 0.3s ease;

  span + span {
    margin-left: 1.5rem;
  }

  strong {
    color: #fbb03b;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.25rem;
  color: #888;
  margin-top: 2rem;
`;

const RecipesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
`;

const RecipeCard = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
`;

const RecipeTitle = styled.h3`
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 1rem;
  text-align: center;
`;

const TagsContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 2;
`;

const Flag = styled.img`
  width: 24px;
  height: 16px;
  border-radius: 3px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
`;

const CategoryTag = styled.span`
  background-color: #fbb03b;
  color: white;
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

type PaginationButtonProps = {
  active: boolean;
};

const PaginationButton = styled.button<PaginationButtonProps>`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ active }) => (active ? '#fbb03b' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  box-shadow: ${({ active }) =>
    active
      ? '0 4px 12px rgba(251, 176, 59, 0.4)'
      : '0 2px 6px rgba(0, 0, 0, 0.1)'};
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(251, 176, 59, 0.3);
    background: ${({ active }) => (active ? '#fbb03b' : '#ffe9c4')};
    color: #333;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(251, 176, 59, 0.5);
  }
`;
