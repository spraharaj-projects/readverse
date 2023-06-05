import { Route, Routes } from 'react-router-dom';
import './App.css';
import Page from './components/page/Page';
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Footer from './components/Footer';
import Books from './components/Books';
import Book from './components/Book';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';

function App() {
    const [query, setQuery] = useState('');
    const updateQuery = (newQuery) => {
        setQuery(newQuery);
    };

    return (
        <Container fluid className="d-flex flex-column h-100 p-0 app">
            <Row className="g-0 header-wrapper">
                <Col className="px-0">
                    <Header query={setQuery} />
                </Col>
            </Row>
            <Row className="flex-fill g-0">
                <Col className="px-0">
                    <main className="custom-scroll">
                        <Routes>
                            <Route path="/" element={<Books />} />
                            <Route
                                path="/:bookId"
                                element={<Book searchQuery={query} />}
                            />
                            <Route path="/:bookId/:pageId" element={<Page />} />
                        </Routes>
                    </main>
                </Col>
            </Row>
            <Row>
                <Col>
                    <footer className="fixed-bottom bg-light footer-wrapper">
                        <Footer />
                    </footer>
                </Col>
            </Row>
            <Tooltip id="h-tooltip" className="header-tooltip" />
            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="dark"
            />
        </Container>
    );
}

export default App;
