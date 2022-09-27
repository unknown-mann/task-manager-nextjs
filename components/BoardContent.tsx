import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import useStateContext from "../context/StateContext";
import useSelectedAndSortedTasks from "../hooks/useSelectedAndSortedTasks";
import TaskItem from "./TaskItem";
import EditTaskModal from "./EditTaskModal";
import { CONTAINER_VARIANTS, ITEM_VARIANTS } from "../utils/const";
import { TaskType } from "../types";
import { PuffLoader } from "react-spinners";

const ListEl = styled(motion.section)`
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    min-height: 500px;
    margin-right: -60px;
`;

const Wrapper = styled.div`
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
`;

type PropsType = {
    tasks: TaskType[]
    isLoading: boolean
    isError: boolean
}

export const BoardContent = ({ tasks, isLoading, isError }: PropsType) => {

    const [modalOpen, setModalOpen] = useState(false)

    const [currentTask, setCurrentTask] = useState<TaskType | null>(null)

    const { activeTab, sortType } = useStateContext()

    const sortedAndFilteredTasks = useSelectedAndSortedTasks(tasks, activeTab, sortType);

    if (isLoading) {
        return ( 
        <Wrapper>
            <PuffLoader />
        </Wrapper>
        )
    }

    if (isError) {
        return (
            <Wrapper>
                Error: something went wrong
            </Wrapper>
        )
    }

    if (!sortedAndFilteredTasks?.length) {
        return (
            <h1>There isn`t any tasks</h1>
        )
    }

    return (
        <>
            <ListEl
                variants={CONTAINER_VARIANTS}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {sortedAndFilteredTasks?.map((task: TaskType) => (
                        <motion.div key={task._id! + 1} variants={ITEM_VARIANTS} whileHover={{ scale: 1.05 }}>
                            <TaskItem
                                key={task._id}
                                task={task}
                                setModalOpen={setModalOpen}
                                setCurrentTask={setCurrentTask}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </ListEl>
            <Toaster />
            <AnimatePresence
                initial={false}
                mode='wait'
                onExitComplete={() => null}
            >
                {modalOpen && <EditTaskModal setModalOpen={setModalOpen} task={currentTask!} setTask={setCurrentTask} />}
            </AnimatePresence>
        </>
    )
}

export default BoardContent;