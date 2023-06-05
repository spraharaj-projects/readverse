import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
    deleteBookAsync,
    responseFailure
} from '../../store/slices/booksSlice';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

const DeleteBook = ({
    show,
    setShow,
    bookId,
    book,
    setSelectedId,
    setSelectedBook
}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);

    const handleClose = () => {
        setLoading(false);
        setSelectedBook(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleConfirm = () => {
        setLoading(true);

        dispatch(deleteBookAsync(bookId))
            .then((result) => {
                if (result.type === responseFailure.type) {
                    toast.error(result.payload);
                } else {
                    toast.success(
                        `${result.payload.name} is deleleted successfully`
                    );
                    handleClose();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            contentClassName={styles.formModal}>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Deleting {book.name}</Modal.Title>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    <MdClose size={24} />
                </Button>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {book.name}?
            </Modal.Body>
            <Modal.Footer
                className={`${styles.modalFooter} justify-content-center`}>
                <Button
                    className="w-25 me-3"
                    variant="secondary"
                    onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    className="w-25"
                    variant="danger"
                    onClick={() => {
                        handleConfirm();
                    }}>
                    {isLoading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Delete'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteBook;
