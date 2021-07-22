
//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope 


    //begin script when window loads
    window.onload = setMap();
    
    //set up choropleth map
    function setMap(){
        //set variables for the size of the container for svg
        //map frame dimensions
        var width = 960,
            height = 460;
            
    
         //create container for the svg
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);
           
    
        //create Albers equal area conic projection centered on US

        var projection = d3.geoAlbers() //json is always lon/lat for x/y
            .center([0, 39.8]) //for conic, split center between center and rotate
            .rotate([-98.6, 0]) //center[39.8, -98.6]
            .parallels([29, 45])
            .scale(24000)
            .translate([width / 2, height / 2]); //centers in svg
            
        //path generator
        var path = d3.geoPath()
            .projection(projection); //one operator to pass projection generator as parameter
            console.log("this is the path: ", path);
        //use Promise.all to parallelize asynchronous data loading
        var promises = [];
        //data loading using the Promise.all(promises) generator
        promises.push(d3.csv("data/farm_data.csv")); //load attributes from csv
        promises.push(d3.json("data/other48.topojson")); //load background spatial data
        promises.push(d3.json("data/contig_48.topojson")); //load choropleth spatial data
        Promise.all(promises).then(callback);
        console.log("this is promises: ", promises);
        //Promise.all takes an iterable of promises as an input, returns 1 array
        //call back function will execute after all the data is loaded
    
        //callback function defined
        function callback(data){
            
            [csvData, usCountry, usStates] = data; //this is the data parameter that is passed to callback
            //the global variables declared above 
            console.log("this is the data: ", data); //csv and 2 topology arrays
             
            //place graticule on the map
            //setGraticule(map, path);
    
            //extract all the features as an array to be passed to .data() --> topo to geo
            var usWhole = topojson.feature(usCountry, usCountry.objects.other48),
                states48 = topojson.feature(usStates, usStates.objects.contig_48).features;
                console.log("this is the US: ", usWhole);
    
            //add the US to the map one datum
            var usBackground = map.append("path")
                .datum(usWhole)
                .attr("class", "usWhole")
                .attr("d", path);
               
            //join csv data to staets enumeration units
            states48 = joinData(states48, csvData);
    
            //create the color scale
            //var colorScale = makeColorScale(csvData);
    
            //add enumeration units to the map
            //setEnumerationUnits(franceRegions, map, path, colorScale);
    
            //add coordinated visualization to the map
            //setChart(csvData, colorScale);
    
            // dropdown
            //createDropdown(csvData);
    
        };
    }; //end of setMap()
    
    
    