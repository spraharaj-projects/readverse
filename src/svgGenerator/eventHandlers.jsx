import { drag, select, selectAll } from 'd3';
import ReactDOM from 'react-dom/client';
import { Button } from 'react-bootstrap';
import { MdEdit, MdOutlineDelete, MdOutlineOpenInNew } from 'react-icons/md';

/**
 * Returns a D3 drag behavior that can be used to drag nodes in a simulation.
 *
 * @param {Simulation} simulation - The D3 simulation to use for dragging.
 * @returns {Function} A D3 drag behavior.
 */
export const handleDrag = (simulation) => {
    const dragStarted = (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };

    const dragged = (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
    };

    const dragEnded = (e, d) => {
        if (!e.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    return drag()
        .filter(function (event) {
            // Ignore drag events on circles
            return event.target.nodeName !== 'circle';
        })
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
};

/**
 * Handles a mouseover event on a node in the graph.
 *
 * @param {MouseEvent} e - The mouse event.
 * @param {string} isEdit - Whether or not the node is being edited.
 */
export const handleMouseoverNode = (e, isEdit) => {
    // Get a selection for the target node
    const target = select(e.currentTarget);

    // Change the stroke of all non-text child elements to cyan
    target
        .selectAll('*')
        .filter((_, index, nodes) => {
            return (
                nodes[index].nodeName === 'rect' ||
                nodes[index].nodeName === 'line'
            );
        })
        .transition()
        .duration(200)
        .attr('stroke', 'cyan');

    // If the node isn't being edited as a link, scale it up
    if (isEdit !== 'link')
        target.transition().duration(500).attr('transform', 'scale(1.2)');
};

/**
 * Handles a mouseout event on a node in the graph.
 *
 * @param {MouseEvent} e - The mouse event.
 * @param {string} isEdit - Whether or not the node is being edited.
 */
export const handleMouseoutNode = (e, isEdit) => {
    // Get a selection for the target node
    const target = select(e.currentTarget);

    // Reset the stroke color to black
    target
        .selectAll('*')
        .filter((_, index, nodes) => {
            return (
                nodes[index].nodeName === 'rect' ||
                nodes[index].nodeName === 'line'
            );
        })
        .transition()
        .duration(200)
        .attr('stroke', 'black');

    // If the node isn't being edited as a link, scale it back down
    if (isEdit !== 'link')
        target.transition().duration(200).attr('transform', 'scale(1)');
};

/**
 *
 * This function is used to wrap text within an SVG element based
 * on its defined width and height. It operates on a selection of
 * SVG text elements and wraps the text within each element to fit
 * within the given rectangle dimensions.
 *
 * @param {object} selection - D3 selection of SVG text elements to be wrapped.
 */
export const handleTextWrap = (selection) => {
    selection.each(function () {
        // Get the current SVG text element
        const node = select(this);

        // Get the rectangle width, height, font size, x, and y attributes
        const rectWidth = +node.attr('data-width');
        const rectHeight = +node.attr('data-height');
        const fontSize = +node.attr('font-size');
        const x = +node.attr('x');
        const y = +node.attr('y');

        // Split the text content into an array of words
        const words = node.text().split(/\s+/).reverse();

        // Initialize variables for wrapping the text
        let line = [];
        let lineNumber = 0;
        let tspan = node.text(null).append('tspan').attr('x', x).attr('y', y);

        // Loop through each word and wrap the text as necessary
        while (words.length) {
            let word = words.pop();
            line.push(word);
            tspan.text(line.join(' '));
            const tspanLength = tspan.node().getComputedTextLength();

            if (tspanLength > rectWidth) {
                lineNumber += 1;
                line.pop();
                if ((lineNumber + 1) * fontSize > rectHeight) {
                    // If the current line exceeds the rectangle width,
                    // wrap the line
                    if (
                        tspan
                            .text(line.join(' ') + ' ...')
                            .node()
                            .getComputedTextLength() > rectWidth
                    ) {
                        line.pop();
                    }

                    // If the wrapped text exceeds the rectangle height,
                    // truncate the text with ellipses
                    tspan.text(line.join(' ') + ' ...');
                    break;
                } else tspan.text(line.join(' '));

                // Create a new tspan for the wrapped text
                line = [word];
                tspan = node
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y + lineNumber * fontSize)
                    .text(word);
            }
        }
    });
};

export const handleHeadertWrap = (selection) => {
    selection.each(function () {
        // Get the current SVG text element
        const node = select(this);

        // Get the rectangle width, height, font size, x, and y attributes
        const rectWidth = +node.attr('data-width');
        const rectHeight = +node.attr('data-height');
        const fontSize = +node.attr('font-size');
        const x = +node.attr('x');
        const y = +node.attr('y');

        // Split the text content into an array of words
        const words = node.text().split('').reverse();
        // Initialize variables for wrapping the text
        let line = [];
        let lineNumber = 0;
        let tspan = node.text(null).append('tspan').attr('x', x).attr('y', y);

        // Loop through each word and wrap the text as necessary
        while (words.length) {
            let word = words.pop();
            line.push(word);
            tspan.text(line.join(''));
            const tspanLength = tspan.node().getComputedTextLength();

            if (tspanLength > rectWidth) {
                lineNumber += 1;
                line.pop();
                if ((lineNumber + 1) * fontSize > rectHeight) {
                    // If the current line exceeds the rectangle width,
                    // wrap the line
                    if (
                        tspan
                            .text(line.join(''))
                            .node()
                            .getComputedTextLength() > rectWidth
                    ) {
                        line.pop();
                    }

                    // If the wrapped text exceeds the rectangle height,
                    // truncate the text with ellipses
                    tspan.text(line.join(''));
                    break;
                } else tspan.text(line.join(''));

                // Create a new tspan for the wrapped text
                line = [word];
                tspan = node
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y + lineNumber * fontSize)
                    .text(word);
            }
        }
    });
};

let selectedNode = null;

/**
 *
 * Handles the click event on a node in the graph.
 * @param {Event} e - The click event.
 * @param {Object} d - The data associated with the clicked node.
 * @param {Object} styles - The object containing CSS class names for the graph.
 * @param {Array} nodes - The array of nodes in the graph.
 * @param {Function} setSelectedId - The function to set the selected node ID.
 * @param {Function} setSelectedPage - The function to set the selected page.
 * @param {Function} handleUpdatePageShow - The function to handle updating
 *                                          the book data.
 * @param {Function} handleDeletePageShow - The function to handle
 *                                           deleting the book data.
 * @param {Function} navigate - The function to navigate to a new page.
 */
export const handleNodeClicked = ({
    e,
    d,
    styles,
    nodes,
    setSelectedId,
    setSelectedPage,
    handleUpdatePageShow,
    handleDeletePageShow,
    navigate
}) => {
    let clickedNode = select(e.target).node();
    while (
        clickedNode &&
        !clickedNode.classList?.contains(styles.node) &&
        !clickedNode.classList?.contains('panel')
    ) {
        clickedNode = clickedNode.parentNode;
    }
    if (!clickedNode?.classList?.contains('panel'))
        selectAll('.panel').remove();
    if (selectedNode !== d) {
        selectedNode = d;

        // Create a panel with buttons for interacting with the node.
        const panel = select(e.currentTarget)
            .append('g')
            .attr(
                'transform',
                (d) => `translate(${d.width / 2 + 15}, ${-d.height / 2 - 30})`
            )
            .attr('class', 'panel');

        const panelContent = panel
            .append('foreignObject')
            .attr('width', 50)
            .attr('height', 150)
            .attr('x', 5)
            .attr('y', 5);

        // Render the React component for the panel content.
        ReactDOM.createRoot(panelContent.node()).render(
            <div className={styles.panel}>
                <span>
                    <div className={styles.panelBox}>
                        <Button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Open Page"
                            data-tooltip-place="right"
                            data-tooltip-variant="dark"
                            variant="dark"
                            size="sm"
                            className={`${styles.panelBtn} panel-button`}
                            onClick={(e) => {
                                handlePageOpen(d.id, navigate);
                            }}>
                            <MdOutlineOpenInNew size={20} />
                        </Button>
                        <Button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Edit Page"
                            data-tooltip-place="right"
                            data-tooltip-variant="dark"
                            variant="dark"
                            size="sm"
                            className={styles.panelBtn}
                            onClick={() =>
                                handleEditOrDeletePage(
                                    d.id,
                                    nodes,
                                    setSelectedPage,
                                    setSelectedId,
                                    handleUpdatePageShow
                                )
                            }>
                            <MdEdit size={20} color="#24a0ed" />
                        </Button>
                        <Button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Delete Page"
                            data-tooltip-place="right"
                            data-tooltip-variant="dark"
                            variant="dark"
                            size="sm"
                            className={styles.panelBtn}
                            onClick={() =>
                                handleEditOrDeletePage(
                                    d.id,
                                    nodes,
                                    setSelectedPage,
                                    setSelectedId,
                                    handleDeletePageShow
                                )
                            }>
                            <MdOutlineDelete size={20} color="#c70000" />
                        </Button>
                        <Button
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="Delete Page"
                            data-tooltip-place="right"
                            data-tooltip-variant="dark"
                            variant="dark"
                            size="sm"
                            className={styles.panelBtn}
                            onClick={() =>
                                handleEditOrDeletePage(
                                    d.id,
                                    nodes,
                                    setSelectedPage,
                                    setSelectedId,
                                    handleDeleteBookShow
                                )
                            }>
                            <MdOutlineDelete size={20} color="#c70000" />
                        </Button>
                    </div>
                </span>
            </div>
        );
    } else {
        // Check if clicked node is not the panel
        if (!clickedNode?.classList?.contains('panel')) {
            // Set selectedNode to null
            selectedNode = null;
        }
    }

    // Loop through parent nodes until a node with class styles.node is found
    while (clickedNode && !clickedNode.classList?.contains(styles.node)) {
        clickedNode = clickedNode.parentNode;
    }

    // Select the found node and bring it to the top of the drawing order
    select(clickedNode).raise();
};

/**
 *
 * Opens the page with the given ID in preview mode.
 * @param {string} pageId - The ID of the page to open.
 * @param {function} navigate - The function to navigate to the specified page.
 */
const handlePageOpen = (pageId, navigate) => {
    navigate(`${pageId}?view=preview`);
};

/**
 *
 * Function that handles the action of editing or deleting a page.
 * @param {string} pageId - The ID of the page to edit or delete.
 * @param {Array} nodes - An array of all the nodes in the graph.
 * @param {Function} setSelectedPage - A function to set the selected page.
 * @param {Function} setSelectedId - A function to set the ID of
 *                                   the selected page.
 * @param {Function} handleShow - A function to handle the showing of the edit
 *                                 or delete page modal.
 */
const handleEditOrDeletePage = (
    pageId,
    nodes,
    setSelectedPage,
    setSelectedId,
    handleShow
) => {
    const page = nodes.find((node) => node.id === pageId);
    setSelectedId(pageId);
    setSelectedPage(page);
    handleShow();
};

/**
 *
 * Handles the click event on the SVG element.
 * Removes any open panel and resets the selected node if the click is not on
 * a node or a panel.
 *
 * @param {Object} e - The click event object
 * @param {Object} styles - The styles object for the nodes
 */
export const handleSvgClicked = (e, styles) => {
    let clickedNode = select(e.target).node();
    let clickedPanel = select(e.target).node();

    // Traverse the DOM tree to find the clicked node or panel
    while (
        clickedNode &&
        clickedNode.nodeName !== 'svg' &&
        !clickedNode.classList?.contains(styles.node)
    ) {
        clickedNode = clickedNode.parentNode;
    }
    while (
        clickedPanel &&
        clickedPanel.nodeName !== 'svg' &&
        !clickedPanel.classList?.contains('panel')
    ) {
        clickedPanel = clickedPanel.parentNode;
    }

    // If the click is not on a node or a panel, remove any open panel
    // and reset the selected node
    if (
        !clickedNode?.classList.contains(styles.node) &&
        !clickedPanel?.classList.contains('panel')
    ) {
        selectAll('.panel').remove();
        selectedNode = null;
    }
};
