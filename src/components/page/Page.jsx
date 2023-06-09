import { useEffect, useState, useRef } from 'react';
import { db, storage } from '../../firebase/FirebaseSetup';
import { ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import Spinner from '../Spinner';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageHeader from './PageHeader';
import { Nav } from 'react-bootstrap';
import { addPlaceholder, getToc } from '../../utils/utilities';
import DOMPurify from 'dompurify';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/Page.module.css';
import './Page.css';
import { BsCaretRightFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';

const Page = () => {
    const [originalMarkdown, setOriginalMarkdown] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [searchParams] = useSearchParams();
    const [editable, setEditable] = useState(
        searchParams.get('view') === 'edit'
    );
    const { bookId, pageId } = useParams();
    const { user, pages } = useSelector((state) => {
        const user = state.auth.user;
        const pages = state.pages.pages;
        return { user: user, pages: pages };
    });
    const [isSaving, setIsSaving] = useState(false);
    const [pageData, setPageData] = useState(null);
    const [toc, setToc] = useState([]);
    const editorRef = useRef(null);
    const previewRef = useRef(null);
    const tocRef = useRef(null);
    const observerRef = useRef(null);

    const handleButtonsClick = (type) => {
        if (!editorRef.current) {
            return;
        }
        const textarea = editorRef.current;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const newMarkdown = addPlaceholder(type, markdown, startPos, endPos);
        setMarkdown(newMarkdown);
    };

    const handleUpload = () => {
        setIsSaving(true);
        if (markdown !== originalMarkdown) {
            const fileRef = ref(storage, `${bookId}/${pageId}.md`);
            const metadata = { contentType: 'text/markdown' };
            const blob = new Blob([markdown], { type: 'text/markdown' });
            uploadBytes(fileRef, blob, metadata)
                .then(() => {
                    toast.success(`${pageData.name} updated successfully`);
                    setOriginalMarkdown(markdown);
                    setToc(getToc(markdown));
                })
                .catch((error) => {
                    toast.error('Unable to update. Error: ' + error.message);
                })
                .finally(setIsSaving(false));
        } else {
            setIsSaving(false);
        }
    };

    const handleEditorScroll = () => {
        const editorElement = editorRef.current;
        const previewElement = previewRef.current;
        const scrollPercent =
            editorElement.scrollTop /
            (editorElement.scrollHeight - editorElement.clientHeight);
        const newScrollTop =
            scrollPercent *
            (previewElement.scrollHeight - previewElement.clientHeight);
        const scrollThreshold = 10;
        if (Math.abs(previewElement.scrollTop - newScrollTop) > scrollThreshold)
            previewElement.scrollTop = newScrollTop;
    };

    const handlePreviewScroll = () => {
        if (editorRef.current) {
            const editorElement = editorRef.current;
            const previewElement = previewRef.current;
            const scrollPercent =
                previewElement.scrollTop /
                (previewElement.scrollHeight - previewElement.clientHeight);
            const newScrollTop =
                scrollPercent *
                (editorElement.scrollHeight - editorElement.clientHeight);
            const scrollThreshold = 10;
            if (
                Math.abs(editorElement.scrollTop - newScrollTop) >
                scrollThreshold
            )
                editorElement.scrollTop = newScrollTop;
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Tab' && !event.ctrlKey) {
            event.preventDefault();
            // Insert two spaces at the current cursor position
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            setMarkdown(
                markdown.substring(0, start) + '\t' + markdown.substring(end)
            );
            event.target.setSelectionRange(start + 1, start + 1);
        }
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        section.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const bookRef = doc(db, 'books', bookId);
        const pageRef = doc(bookRef, 'pages', pageId);
        getDoc(pageRef).then((pageSnapshot) => {
            const page = pageSnapshot.data();
            axios
                .get(page.mdUrl, { responseType: 'text' })
                .then((res) => {
                    setPageData(page);
                    setMarkdown(res?.data.replaceAll('\r', ''));
                    setOriginalMarkdown(res?.data.replaceAll('\r', ''));
                    setToc(getToc(res?.data.replaceAll('\r', '')));
                    document.title = `${page.name} | ReadVerse | Lumindrix`;
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        });
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const ele = tocRef.current.querySelectorAll(
                            `#${entry.target.id}-toc`
                        );
                        ele[0].classList.add(styles.activeToc);
                    } else {
                        const ele = tocRef.current.querySelectorAll(
                            `#${entry.target.id}-toc`
                        );
                        ele[0].classList.remove(styles.activeToc);
                    }
                });
            },
            {
                root: previewRef.current,
                rootMargin: '0% 0px 0% 0px',
                threshold: 1
            }
        );
    }, []);

    useEffect(() => {
        if (!toc.length || !previewRef.current || !tocRef.current) return;
        const headerIds = toc.map((header) => `#${header.id}`);

        const headers = previewRef.current.querySelectorAll(
            headerIds.join(', ')
        );

        headers.forEach((header) => {
            observerRef.current.observe(header);
        });

        return () => {
            headers.forEach((header) => observerRef.current.unobserve(header));
            observerRef.current.disconnect();
        };
    }, [toc, editable]);

    return markdown === '' ? (
        <Spinner />
    ) : (
        <div className={styles.page}>
            <PageHeader
                user={user}
                isSaving={isSaving}
                editable={editable}
                title={pageData.name}
                setEditable={setEditable}
                handleButtonsClick={handleButtonsClick}
                handleUpload={handleUpload}
            />

            <div className={styles.content}>
                {editable ? (
                    <textarea
                        className={styles.editor}
                        ref={editorRef}
                        value={markdown}
                        onChange={(e) => {
                            setMarkdown(e.target.value);
                        }}
                        onScroll={handleEditorScroll}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <div className={styles.toc}>
                        <div className={`${styles.tocList}`}>
                            <Nav ref={tocRef} className={styles.tocNav}>
                                {toc.map(({ id, line, text, level }) => (
                                    <Nav.Link
                                        key={id}
                                        id={`${id}-toc`}
                                        level={level}
                                        className={styles.tocLink}
                                        style={{
                                            paddingLeft: `${level * 20}px`
                                        }}
                                        onClick={() => {
                                            scrollToSection(id);
                                        }}>
                                        <BsCaretRightFill className="me-3" />
                                        {text}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        </div>
                    </div>
                )}
                <div
                    ref={previewRef}
                    className={styles.previewContainer}
                    onScroll={handlePreviewScroll}>
                    <ReactMarkdown
                        className={styles.preview}
                        escapeHtml={false}
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        children={DOMPurify.sanitize(markdown)}
                        components={{
                            code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                            }) {
                                const match = /language-(\w+)/.exec(
                                    className || ''
                                );
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        {...props}
                                        children={String(children).replace(
                                            /\n$/,
                                            ''
                                        )}
                                        style={okaidia}
                                        language={match[1]}
                                        PreTag="div"
                                    />
                                ) : (
                                    <code {...props} className={className}>
                                        {children}
                                    </code>
                                );
                            },
                            h1({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h1 {...props} id={header?.id}>
                                        {children}
                                    </h1>
                                );
                            },
                            h2({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h2 {...props} id={header?.id}>
                                        {children}
                                    </h2>
                                );
                            },
                            h3({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h3 {...props} id={header?.id}>
                                        {children}
                                    </h3>
                                );
                            },
                            h4({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h4 {...props} id={header?.id}>
                                        {children}
                                    </h4>
                                );
                            },
                            h5({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h5 {...props} id={header?.id}>
                                        {children}
                                    </h5>
                                );
                            },
                            h6({ node, children, ...props }) {
                                const header = toc.find((header) => {
                                    return (
                                        header.line ===
                                            node.position.start.line &&
                                        header.text === children[0]
                                    );
                                });
                                return (
                                    <h6 {...props} id={header?.id}>
                                        {children}
                                    </h6>
                                );
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;
