import React from 'react';
import { Button, ButtonGroup, Dropdown, Spinner, Stack } from 'react-bootstrap';
import { BiCodeCurly, BiCommentDetail } from 'react-icons/bi';
import {
    FaBold,
    FaCode,
    FaEdit,
    FaItalic,
    FaLink,
    FaListOl,
    FaListUl,
    FaQuoteRight,
    FaRegImage,
    FaStrikethrough,
    FaTasks,
    FaUnderline,
    FaSave,
    FaArrowLeft
} from 'react-icons/fa';
import { MdHorizontalRule, MdTitle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Page.module.css';

const PageHeader = ({
    user,
    isSaving,
    editable,
    title,
    setEditable,
    handleButtonsClick,
    handleUpload
}) => {
    const navigate = useNavigate();

    return (
        <Stack direction="horizontal" gap={3} className={styles.header}>
            <ButtonGroup size="sm">
                <Button
                    variant="dark"
                    onClick={() => {
                        navigate(-1);
                    }}>
                    <FaArrowLeft />
                </Button>
            </ButtonGroup>
            <h2 style={{ backgroundColor: '#ffffffaa' }}>{title}</h2>
            {user && editable ? (
                <>
                    <ButtonGroup size="sm">
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'BOLD');
                            }}>
                            <FaBold />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'ITALIC');
                            }}>
                            <FaItalic />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'STRIKETHROUGH');
                            }}>
                            <FaStrikethrough />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'UNDERLINE');
                            }}>
                            <FaUnderline />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'HR');
                            }}>
                            <MdHorizontalRule />
                        </Button>
                    </ButtonGroup>
                    <Dropdown size="sm">
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            <MdTitle />
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 26 }}
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE1');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 24 }}
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE2');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 22 }}
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE3');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 20 }}
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE4');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 18 }}
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE5');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'TITLE6');
                                }}>
                                Title
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <ButtonGroup size="sm">
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'LINK');
                            }}>
                            <FaLink />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'QUOTE');
                            }}>
                            <FaQuoteRight />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'CODE');
                            }}>
                            <FaCode />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'COMMENT');
                            }}>
                            <BiCommentDetail />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'IMAGE');
                            }}>
                            <FaRegImage />
                        </Button>
                    </ButtonGroup>

                    <Dropdown size="sm">
                        <Dropdown.Toggle variant="dark" id="dropdown-basic">
                            <BiCodeCurly />
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="dark">
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK');
                                }}>
                                General
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK-PY');
                                }}>
                                Python
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK-JAVA');
                                }}>
                                Java
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK-HTML');
                                }}>
                                HTML
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK-CSS');
                                }}>
                                CSS
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={(e) => {
                                    handleButtonsClick(e, 'CODEBLOCK-JS');
                                }}>
                                JS
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <ButtonGroup size="sm">
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'UOLIST');
                            }}>
                            <FaListUl />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'ORLIST');
                            }}>
                            <FaListOl />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                handleButtonsClick(e, 'CHECKLIST');
                            }}>
                            <FaTasks />
                        </Button>
                    </ButtonGroup>
                </>
            ) : (
                <></>
            )}
            <ButtonGroup size="sm" className="ms-auto">
                {!editable ? (
                    <Button
                        variant="dark"
                        onClick={() => {
                            setEditable(true);
                        }}
                        disabled={!user}>
                        <FaEdit />
                    </Button>
                ) : (
                    <Button
                        variant="dark"
                        onClick={() => {
                            handleUpload();
                        }}
                        disabled={isSaving}>
                        {isSaving ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <FaSave />
                        )}
                    </Button>
                )}
            </ButtonGroup>
        </Stack>
    );
};

export default PageHeader;
