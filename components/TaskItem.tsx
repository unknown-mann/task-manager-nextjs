import React from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { isTaskExpired, isTaskRepeating, taskRepeatingDays, formatTaskDueDate } from "../utils";
import { TaskType } from "../types";
import { deleteTask, updateTask } from "../utils/helper";

const TaskEl = styled(motion.article)`
    position: relative;
    width: 250px;
    height: 240px;
    margin-bottom: 40px;
    margin-right: 59px;
`;

const TaskContent = styled.div<{ isExpired: boolean }>`
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    padding: 5px 25px;
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: ${props => props.isExpired ? '0 2px 38px 0 rgba(240, 0, 0, 0.19)' : '0 9px 38px 0 rgb(0 17 45 / 12%)'};
    background-color: #ffffff;
    outline: 0;
    :hover {
        button {
            opacity: 1;
            :hover {
                opacity: 0.7;
            };
            :active {
                opacity: 0.5;
            }
        }
        div {
            opacity: 1;
        }
    }
`;

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
`;

const Button = styled.button`
    margin-bottom: 5px;
    padding: 0;
    border: 0;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    opacity: 0;
    transition: 0.4s;
    color: ${props => props.color || 'inherit'};
    :hover {
        transition: 0s;
    }
    :disabled {
        color: rgba(0, 0, 0, 0.4);
        cursor: not-allowed;
    }
`;

const ColorEl = styled.span<{ isRepeating: boolean, isExpired: boolean }>`
    border-bottom: 10px ${props => props.isRepeating ? 'dashed' : 'solid'} ;
    border-color: ${props => props.isExpired ? 'red' : props.color};
`;

const DescriptionEl = styled.span`
    margin-top: 15px;
    margin-bottom: 10px;
    font-weight: 500;
    overflow: auto;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
`;

const DateEl = styled.span<{ isExpired: boolean }>`
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    color: ${props => props.isExpired ? 'red' : 'black'};
`;

const RepeatingDays = styled.div`
    opacity: 0;
    transition: 0.4s;
    margin-bottom: 10px;
    font-size: 10px;
`;

type TaskProps = {
    task: TaskType
    setModalOpen: (arg: boolean) => void
    setCurrentTask: (arg: TaskType) => void
}

const TaskItem = ({ task, setModalOpen, setCurrentTask }: TaskProps) => {

    const queryClient = useQueryClient()

    const {
        _id,
        color,
        description,
        dueDate,
        isArchived,
        isFavorite,
        repeatingDays
    } = task;

    const isExpired = isTaskExpired(dueDate)
    const isRepeating = isTaskRepeating(repeatingDays)
    const repeatsOn = taskRepeatingDays(repeatingDays)

    const {
        mutate: deleteTaskHandle,
        isLoading: isDeletingLoading
    } = useMutation((data: string) => deleteTask(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('Task deleted')
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const {
        mutate: archiveTaskToggle,
        isLoading: isArchToggling
    } = useMutation((data: any) => updateTask(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('Task archived')
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const {
        mutate: favoriteTaskToggle,
        isLoading: isFavToggling
    } = useMutation((data: any) => updateTask(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('Task added to favorites')
        },
        onError: () => {
            toast.error('Something went wrong')
        }
    })

    const deleteTaskSubmit = () => {
        deleteTaskHandle(_id!)
    }

    const handleToggleArchive = () => {
        archiveTaskToggle({
            taskId: _id,
            data: {
                isArchived: !isArchived
            }
        })
    }

    const handleToggleFavorite = () => {
        favoriteTaskToggle(
            {
                taskId: _id,
                data: {
                    isFavorite: !isFavorite
                }
            }
        )
    }

    const handleEditButton = () => {
        setModalOpen(true)
        setCurrentTask(task)
    }

    return (
        <TaskEl
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}>
            <TaskContent isExpired={isExpired as boolean}>
                <ButtonsWrapper>
                    <Button onClick={handleEditButton}>EDIT</Button>
                    <Button disabled={isArchToggling} onClick={handleToggleArchive}>
                        {isArchived ? 'UNARCHIVE' : 'ARCHIVE'}</Button>
                    <Button disabled={isFavToggling} onClick={handleToggleFavorite}>
                        {isFavorite ? 'DEL ' : 'ADD '}FAV
                    </Button>
                </ButtonsWrapper>
                <ColorEl color={color} isExpired={isExpired as boolean} isRepeating={isRepeating} />
                <DescriptionEl>{description}</DescriptionEl>
                <Wrapper>
                    <DateEl isExpired={isExpired as boolean}>
                        {formatTaskDueDate(dueDate) ||
                            (isRepeating &&
                                <RepeatingDays>
                                    <div>REPEATS ON:</div>
                                    {repeatsOn.map(day => (
                                        <span key={day[0]}> {day[0]}</span>
                                    ))}
                                </RepeatingDays>)}
                    </DateEl>
                    <Button disabled={isDeletingLoading} onClick={deleteTaskSubmit} color="red">
                        {isDeletingLoading ? 'DELETING...' : 'DELETE'}
                    </Button>
                </Wrapper>
            </TaskContent>
        </TaskEl>
    );
};

export default TaskItem;