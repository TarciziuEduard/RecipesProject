import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

type RecipeDetailType = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strYoutube: string;
  strSource?: string; // ← aici
};


const RecipeCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetailType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        } else {
          setError('Rețeta nu a fost găsită.');
        }
      } catch (err) {
        setError('Eroare la preluarea detaliilor rețetei.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]);

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients: { ingredient: string; measure: string }[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = (recipe as any)[`strIngredient${i}`];
      const measure = (recipe as any)[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({ ingredient, measure });
      }
    }
    return ingredients;
  };

  if (loading) return <Message>Se încarcă...</Message>;
  if (error) return <Message>{error}</Message>;
  if (!recipe) return null;

  const ingredients = getIngredients();

  return (
    <Container>
      <HeaderSection>
        <Backdrop>
          <BlurredBackground image={recipe.strMealThumb} />
          <Image src={recipe.strMealThumb} alt={recipe.strMeal} />
        </Backdrop>
        <Title>{recipe.strMeal}</Title>
        {recipe.strSource && (
        <SourceLink href={recipe.strSource} target="_blank" rel="noopener noreferrer">
          🔗 See original source
        </SourceLink>
      )}
      </HeaderSection>

      <FlexWrapper>
        <Card>
          <SectionTitle>Ingredients</SectionTitle>
          <IngredientsList>
            {ingredients.map((item, index) => (
              <IngredientItem key={index}>
                <strong>{item.ingredient}</strong> <span>- {item.measure}</span>
              </IngredientItem>
            ))}
          </IngredientsList>
        </Card>

        <Card>
          <SectionTitle>Instructions</SectionTitle>
          <InstructionsText>{recipe.strInstructions}</InstructionsText>
        </Card>
      </FlexWrapper>

      {recipe.strYoutube && (
      <VideoWrapper>
        <SectionTitle>See how it's cooked</SectionTitle>
        <Iframe
          src={`https://www.youtube.com/embed/${new URL(recipe.strYoutube).searchParams.get('v')}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></Iframe>
      </VideoWrapper>
    )}
    </Container>
  );
};

export default RecipeCard;


const Container = styled.div`
  background-color: #fff;
  min-height: 100vh;
  color: #333;
  font-family: 'Segoe UI', sans-serif;
`;

const HeaderSection = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const Backdrop = styled.div`
  position: relative;
  width: 100vw;
  height: 500px;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlurredBackground = styled.div<{ image: string }>`
  position: absolute;
  top: -20px;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  filter: blur(60px) brightness(0.5);
  z-index: 1;
`;

const Image = styled.img`
  position: relative;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  z-index: 2;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-top: 1rem;
  color: #222;
`;

const SourceLink = styled.a`
  display: block;
  width: fit-content;
  margin: 0.5rem auto 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #fbb03b;
  background-color: #fff5e1;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition: all 0.2s ease;

  &:hover {
    background-color: #fbb03b;
    color: #fff;
    transform: scale(1.03);
  }
`;


const SectionTitle = styled.h2`
font-size: 1.5rem;
margin-bottom: 1.5rem;
position: relative;
padding-left: 1rem;
color: #333;

&::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  background-color: #fbb03b;
  border-radius: 4px;
}
`;


const FlexWrapper = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: stretch; /* face toate cardurile să aibă aceeași înălțime */
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 3rem auto;
  padding: 0 1rem;
`;
const Card = styled.div`
  flex: 1;
  min-width: 300px;
  background: #fff5e1; /* portocaliu deschis */
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  }
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const IngredientItem = styled.li`
  background-color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 500;
  color: #444;
`;

const InstructionsText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #444;
  white-space: pre-line;
`;
const VideoWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 500px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 1rem;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin: 1rem 0;
`;
