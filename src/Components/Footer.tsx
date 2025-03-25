// src/Components/Footer.tsx
import React from 'react';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText>© 2025 GUSTIX. Toate drepturile rezervate.</FooterText>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background-color: #333;
  padding: 1rem;
  text-align: center;
`;

const FooterText = styled.p`
  color: #fff;
  margin: 0;
  font-size: 0.9rem;
`;
