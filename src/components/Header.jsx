import React, { useState } from 'react';
import {
    Button,
    Container,
    Form,
    Image,
    Nav,
    NavDropdown,
    Navbar,
    Tooltip
} from 'react-bootstrap';
import logo from '../assets/icons/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import Login from './forms/Login';
import { FaUser } from 'react-icons/fa';
import styles from './styles/Header.module.css';
import UpdateProfile from './forms/UpdateProfile';

const Header = ({ updateQuery }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useSelector((state) => state.auth);
    const [showLogin, setShowLogin] = useState(false);
    const [showUpdateProfile, setShowUpdateProfile] = useState(false);
    const dispatch = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault();
        updateQuery(searchTerm);
    };

    const handleLoginToggle = () => {
        user ? dispatch(logout()) : setShowLogin(true);
    };

    const handleShowUpdateProfile = () => {
        setShowUpdateProfile(true);
    };

    return (
        <Navbar expand="lg" bg="dark" variant="dark" className={styles.navbar}>
            <Container fluid>
                <Link className="navbar-brand ms-3" to="/">
                    <Image src={logo} height='48px'/>
                    <span className={styles.headerTitle}>ReadVerse</span>
                </Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Form
                        className={styles.searchForm}
                        onSubmit={handleOnSubmit}>
                        <Button
                            className={styles.searchBtn}
                            variant="outline-success"
                            size="sm"
                            type="submit">
                            Search
                        </Button>
                        <Form.Control
                            className={styles.searchbar}
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form>
                    <Nav className="ms-auto">
                        {user ? (
                            <NavDropdown
                                title={
                                    <FaUser
                                        data-tooltip-id="h-tooltip"
                                        data-tooltip-content="Delete Page"
                                        data-tooltip-place="right"
                                        data-tooltip-variant="dark"
                                        color="#00CC99"
                                    />
                                }
                                menuVariant="dark"
                                // menuClassName={styles.userDropdown}
                                align="end">
                                <div className={styles.userMenu}>
                                    <Image
                                        className={styles.userImage}
                                        src="https://via.placeholder.com/200.jpg?text=No+Image+Available"
                                        alt="Profile Image"
                                        roundedCircle
                                    />
                                    <Button
                                        variant="dark"
                                        className={styles.userBtn}
                                        onClick={handleShowUpdateProfile}>
                                        Update Profile
                                    </Button>
                                    <Button
                                        variant="dark"
                                        className={styles.userBtn}
                                        onClick={handleLoginToggle}>
                                        Sign Out
                                    </Button>
                                </div>
                            </NavDropdown>
                        ) : (
                            <Nav.Link onClick={handleLoginToggle}>
                                Sign In
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <Login show={showLogin} setShow={setShowLogin} />
            {user && (
                <UpdateProfile
                    show={showUpdateProfile}
                    setShow={setShowUpdateProfile}
                    user={user}
                />
            )}
        </Navbar>
    );
};

export default Header;
