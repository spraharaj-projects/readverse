export const createBackground = (svg, width, height) => {
    //svg background: pattern
    const pattern = svg
        .append('defs')
        .append('pattern')
        .attr('id', 'dots')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 24)
        .attr('height', 24);
    pattern
        .append('circle')
        .attr('cx', 4)
        .attr('cy', 4)
        .attr('r', 1)
        .attr('fill', 'black');
    pattern
        .append('circle')
        .attr('cx', 16)
        .attr('cy', 16)
        .attr('r', 1)
        .attr('fill', 'black');
    svg.append('rect')
        .attr('x', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'grey');
    svg.append('rect')
        .attr('x', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'url(#dots)');

    return pattern;
};
