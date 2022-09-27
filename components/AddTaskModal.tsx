import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { COLORS, IS_REPEATING_DAYS, MODAL_VARIANTS } from "../utils/const";
import { isTaskRepeating } from "../utils";
import { addTask } from "../utils/helper";
import { TaskType } from "../types";

const ModalContent = styled(motion.div)`
  width: 300px;
  font-size: 20px;
  padding: 30px;
  border-radius: 10px;
  background-color: white;
`;

const Bar = styled.div<{ isRepeat: boolean }>`
  border-bottom: 10px ${(props) => (props.isRepeat ? "dashed" : "solid")} ${(props) => props.color};
`;

const DescriptionArea = styled.textarea`
  font-family: inherit;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 0;
  margin-top: 10px;
  resize: none;
  height: 150px;
  width: 100%;
  outline: none;
  padding: 3px;
  font-weight: 500;
  font-size: 16px;
  overflow: auto;
  border-color: transparent;
  line-height: 1.15;
`;

const SettingButton = styled.button`
  display: block;
  width: auto;
  border: 0;
  padding: 0;
  margin: 0;
  margin-bottom: 30px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 500;
  text-align: left;
  border-bottom: 1px solid #000000;
  outline: none;
  background-color: transparent;
  cursor: pointer;
`;

const DateInput = styled.input.attrs({
  type: 'date',
})`
  position: absolute;
  margin-top: 5px;
`;

const RepeatingDaysWrapper = styled.form`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
`;

const DayButton = styled.input.attrs({
  type: 'checkbox'
})`
  display: none;
  :checked + label {
      color: #000000;
      border-color: #000000;
  }
`;

const DayLabel = styled.label`
  display: inline-block;
  width: 30px;
  padding: 3px;
  text-align: center;
  font-size: 16px;
  color: #e3dede;
  border: 1px solid #e3dede;
  cursor: pointer;
  text-transform: lowercase;
`;

const ColorTitle = styled.h3`
  margin: 0;
  margin-top: 45px;
  margin-bottom: 10px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 500;
`;

const ColorsSelect = styled.form`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-left: -12px;
`;

const ColorButton = styled.input.attrs({
  type: 'radio',
  name: 'color'
})`
  visibility: hidden;
  & + label {
    cursor: pointer;
    background-color: ${(props) => props.value};
    :hover {
      opacity: 0.7;
    }
  }
  :checked + label {
    box-shadow: 0 0 0 4px #ffffff, 0 0 0 6px ${(props) => props.value};
  }
`;

const ColorLabel = styled.label`
  display: inline-block;
  width: 20px;
  height: 20px;
`;

const SaveButton = styled.button`
  width: 100%;
  border: 1px solid #000000;
  font-size: 14px;
  padding: 5px 0;
  cursor: pointer;
  background-color: transparent;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  :disabled {
    cursor: not-allowed;
  }
`;

type ModalProps = {
  setModalOpen: (arg: boolean) => void
};

export const AddTaskModal: React.FC<ModalProps> = ({ setModalOpen }) => {

  const queryClient = useQueryClient()

  const [color, setColor] = useState("black");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [repeatingDays, setRepeatingDays] = useState(IS_REPEATING_DAYS);

  const [isDate, setIsDate] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const handleSetTaskColor = (evt: React.ChangeEvent<HTMLFormElement>) => setColor(evt.target.value);
  const handleSetDescription = (evt: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(evt.target.value);
  const handleSetDate = (evt: React.ChangeEvent<HTMLInputElement>) => setDate(evt.target.value);

  const handleSetRepeatingDays = (evt: React.ChangeEvent<HTMLFormElement>) => {
    const arr = evt.target.value.split(",");
    setRepeatingDays({
      ...repeatingDays,
      [arr[0]]: arr[1] === "false" ? true : false,
    });
  };

  const toggleDateStatus = () => {
    setIsDate(!isDate);
    setDate("");
  };
  const toggleRepeatStatus = () => {
    setIsRepeat(!isRepeat);
    setRepeatingDays(IS_REPEATING_DAYS);
  };

  const isRepeatAndIsDate = Boolean(date) || isTaskRepeating(repeatingDays);
  const isSaveButtonDisabled = isRepeatAndIsDate && Boolean(description.trim().length);

  const { mutate: addTaskHandle, isLoading } = useMutation((data: TaskType) => addTask(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks')
      toast.success('New task added')
      setModalOpen(false)
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  const handleSubmit = () => {
    addTaskHandle({
      color,
      description,
      isArchived: false,
      isFavorite: false,
      dueDate: date ? date : null,
      repeatingDays,
    })
  }

  return (
    <Modal onClick={() => setModalOpen(false)}>
      <ModalContent
        onClick={evt => evt.stopPropagation()}
        variants={MODAL_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Bar isRepeat={isRepeat} color={color} />
        <DescriptionArea
          value={description}
          onChange={handleSetDescription}
          placeholder="Start typing your text here..."
        />
        <SettingButton disabled={isRepeat} onClick={toggleDateStatus}>
          <div>DATE: {isDate ? "YES" : "NO"}</div>
          {isDate && (
            <DateInput
              type="date"
              value={date}
              onChange={handleSetDate}
              onClick={evt => evt.stopPropagation()}
            />
          )}
        </SettingButton>
        <SettingButton disabled={isDate} onClick={toggleRepeatStatus}>
          <div>REPEAT: {isRepeat ? "YES" : "NO"}</div>
          {isRepeat && (
            <RepeatingDaysWrapper
              onChange={handleSetRepeatingDays}
              onClick={evt => evt.stopPropagation()}>
              {Object.entries(repeatingDays).map(([day, repeat]: any) => (
                <span key={day}>
                  <DayButton
                    defaultChecked={repeat}
                    value={[day, repeat]}
                    name={day}
                    id={day} />
                  <DayLabel htmlFor={day}>{day}</DayLabel>
                </span>
              ))}
            </RepeatingDaysWrapper>
          )}
        </SettingButton>
        <ColorTitle>COLOR</ColorTitle>
        <ColorsSelect onChange={handleSetTaskColor}>
          {COLORS.map((taskColor, index) => (
            <span key={taskColor}>
              <ColorButton
                defaultChecked={index === 0}
                value={taskColor}
                id={taskColor}
              />
              <ColorLabel htmlFor={taskColor} />
            </span>
          ))}
        </ColorsSelect>
        <SaveButton
          disabled={!isSaveButtonDisabled || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? 'SAVING...' : 'SAVE'}
        </SaveButton>
      </ModalContent>
    </Modal>
  )
};
