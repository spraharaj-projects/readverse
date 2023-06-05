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
                            onClick={() => {
                                handleButtonsClick('BOLD');
                            }}>
                            <FaBold />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('ITALIC');
                            }}>
                            <FaItalic />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('STRIKETHROUGH');
                            }}>
                            <FaStrikethrough />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('UNDERLINE');
                            }}>
                            <FaUnderline />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('HR');
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
                                onClick={() => {
                                    handleButtonsClick('TITLE1');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 24 }}
                                onClick={() => {
                                    handleButtonsClick('TITLE2');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 22 }}
                                onClick={() => {
                                    handleButtonsClick('TITLE3');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 20 }}
                                onClick={() => {
                                    handleButtonsClick('TITLE4');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                style={{ fontSize: 18 }}
                                onClick={() => {
                                    handleButtonsClick('TITLE5');
                                }}>
                                Title
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('TITLE6');
                                }}>
                                Title
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <ButtonGroup size="sm">
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('LINK');
                            }}>
                            <FaLink />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('QUOTE');
                            }}>
                            <FaQuoteRight />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('CODE');
                            }}>
                            <FaCode />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('COMMENT');
                            }}>
                            <BiCommentDetail />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('IMAGE');
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
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK');
                                }}>
                                General
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK-PY');
                                }}>
                                Python
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK-JAVA');
                                }}>
                                Java
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK-HTML');
                                }}>
                                HTML
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK-CSS');
                                }}>
                                CSS
                            </Dropdown.Item>
                            <Dropdown.Item
                                as={Button}
                                variant="light"
                                onClick={() => {
                                    handleButtonsClick('CODEBLOCK-JS');
                                }}>
                                JS
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <ButtonGroup size="sm">
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('UOLIST');
                            }}>
                            <FaListUl />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('ORLIST');
                            }}>
                            <FaListOl />
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => {
                                handleButtonsClick('CHECKLIST');
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
                            setEditable(false);
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
