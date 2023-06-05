import React, { useState } from 'react';
import {
    deletePageAsync,
    responseFailure
} from '../../store/slices/pagesSlice';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';
import {
    updateBookAsync,
    responseFailure as responseFailureBook
} from '../../store/slices/booksSlice';

const DeletePage = ({
    show,
    setShow,
    book,
    setBook,
    pageId,
    page,
    setSelectedId,
    setSelectedPage,
    setLinks,
    nodes,
    setNodes
}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);

    const handleClose = () => {
        setLoading(false);
        setSelectedPage(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleConfirm = () => {
        setLoading(true);
        if (page.refUrl) {
            const ids = page.refUrl.split('/');
            const newBook = { ...book };
            const newReferences = newBook.references.filter((ref) => {
                const sourceIds = ref.path.split('/');
                if (ids.length === 2 && sourceIds.length === 2) {
                    return ids[1] !== sourceIds[1];
                } else if (ids.length === 3 && sourceIds.length === 4) {
                    return ids[1] !== sourceIds[1] || ids[2] !== sourceIds[3];
                } else {
                    return true;
                }
            });
            const newLinks = book.links.filter(
                (link) =>
                    link.source !== ids[ids.length - 1] &&
                    link.target !== ids[ids.length - 1]
            );
            newBook.references = newReferences;
            newBook.links = newLinks;
            dispatch(
                updateBookAsync(book.id, {
                    references: newReferences,
                    links: newLinks
                })
            )
                .then((result) => {
                    if (result.type === responseFailureBook.type) {
                        toast.error(result.payload);
                    } else {
                        toast.success(
                            `${page.name} reference is removed from ${result.payload.name} successfully`
                        );
                        toast.warning(
                            `Actual ${page.name} is not deleted. Only reference is deleted`
                        );
                        const newNodes = nodes.filter(
                            (node) => node.id !== page.id
                        );

                        setBook(newBook);
                        setNodes(newNodes);
                        setLinks(result.payload.links);
                        handleClose();
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            dispatch(deletePageAsync(book.id, pageId))
                .then((result) => {
                    if (result.type === responseFailure.type) {
                        toast.error(result.payload);
                    } else {
                        toast.success(
                            `${result.payload.page.name} is deleleted successfully`
                        );
                        setLinks(result.payload.links);
                        handleClose();
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            contentClassName={styles.formModal}>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Delete {page.name}</Modal.Title>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    <MdClose size={24} />
                </Button>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {page.name}?
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

export default DeletePage;
