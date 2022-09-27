import React from "react";
import styled from "styled-components";
import useStateContext from "../context/StateContext";
import { SORT_VALUES } from "../utils/const";

const SortbarEl = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const SortButton = styled.button<{ isActive: boolean }>`
  margin-right: 50px;
  padding: 0;
  font-size: 16px;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
  background-color: transparent;
  border: none;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
  :active {
    opacity: 0.5;
  }
`;

const SortBar = () => {

  const { sortType, setSortType } = useStateContext()

  return (
    <SortbarEl>
      {SORT_VALUES.map((item, index) => (
        <SortButton
          key={index + 1}
          value={item.value}
          isActive={sortType === item.value}
          onClick={() => setSortType(item.value)}
        >
          {item.label}
        </SortButton>
      ))}
    </SortbarEl>
  );
};

export default SortBar;
