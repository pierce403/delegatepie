console.log("oh hi");

function refresh()
{
    console.log("neat");
  
    var w = 410,                        //width
    h = 410,                            //height
    r = 200,                            //radius
    color = d3.scale.category20c();     //builtin range of colors

    total_needed = 2383;
    total_supers = 718;
    
    bernie = 1881;
    bernie_supers = 49;
    hillary = 2800;
    hillary_supers = 581;
    
    if (typeof(window.sanders) != "undefined")bernie=window.sanders;
    if (typeof(window.sanders_supers) != "undefined")bernie_supers=window.sanders_supers;
    if (typeof(window.clinton) != "undefined")hillary=window.clinton;
    if (typeof(window.clinton_supers) != "undefined")hillary_supers=window.clinton_supers;
    
    remaining_supers = total_supers-bernie_supers-hillary_supers;
    
    required_supers = total_needed-bernie-bernie_supers;
    percent_requirement = (required_supers/total_supers)*100;
    percent_current = (bernie_supers/total_supers)*100
    
    document.getElementById("winning").innerHTML = "Bernie needs "+required_supers+", or "+percent_requirement.toFixed(2)+"% of the<br>superdelegates to win the nomination.<br>He currently has "+bernie_supers+", or "+percent_current.toFixed(2)+"%";

    data = [{"label":"Bernie ("+bernie_supers+")", "value":bernie_supers},
            {"label":"Hillary ("+hillary_supers+")", "value":hillary_supers}, 
            {"label":"Remaining ("+remaining_supers+")", "value":remaining_supers}];
    
    $("#chart").html("");
    var vis = d3.select("#chart")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);
    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
}

$.getJSON('http://cors.io/?u=http://www.realclearpolitics.com/json/ap_results/2016_primaries/superdelegates.json',
function(data)
{
  window.sanders = data.delegates.sanders-data.superdelegates.sanders;
  console.log("Sanders has "+window.sanders);
  window.clinton = data.delegates.clinton-data.superdelegates.clinton
  console.log("Clinton has "+window.clinton);
  refresh();
});
refresh();
