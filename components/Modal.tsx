import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalEl = styled(motion.div)`
    z-index: 1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
`;

type ModalProps = {
    children: React.ReactNode
    onClick: () => void
};

const Modal: React.FC<ModalProps> = ({ children, onClick }) => {
    return (
        <ModalEl
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </ModalEl>
    );
};

export default Modal;