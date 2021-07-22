
//First line of main.js...wrap everything in a self-executing anonymous function to move to local scope 


    //begin script when window loads
    window.onload = setMap();
    
    //set up choropleth map
    function setMap(){
        
        //map frame dimensions
        var width = 960,
            height = 460;
    
        //create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);
    
        //create Albers equal area conic projection centered on France
        var projection = d3.geoAlbers()
            .center([0, 39.8])
            .rotate([-98.6, 0])
            .parallels([29, 45])
            .scale(24000)
            .translate([width / 2, height / 2]);
    
        var path = d3.geoPath()
            .projection(projection);
    
        //use Promise.all to parallelize asynchronous data loading
        var promises = [];
        promises.push(d3.csv("data/farm_data.csv")); //load attributes from csv
        promises.push(d3.json("data/other48.topojson")); //load background spatial data
        promises.push(d3.json("data/contig_48.topojson")); //load choropleth spatial data
        Promise.all(promises).then(callback);
    
        function callback(data){
            
            [csvData, usCountry, usStates] = data; //this is the data parameter that is passed to callback
            //the global variables declared above 
            console.log("this is the data: ", data); //csv and 2 topology arrays
        
    
    
            //place graticule on the map
            setGraticule(map, path);
    
            //translate europe TopoJSON
            var usWhole = topojson.feature(europe, europe.objects.EuropeCountries),
                states48 = topojson.feature(france, france.objects.FranceRegions).features;
    
            //add Europe countries to map
            var countries = map.append("path")
                .datum(europeCountries)
                .attr("class", "countries")
                .attr("d", path);
    
            //join csv data to GeoJSON enumeration units
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
    
    
    