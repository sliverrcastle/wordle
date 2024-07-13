import React, { useRef, useEffect } from 'react';
import { FiDelete } from 'react-icons/fi';

import styled from 'styled-components';

function Component({ onKeyPress, keyStatus }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
  ];

  const getColor = (key) => {
    switch (keyStatus[key]) {
      case 'correct':
        return '#6aaa64';
      case 'misplaced':
        return '#c9b458';
      case 'incorrect':
        return '#787c7e';
      default:
        return '#d3d6da';
    }
  };

  return (
    <Wrapper>
      {rows.map((row, index) => (
        <Rows key={`row__${index}`}>
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => onKeyPress(key)}
              $width={key === 'ENTER' || key === 'DELETE' ? '65px' : '43px'}
              $fontSize={key === 'ENTER' ? '12px' : '1.25rem'}
              $backgroundColor={getColor(key)}
            >
              {key === 'DELETE' ? (
                <IconWrapper>
                  <FiDelete size={22} />
                </IconWrapper>
              ) : (
                key
              )}
            </Button>
          ))}
        </Rows>
      ))}
    </Wrapper>
  );
}

export default Component;

const Wrapper = styled.div`
  margin-top: 30px;
`;

const Rows = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
`;

const Button = styled.button`
  border: none;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  width: ${({ $width }) => $width};
  height: 58px;
  border-radius: 4px;
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: bold;
  color: black;
  cursor: pointer;
  :active {
  }
`;

const IconWrapper = styled.div`
  padding-top: 5px;
`;
