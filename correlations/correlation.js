const offset = 16;
let dataIndex = 0;
const dataPointRadius = 4;

const rValues = ['-1.00', '-.50', '0', '.50', '1.00'];

const scope = [0, 20];

function render (dataIndex) {
    const svg = d3.select('#correlationPlot');
    if (svg.selectAll('.chartGroup').empty()) {
        svg.append('g')
            .attr('class', 'chartGroup')
            .attr('transform', `translate(${offset},${offset})`);
    }
    const g = svg.select('.chartGroup');
    const chartHeight = svg.node().getBoundingClientRect().height - (2 * offset);
    const chartWidth = svg.node().getBoundingClientRect().width - (2 * offset);

    const x = d3.scaleLinear()
    .domain(scope)
    .range([0, chartWidth]);

    const y = d3.scaleLinear()
        .domain(scope)
        .range([chartHeight, 0]);

    const sortedData = [...correlations[dataIndex]].sort((a, b) => {
        if (a[0] < b[0]) {
            return 1;
        }
        if (a[0] > b[0]) {
            return -1;
        }
        return 0;
    });

    // AXES

    const yAxis = g.selectAll('.yAxis')
        .data([chartHeight]);
    yAxis.enter()
        .append('line')
        .attr('class', 'yAxis axis')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .merge(yAxis)
        .attr('y2', height => height);
    yAxis.exit().remove();

    const xAxis = g.selectAll('.xAxis')
        .data([{height: chartHeight, width: chartWidth}]);
    xAxis.enter()
        .append('line')
        .attr('class', 'xAxis axis')
        .attr('x1', 0)
        .merge(xAxis)
        .attr('x2', d => d.width)
        .attr('y1', d => d.height)
        .attr('y2', d => d.height);
    xAxis.exit().remove();

    // DATA POINTS 

    const dataPoints = g.selectAll('.dataPoint')
        .data(sortedData);
    dataPoints.enter()
        .append('circle')
        .attr('class', 'dataPoint')
        .attr('r', dataPointRadius)
        .merge(dataPoints)
        .transition(500)
        .attr('cx', d => Math.round(x(d[0])))
        .attr('cy', d => Math.round(y(d[1])));
    dataPoints.exit().remove();

    // TEXT

    d3.select('#corApplet-coefficient')
        .text(`correlation coefficient: ${rValues[dataIndex]}`);
    
    d3.select('#corApplet-strength')
        .text(() => {
            if (dataIndex === 0 || dataIndex === 4) {
                return 'strong correlation';
            }
            if (dataIndex === 2) {
                return 'weak correlation';
            }
            return '';
        });
}

d3.select('#correlationSlider')
    .on('change', function (d) {
        dataIndex = Number(d3.select(this).node().value);
        render(dataIndex);
    })

render(dataIndex);

d3.select(window).on('resize', () => render(dataIndex));