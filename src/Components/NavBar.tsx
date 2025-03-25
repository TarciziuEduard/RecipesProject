// src/Components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavBar: React.FC = () => {
  return (
    <NavContainer>
      <LogoContainer as={Link} to="/">
        <LogoIcon>🍽️</LogoIcon>
        <LogoText>GUSTIX</LogoText>
      </LogoContainer>
      <NavMenu>
        <NavItem>
          <StyledLink to="/">Home</StyledLink>
        </NavItem>
        <NavItem>
          <StyledLink to="/recipes">Recipes</StyledLink>
        </NavItem>
      </NavMenu>
    </NavContainer>
  );
};

export default NavBar;

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background-color: #fbb03b;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  cursor: pointer;
`;

const LogoIcon = styled.span`
  font-size: 1.8rem;
`;

const LogoText = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  font-family: 'Segoe UI', sans-serif;
  letter-spacing: 1px;
`;

const NavMenu = styled.ul`
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li``;

const StyledLink = styled(Link)`
  position: relative;
  color: #fff;
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    left: 0;
    bottom: -4px;
    background-color: #fff;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #fff;
  }

  &:hover::after {
    width: 100%;
  }
`;
