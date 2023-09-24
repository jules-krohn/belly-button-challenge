
// Place url in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // get sample names
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

    // Build the initial plots
        createMetadata(sample_one);
        createBarChart(sample_one);
        createBubbleChart(sample_one);


    });
};
// Function to change data based on dropdown selection
function optionChanged(value) {
    { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};
    
}


// Populate metadata info
function createMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function to create bar chart
function createBarChart(sample) {
    //retrieve data
    d3.json(url).then((data) => {
        // retrieve data for chart
        let bardata = data.samples 
        // filter by sample id
        let barArray = bardata.filter(sampleObject => sampleObject.id == sample);
        //get first indext of array
        let result = barArray[0];
        // get values for chart: otu_ids for labels, otu_labels for hovertext
        let sample_values = result.sample_values;
        let otu_ids = result.otu_ids
        let otu_labels = result.otu_labels

        // set the top 10 items to display
        let yticks = otu_ids.slice(0,10). map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // put data together to create the chart
        let trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
            
        };
        
        // layout
        let layout = {
            title: 'Top 10 OTUs per Individual',
            showlegend: false,
            yaxis: {title: 'OTU (Operational Taxonomic Unit) ID' }  
        };
        // Plotly plots the buildBarChart
        Plotly.newPlot("bar", [trace1], layout)
    });
};

// Function that builds the bubble chart
function createBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve chart data
        let bubbleData = data.samples;

        // Filter based on the sample
        let bubbleArray = bubbleData.filter(sampleObject => sampleObject.id == sample);
        let result = bubbleArray[0];

        // Set the chart parameters
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Picnic"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Culture Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });

};

    
// Call the initialize function
init();
