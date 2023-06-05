import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles/Books.module.css';
import AddBook from './forms/AddBook';
import UpdateBook from './forms/UpdateBook';
import DeleteBook from './forms/DeleteBook';
import Spinner from './Spinner';
import {
    fetchBooksAsync,
    responseFailure as bookResponseFailure,
    updateBookAsync
} from '../store/slices/booksSlice';
import { Button, Card } from 'react-bootstrap';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { MdEdit, MdOutlineDelete, MdOutlineOpenInNew } from 'react-icons/md';
import { FaRegHeart, FaRegEye, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAgoTime } from '../utils/utilities';
import {
    responseFailure as userResponseFailure,
    updatedUserLikeAsync
} from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Books = () => {
    const dispatch = useDispatch();
    const { books, user } = useSelector((state) => ({
        books: state.books.books,
        user: state.auth.user
    }));

    const [isLoading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [showAddBook, setShowAddBook] = useState(false);
    const [showUpdateBook, setShowUpdateBook] = useState(false);
    const [showDeleteBook, setShowDeleteBook] = useState(false);
    const navigate = useNavigate();

    const handleAddBookShow = () => setShowAddBook(true);
    const handleUpdateBookShow = () => setShowUpdateBook(true);
    const handleDeleteBookShow = () => setShowDeleteBook(true);

    const handleOpenBook = (bookId) => {
        navigate(`/${bookId}`);
    };

    useEffect(() => {
        setLoading(true);
        dispatch(fetchBooksAsync()).finally(() => {
            setLoading(false);
            document.title = 'ReadVerse | Lumindrix';
        });
    }, [dispatch]);

    const sortFn = (a, b) => {
        return books[b].updatedOn.seconds - books[a].updatedOn.seconds;
    };

    const like = (bookId) => {
        if (user) {
            if (!user.likedBooks.includes(bookId)) {
                const likedBooks = [...user.likedBooks];
                likedBooks.push(bookId);
                dispatch(
                    updatedUserLikeAsync(user.uid, { likedBooks: likedBooks })
                ).then((result) => {
                    if (result.type === userResponseFailure) {
                        toast.error(result.error);
                    }
                });
                dispatch(
                    updateBookAsync(bookId, { likes: books[bookId].likes + 1 })
                ).then((result) => {
                    if (result.type === bookResponseFailure) {
                        toast.error(result.error);
                    }
                });
            } else {
                const likedBooks = user.likedBooks.filter(
                    (bid) => bid != bookId
                );
                dispatch(
                    updatedUserLikeAsync(user.uid, { likedBooks: likedBooks })
                ).then((result) => {
                    if (result.type === userResponseFailure) {
                        toast.error(result.error);
                    }
                });
                dispatch(
                    updateBookAsync(bookId, { likes: books[bookId].likes - 1 })
                ).then((result) => {
                    if (result.type === bookResponseFailure) {
                        toast.error(result.error);
                    }
                });
            }
        } else {
            toast.info('Please Sign In to like your favorite book');
        }
    };

    const view = (bookId) => {
        if (user) {
            if (!user.viewedBooks.includes(bookId)) {
                const viewedBooks = [...user.viewedBooks];
                viewedBooks.push(bookId);
                dispatch(
                    updatedUserLikeAsync(user.uid, { viewedBooks: viewedBooks })
                ).then((result) => {
                    if (result.type === userResponseFailure) {
                        toast.error(result.error);
                    }
                });
                dispatch(
                    updateBookAsync(bookId, { views: books[bookId].views + 1 })
                ).then((result) => {
                    if (result.type === bookResponseFailure) {
                        toast.error(result.error);
                    }
                });
            }
        }
    };

    return isLoading ? (
        <Spinner />
    ) : (
        <div className={styles.cardDeck}>
            {Object.keys(books)
                .sort(sortFn)
                .map((key) => (
                    <Card
                        border="dark"
                        bg="dark"
                        text="white"
                        className={styles.card}
                        key={key}>
                        <Card.Img
                            variant="top"
                            src={
                                books[key].cover ??
                                `https://placehold.co/440x292/495057/white?text=${books[key].name}`
                            }
                            className={styles.cardImage}
                        />

                        <div className={styles.cardLikeView}>
                            <div className={styles.cardLikeViewBlock}>
                                {user &&
                                user.likedBooks &&
                                user.likedBooks.includes(key) ? (
                                    <FaHeart
                                        className={styles.cardLikeViewIcon}
                                        size={20}
                                        color="#ff496c"
                                        onClick={() => like(key)}
                                    />
                                ) : (
                                    <FaRegHeart
                                        className={styles.cardLikeViewIcon}
                                        size={20}
                                        onClick={() => like(key)}
                                    />
                                )}
                                <span>{books[key].likes}</span>
                            </div>
                            <div className={styles.cardLikeViewBlock}>
                                <FaRegEye
                                    className={styles.cardLikeViewIcon}
                                    size={20}
                                />
                                <span>{books[key].views}</span>
                            </div>
                        </div>
                        <Card.Body className={styles.cardBody}>
                            <Card.Title>{books[key].name}</Card.Title>
                            <Card.Subtitle className="mb-2 font-weight-light text-muted">
                                {books[key].author.name}
                            </Card.Subtitle>
                            <Card.Text className={styles.cardText}>
                                {books[key].shortDesc}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.cardFooter}>
                            <small className="text-muted">
                                Last updated {getAgoTime(books[key].updatedOn)}
                            </small>
                            {user ? (
                                <>
                                    <Button
                                        className={`${styles.footerBtn} ms-auto me-2`}
                                        variant="dark"
                                        onClick={() => {
                                            setSelectedId(key);
                                            setSelectedBook(books[key]);
                                            handleUpdateBookShow();
                                        }}>
                                        <MdEdit
                                            size={24}
                                            color={user ? '#24a0ed' : 'white'}
                                        />
                                    </Button>
                                    <Button
                                        variant="dark"
                                        className={`${styles.footerBtn} me-2`}
                                        onClick={() => {
                                            setSelectedId(key);
                                            setSelectedBook(books[key]);
                                            handleDeleteBookShow();
                                        }}>
                                        <MdOutlineDelete
                                            size={24}
                                            color={user ? '#c70000' : 'white'}
                                        />
                                    </Button>
                                </>
                            ) : (
                                <></>
                            )}
                            <Button
                                className={`${styles.footerBtn} ${
                                    !user ? 'ms-auto' : ''
                                }  me-2`}
                                variant="dark"
                                onClick={() => {
                                    view(key);
                                    handleOpenBook(key);
                                }}>
                                <MdOutlineOpenInNew size={24} />
                            </Button>
                        </Card.Footer>
                    </Card>
                ))}
            {user && (
                <Card
                    text="white"
                    border="dark"
                    className={styles.cardAdd}
                    onClick={handleAddBookShow}>
                    <Card.Body className={styles.cardAddBody}>
                        <BsPlusCircleDotted size={60} />
                    </Card.Body>
                </Card>
            )}
            <AddBook show={showAddBook} setShow={setShowAddBook} />
            {selectedBook && selectedId && (
                <UpdateBook
                    show={showUpdateBook}
                    setShow={setShowUpdateBook}
                    bookId={selectedId}
                    book={selectedBook}
                    setSelectedId={setSelectedId}
                    setSelectedBook={setSelectedBook}
                />
            )}
            {selectedBook && selectedId && (
                <DeleteBook
                    show={showDeleteBook}
                    setShow={setShowDeleteBook}
                    bookId={selectedId}
                    book={selectedBook}
                    setSelectedId={setSelectedId}
                    setSelectedBook={setSelectedBook}
                />
            )}
        </div>
    );
};

export default Books;
