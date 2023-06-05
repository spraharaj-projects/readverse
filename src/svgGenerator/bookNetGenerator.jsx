import {
    forceCenter,
    forceCollide,
    forceLink,
    forceManyBody,
    forceSimulation,
    pointer,
    select,
    zoom
} from 'd3';
import {
    handleMouseoverNode,
    handleMouseoutNode,
    handleDrag,
    handleTextWrap,
    handleNodeClicked,
    handleSvgClicked,
    handleHeadertWrap
} from './eventHandlers';

import ReactDOM from 'react-dom/client';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaCog, FaSave, FaSyncAlt } from 'react-icons/fa';
import { getAgoTime } from '../utils/utilities';
import { MdEditDocument, MdPolyline } from 'react-icons/md';
import { createBackground } from './background';

/**
 *
 * Function that runs the BookNet generator and sets all necessary properties.
 * @param {Object} options - An object containing the following options:
 * @param {Object} svgContainerRef - A reference to the SVG container.
 * @param {Array} data - An array of nodes and their links.
 * @param {Object} styles - An object containing style properties.
 * @param {Boolean} isEdit - A flag indicating whether or not the generator is in edit mode.
 * @param {Function} setLinks - A function to set the links in the graph.
 * @param {Function} saveNewLink - A function to save a new link.
 * @param {Function} setEdit - A function to set the edit mode.
 * @param {Function} setSelectedPage - A function to set the selected page.
 * @param {Function} setSelectedId - A function to set the ID of the selected page.
 * @param {Function} handleAddPageShow - A function to handle the showing of the add page modal.
 * @param {Function} handleUpdatePageShow - A function to handle the showing of the update page modal.
 * @param {Function} handleDeletePageShow - A function to handle the showing of the delete page modal.
 * @param {Function} navigate - A function to handle navigation to different pages.
 * @param {Object} user - An object containing information about the current user.
 * @param {Function} handleRefreshPages - A function to refresh the pages.
 **/
export const runBookNetGenerator = ({
    svgContainerRef,
    data,
    styles,
    isEdit,
    setLinks,
    saveNewLink,
    setEdit,
    setSelectedPage,
    setSelectedId,
    handleAddPageShow,
    handleAddReferenceShow,
    handleUpdatePageShow,
    handleDeletePageShow,
    navigate,
    user,
    handleRefreshPages
}) => {
    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const height = containerRect.height;
    const width = containerRect.width;
    const nodesData = data.nodes.map((d) =>
        Object.assign({ width: 175, height: 120 }, d)
    );
    const linksData = data.links.map((d) => Object.assign({}, d));

    //simulation
    const simulation = forceSimulation()
        .nodes(nodesData)
        .force(
            'link',
            forceLink(linksData)
                .id((d) => d.id)
                .distance(220)
        )
        .force('collide', forceCollide().radius(100).iterations(4))
        .force('charge', forceManyBody().strength(-50))
        .force('center', forceCenter(width / 2, height / 2))
        .on('tick', ticked);

    //svg
    const svg = select(svgContainerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    createBackground(svg, width, height);

    const mainGroup = svg.append('g').attr('class', 'mainGroup');

    //svg links
    const linkGroup = mainGroup.append('g');
    const link = linkGroup
        .selectAll(styles.link)
        .data(linksData)
        .join('line')
        .attr('class', styles.link);

    //svg nodes
    const nodeGroup = mainGroup.append('g');
    const node = nodeGroup
        .selectAll(styles.node)
        .data(nodesData)
        .join('g')
        .attr('class', styles.node);
    const nodeBox = node.append('g').attr('class', styles.nodeBox);

    //nodes drop shadow
    const filter = svg
        .append('defs')
        .append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%');
    filter
        .append('feDropShadow')
        .attr('dx', '0')
        .attr('dy', '5')
        .attr('stdDeviation', '5')
        .attr('flood-color', 'rgba(0,0,0,0.5)');

    //nodes main box
    nodeBox
        .append('rect')
        .attr('x', (d) => -d.width / 2)
        .attr('y', (d) => -d.height / 2)
        .attr('width', (d) => d.width)
        .attr('height', (d) => d.height)
        .attr('rx', 5)
        .style('filter', 'url(#drop-shadow)');
    nodeBox
        .selectAll('rect')
        .filter((d) => d.refUrl)
        .attr('fill', 'silver');
    nodeBox
        .selectAll('rect')
        .filter((d) => d.cover)
        .attr('stroke-width', '5px');
    nodeBox
        .append('line')
        .attr('x1', (d) => -d.width / 2)
        .attr('y1', (d) => -d.height / 2 + d.height / 5)
        .attr('x2', (d) => d.width / 2)
        .attr('y2', (d) => -d.height / 2 + d.height / 5);
    nodeBox
        .append('line')
        .attr('x1', (d) => -d.width / 2)
        .attr('y1', (d) => d.height / 2 - 20)
        .attr('x2', (d) => d.width / 2)
        .attr('y2', (d) => d.height / 2 - 20);
    nodeBox
        .append('text')
        .attr('x', (d) => -d.width / 2 + 5)
        .attr('y', (d) => -d.height / 2 + 20)
        .attr('stroke-width', 1)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('data-width', (d) => d.width - 10)
        .attr('data-height', (d) => (1 * d.height) / 4 - 30)
        .attr('class', 'title')
        .text((d) => d.name)
        .call(handleHeadertWrap);
    nodeBox
        .append('text')
        .attr('x', (d) => -d.width / 2 + 10)
        .attr('y', (d) => -d.height / 2 + 40)
        .attr('stroke-width', 0.6)
        .attr('font-size', 10)
        .attr('fill', 'black')
        .attr('data-width', (d) => d.width - 20)
        .attr('data-height', (d) => (3 * d.height) / 4 - 30)
        .attr('class', 'description')
        .text((d) => d.shortDesc)
        .call(handleTextWrap);
    nodeBox
        .append('text')
        .attr('x', (d) => -d.width / 2 + 5)
        .attr('y', (d) => d.height / 2 - 8)
        .attr('stroke-width', 0.6)
        .attr('fill', 'black')
        .attr('font-size', 10)
        .attr('class', 'timeAgo')
        .text((d) => `Last updated ${getAgoTime(d.updatedOn)}`);

    //handle if no node is present
    if (!nodesData.length) {
        const noPageText = user
            ? isEdit
                ? "Click on the '+' sign (top right) to create new page."
                : 'Click on the node setting to enable add option.'
            : 'Please sign in to create new page.';
        const noPageTextGroup = svg
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 3})`);
        noPageTextGroup
            .append('rect')
            .attr('x', -300)
            .attr('y', -70)
            .attr('width', 600)
            .attr('height', 200)
            .attr('rx', 5)
            .attr('fill', 'white')
            .attr('opacity', 0.3);
        const noPageTextElement = noPageTextGroup
            .append('text')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('font-size', 40)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('class', 'empty-node-message');
        noPageTextElement.append('tspan').text('No Page Avialable!');
        noPageTextElement
            .append('tspan')
            .text(noPageText)
            .attr('font-size', 24)
            .attr('x', 0)
            .attr('dy', '2em');
    }

    //Left setting menu
    const setting = svg
        .append('g')
        .attr('class', styles.settingPanel)
        .attr('transform', 'translate(30, 20)');
    const settingContent = setting
        .append('foreignObject')
        .attr('width', 100)
        .attr('height', 270);
    const handleEditToggle = (mode) => {
        setEdit(mode);
    };
    ReactDOM.createRoot(settingContent.node()).render(
        <div className={styles.settingButtonsContainer}>
            <Button
                variant="dark"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Go Books Catalog"
                data-tooltip-place="right"
                className={styles.settingBtn}
                onClick={() => {
                    navigate(-1);
                }}>
                <FaArrowLeft />
            </Button>
            <Button
                variant="dark"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Refresh"
                data-tooltip-place="right"
                className={styles.settingBtn}
                onClick={handleRefreshPages}>
                <FaSyncAlt />
            </Button>
            {user ? (
                !isEdit ? (
                    <Button
                        variant="dark"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit Pages"
                        data-tooltip-place="right"
                        className={styles.settingBtn}
                        onClick={() => {
                            setEdit('node');
                        }}>
                        <FaCog />
                    </Button>
                ) : (
                    <Button
                        variant="dark"
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Save"
                        data-tooltip-place="right"
                        className={styles.settingBtn}
                        onClick={() => {
                            setEdit('');
                        }}>
                        <FaSave />
                    </Button>
                )
            ) : (
                <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Please Sign-in to Edit"
                    data-tooltip-place="right">
                    <Button
                        variant="dark"
                        className={styles.settingBtn}
                        disabled={true}>
                        <FaCog />
                    </Button>
                </div>
            )}
            <div
                data-tooltip-id={!isEdit ? 'my-tooltip' : ''}
                data-tooltip-content="Enable Edit Mode"
                data-tooltip-place="bottom"
                className={styles.editToggleWrapper}>
                <Button
                    variant="dark"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Node Edit"
                    data-tooltip-place="bottom"
                    onClick={() => {
                        handleEditToggle('node');
                    }}
                    disabled={!isEdit || isEdit === 'node'}>
                    <MdEditDocument />
                </Button>
                <Button
                    variant="dark"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Link Edit"
                    data-tooltip-place="bottom"
                    className={styles.editToggle}
                    onClick={() => {
                        handleEditToggle('link');
                    }}
                    disabled={!isEdit || isEdit === 'link'}>
                    <MdPolyline />
                </Button>
            </div>
        </div>
    );

    let isCircleClicked = false;
    if (user && isEdit) {
        const newNode = svg
            .append('g')
            .attr('class', styles.newNode)
            .attr('transform', `translate(${width - 130}, 70)`)
            .attr('data-tooltip-id', 'my-tooltip')
            .attr('data-tooltip-content', 'Add New Page')
            .attr('data-tooltip-place', 'bottom')
            .attr('data-tooltip-float', true)
            .attr('data-tooltip-offset', 50);

        newNode
            .append('rect')
            .attr('x', -100)
            .attr('y', -50)
            .attr('width', 200)
            .attr('height', 100)
            .attr('rx', 5);

        newNode
            .append('circle')
            .attr('r', 25)
            .attr('stroke-width', 2)
            .attr('opacity', 1)
            .attr('stroke-dasharray', '5 5')
            .attr('fill', 'none');
        newNode
            .append('text')
            .attr('y', -6)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size', '50px')
            .attr('cursor', 'pointer')
            .text('+');
        newNode
            .on('mouseover', () => {
                newNode
                    .transition()
                    .duration(200)
                    .attr(
                        'transform',
                        `translate(${width - 130}, 70) scale(1.2)`
                    );
            })
            .on('mouseout', () => {
                newNode
                    .transition()
                    .duration(200)
                    .attr(
                        'transform',
                        `translate(${width - 130}, 70) scale(1.1)`
                    );
            })
            .on('click', () => {
                handleAddPageShow();
            });

        const newRef = svg
            .append('g')
            .attr('class', styles.newNode)
            .attr('transform', `translate(${width - 130}, 190)`)
            .attr('data-tooltip-id', 'my-tooltip')
            .attr('data-tooltip-content', 'Add New Reference')
            .attr('data-tooltip-place', 'bottom')
            .attr('data-tooltip-float', true)
            .attr('data-tooltip-offset', 50);

        newRef.append('circle').attr('r', 50);

        newRef
            .append('circle')
            .attr('r', 25)
            .attr('stroke-width', 2)
            .attr('opacity', 1)
            .attr('stroke-dasharray', '5 5')
            .attr('fill', 'none');
        newRef
            .append('text')
            .attr('y', -6)
            .attr('fill', 'black')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size', '50px')
            .attr('cursor', 'pointer')
            .text('+');
        newRef
            .on('mouseover', () => {
                newRef
                    .transition()
                    .duration(200)
                    .attr(
                        'transform',
                        `translate(${width - 130}, 190) scale(1.2)`
                    );
            })
            .on('mouseout', () => {
                newRef
                    .transition()
                    .duration(200)
                    .attr(
                        'transform',
                        `translate(${width - 130}, 190) scale(1.1)`
                    );
            })
            .on('click', () => {
                handleAddReferenceShow();
            });

        svg.on('click', (e) => handleSvgClicked(e, styles));

        if (isEdit === 'link') {
            let line = null;
            let activeLink = null;
            let deleteLinkButton = null;
            let sourceId = null;
            let targetId = null;

            link.on('mouseover', (e) => {
                if (!activeLink) {
                    const target = select(e.currentTarget);
                    target.style('stroke-width', '10px');
                }
            });
            link.on('mouseout', (e) => {
                if (!activeLink) {
                    const target = select(e.currentTarget);
                    target.style('stroke-width', '5px');
                }
            });

            link.on('click', (event, d) => {
                activeLink = select(event.currentTarget);
                deleteLinkButton = svg.append('g');
                const deleteLink = deleteLinkButton
                    .append('rect')
                    .attr('x', (d.source.x + d.target.x) / 2 + 20)
                    .attr('y', (d.source.y + d.target.y) / 2 - 20)
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('rx', 3)
                    .attr('class', 'detele-link')
                    .style('fill', '#dc3545')
                    .style('stroke', '#dc3545')
                    .style('stroke-width', '2px');
                deleteLinkButton
                    .on('mouseover', (e) => {
                        select('.detele-link')
                            .style('fill', '#bd2130')
                            .style('stroke', '#bd2130');
                    })
                    .on('mouseout', (e) => {
                        select('.detele-link')
                            .style('fill', '#dc3545')
                            .style('stroke', '#dc3545');
                    });
                const box = deleteLink.node().getBBox();
                const xPadding = 4;
                deleteLinkButton
                    .append('line')
                    .attr('x1', box.x + xPadding)
                    .attr('y1', box.y + xPadding)
                    .attr('x2', box.x + box.width - xPadding)
                    .attr('y2', box.y + box.height - xPadding)
                    .style('stroke', 'white')
                    .style('stroke-width', '2px');
                deleteLinkButton
                    .append('line')
                    .attr('x1', box.x + xPadding)
                    .attr('y1', box.y + box.height - xPadding)
                    .attr('x2', box.x + box.width - xPadding)
                    .attr('y2', box.y + xPadding)
                    .style('stroke', 'white')
                    .style('stroke-width', '2px');
                deleteLinkButton.on('click', () => {
                    const newLinksData = linksData
                        .filter((link) => link.index !== d.index)
                        .map((link) => ({
                            source: link.source.id,
                            target: link.target.id
                        }));
                    saveNewLink({ links: newLinksData }, 'delete');
                    setLinks(newLinksData);
                });
            });

            const linkCircle = node
                .append('circle')
                .style('stroke', 'gray')
                .style('stroke-width', 2)
                .style('fill', 'white')
                .attr('r', 10)
                .attr('cx', (d) => -d.width / 2 - 2)
                .attr('cy', (d) => -d.height / 2 - 2)
                .on('mouseover', (e) => {
                    select(e.currentTarget)
                        .style('fill', '#5fdba7')
                        .style('stroke', 'black');
                })
                .on('mouseout', (e) => {
                    select(e.currentTarget)
                        .style('fill', 'white')
                        .style('stroke', 'gray');
                });

            svg.on('pointerdown', (e) => {
                const mousePos = pointer(e);

                if (deleteLinkButton) {
                    const deleteLink = deleteLinkButton.selectAll('rect');
                    const box = deleteLink.node().getBBox();
                    const x = mousePos[0];
                    const y = mousePos[1];
                    if (
                        x < box.x ||
                        x > box.x + box.width ||
                        y < box.y ||
                        y > box.y + box.height
                    ) {
                        deleteLinkButton.remove();
                        deleteLinkButton = null;
                        if (activeLink) {
                            activeLink.style('stroke-width', '5px');
                            activeLink = null;
                        }
                    }
                }

                linkCircle.each((d) => {
                    const distanceSource = Math.sqrt(
                        (mousePos[0] - (d.x - d.width / 2 - 2)) ** 2 +
                            (mousePos[1] - (d.y - d.height / 2 - 2)) ** 2
                    );
                    if (distanceSource <= 10) {
                        isCircleClicked = true;
                        sourceId = d.id;
                    }
                });

                if (sourceId) {
                    line = svg
                        .append('line')
                        .attr('x1', mousePos[0])
                        .attr('y1', mousePos[1])
                        .attr('x2', mousePos[0])
                        .attr('y2', mousePos[1])
                        .style('stroke', '#0077be')
                        .style('stroke-width', 3);
                }
            });

            svg.on('pointermove', (event) => {
                if (line) {
                    const mousePos = pointer(event);
                    const x2 = mousePos[0];
                    const y2 = mousePos[1];
                    line.attr('x2', x2).attr('y2', y2);
                }
            });
            svg.on('pointerup', () => {
                isCircleClicked = false;
                if (line) {
                    linkCircle.each((d) => {
                        const distanceTarget = Math.sqrt(
                            (line.attr('x2') - (d.x - d.width / 2 - 2)) ** 2 +
                                (line.attr('y2') - (d.y - d.height / 2 - 2)) **
                                    2
                        );
                        if (distanceTarget <= 10) {
                            targetId = d.id;
                        }
                    });
                    let newLinksData = [...data.links];
                    if (sourceId && targetId && sourceId !== targetId) {
                        var contains = newLinksData.some((link) => {
                            return (
                                (link.source === sourceId &&
                                    link.target === targetId) ||
                                (link.source === targetId &&
                                    link.target === sourceId)
                            );
                        });
                        const newLink = { source: sourceId, target: targetId };
                        if (!contains) {
                            newLinksData.push(newLink);
                            saveNewLink({ links: newLinksData }, 'add');
                            setLinks(newLinksData);
                        }
                    }
                    line.remove();
                    line = null;
                    sourceId = null;
                    targetId = null;
                }
            });
        } else {
            node.on('click', (e, d) => {
                handleNodeClicked({
                    e,
                    d,
                    styles,
                    nodes: data.nodes,
                    setSelectedId,
                    setSelectedPage,
                    handleUpdatePageShow,
                    handleDeletePageShow,
                    navigate
                });
            });
        }
    } else {
        node.on('click', (e, d) => {
            d.refUrl ? navigate(d.refUrl) : navigate(`${d.id}?view=preview`);
        });
    }

    //nodes events
    nodeBox
        .on('mouseover', (e) => {
            handleMouseoverNode(e, isEdit);
        })
        .on('mouseout', (e) => {
            handleMouseoutNode(e, isEdit);
        });
    node.call(handleDrag(simulation));
    const zoomBehavior = zoom().scaleExtent([1, 3]).on('zoom', zoomed);
    svg.call(zoomBehavior);
    function zoomed(event) {
        if (!isCircleClicked) {
            mainGroup.attr('transform', event.transform);
        }
    }

    function ticked() {
        link.attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);

        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    return {
        svg: svg,
        simulation: simulation
    };
};
