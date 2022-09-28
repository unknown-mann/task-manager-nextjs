import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getTasks } from '../utils/helper';
import BoardContent from './BoardContent';
import Header from './Header';
import SortBar from './Sortbar';

const Container = styled.div`
    width: 100%;
    min-width: 768px;
    height: 100%;
`;

const MainEl = styled.main`
    padding: 0 8rem;
    @media (max-width: 768px) {
        padding: 0 4rem;
    }
`;

const Main = () => {

    const {
        data: tasks = [],
        isLoading,
        isError
    } = useQuery('tasks', getTasks)

    return (
        <Container>
            <Header tasks={tasks} />
            <MainEl>
                <SortBar />
                <BoardContent tasks={tasks} isLoading={isLoading} isError={isError} />
            </MainEl>
        </Container>
    );
};

export default Main;