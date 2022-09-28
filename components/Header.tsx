import React, { useState } from "react";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";
import useStateContext from "../context/StateContext";
import { AddTaskModal } from "./AddTaskModal";
import { TaskType } from "../types";
import { isTaskExpiringToday, isTaskActiveToday, isTaskExpired, isTaskRepeating } from "../utils";

const HeaderEl = styled.header`
    padding: 0 8rem;
    padding-top: 40px;
    @media (max-width: 768px) {
        padding: 0 4rem;
        padding-top: 40px;
    }
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`;

const Title = styled.h1`
    margin: 0;
    margin-right: 100px;
    font-size: 16px;
    line-height: 23px;
`;

const Button = styled.button`
    padding: 0;
    font-size: 16px;
    font-weight: normal;
    color: inherit;
    background-color: transparent;
    border: none;
    text-decoration: none;
    cursor: pointer;
        :hover {
        opacity: 0.7;
    };
        :active {
        opacity: 0.5;
    }
`;

const TabMenu = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 0;
`;

const TabItem = styled.button <{ disabled?: boolean, isActive: boolean }>`
    font-family: "HelveticaNeueCyr", Arial, sans-serif;
    font-size: 16px;
    font-weight: ${props => props.isActive ? 700 : 500};
    background-color: transparent;
    border: none;
    opacity: ${props => props.disabled ? '0.5' : '1'};
    text-transform: uppercase;
    :hover {
        opacity: 0.6;
  }
`;

type PropsType = {
    tasks: TaskType[]
}

const Header = ({ tasks }: PropsType) => {

    const [isModalOpen, setModalOpen] = useState(false)

    const { activeTab, setActiveTab } = useStateContext()

    const allTasksNum = tasks.filter(task => task && !task.isArchived).length
    const expiredTasksNum = tasks.filter(task => isTaskExpired(task.dueDate) && !task.isArchived).length
    const todayTasksNum = tasks.filter(task => (isTaskExpiringToday(task.dueDate) || isTaskActiveToday(task.repeatingDays).length) && !task.isArchived).length
    const favoriteTasksNum = tasks.filter(task => task.isFavorite && !task.isArchived).length
    const repeatingTasksNum = tasks.filter(task => isTaskRepeating(task.repeatingDays) && !task.isArchived).length
    const archivedTasksNum = tasks.filter(task => task.isArchived).length

    return (
        <HeaderEl>
            <Wrapper>
                <Title>TASKMANAGER</Title>
                <Button onClick={() => setModalOpen(true)}>+ ADD NEW TASK</Button>
                <AnimatePresence
                    initial={false}
                    onExitComplete={() => null}
                    mode='wait'
                >
                    {isModalOpen && <AddTaskModal setModalOpen={setModalOpen} />}
                </AnimatePresence>
            </Wrapper>
            <TabMenu>
                <TabItem
                    isActive={activeTab === 'all'}
                    onClick={() => { setActiveTab('all') }}
                >
                    all {allTasksNum}
                </TabItem>
                <TabItem
                    disabled={!expiredTasksNum}
                    isActive={activeTab === 'overdue'}
                    onClick={() => { setActiveTab('overdue') }}
                >
                    overdue {expiredTasksNum}
                </TabItem>
                <TabItem
                    disabled={!todayTasksNum}
                    isActive={activeTab === 'today'}
                    onClick={() => { setActiveTab('today') }}
                >
                    today {todayTasksNum}
                </TabItem>
                <TabItem
                    disabled={!favoriteTasksNum}
                    isActive={activeTab === 'favorites'}
                    onClick={() => { setActiveTab('favorites') }}
                >
                    favorites {favoriteTasksNum}
                </TabItem>
                <TabItem
                    disabled={!repeatingTasksNum}
                    isActive={activeTab === 'repeating'}
                    onClick={() => { setActiveTab('repeating') }}
                >
                    repeating {repeatingTasksNum}
                </TabItem>
                <TabItem
                    disabled={!archivedTasksNum}
                    isActive={activeTab === 'archive'}
                    onClick={() => { setActiveTab('archive') }}
                >
                    archive {archivedTasksNum}
                </TabItem>
            </TabMenu>
        </HeaderEl>
    );
};

export default Header;