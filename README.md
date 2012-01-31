# IdeosChart object (base class, does not render)

## IdeosLineChart

var mychart = new IdeosLineChart(mysettings);

## IdeosBarChart

var mychart = new IdeosBarChart(mysettings);

mychart.render();

Here is a detailed settings object literal that can be passed in...

```javascript

{
    container: 'mychart',     // the id of a canvas element on the page
    marginTop: 10,              // margins around what will be called the 'chartArea'
	marginRight: 10,
	marginBottom: 20,
	marginLeft: 30,
	datapoints: [                       // datapoint array
		{                   
			label: "Jan",               // minumum properties needed
			value: 12
		},
		{                               // all used properties
			label: "Feb",               // datapoint label in x-axis
			value: 28,                  // datapoint value
            tooltip: "April",           // tooltip on hotspot hover
            markerSize: 4,              // used in linechart
            markerColor:"#ffa",         // used in linechart
            borderStrokeColor:"#f72",   // linechart: marker size; barchar: border size
            borderStrokeWidth:2,        // both line and bar charts
            color: "#070",              // line color | bar color
            lineWidth: 5                // used in linechart
		},
		...
	],
	chartArea: {
		strokeWidth: 1,                 // used for the rounded border
		strokeStyle: "#aaa",
		fillStyle: "#fff",
		gridLines: {
			yCount: 6,
			lineColor: "#eee",
			lineWidth: 1,
			showValues: true,
            useIncrements: false,       // making this true will not use yCount
            gap: 20                     // works with useIncrements
		}
	},
	maxValueGap: 0,                     // for creating a gap at the chartArea top
	displaceYOriginTo: 0,               // moves the origin of 0 in y-axis; can be used as 'minValueGap' concept
	yRegions: [                         // create y-axis colored areas
        {
            color:"rgba(255,200,200,0.6)", 
            from:40, 
            to:60
        }
    ],
    /* --events-- */
    hover: function (datapoint) {  },
    click: function (datapoint) {  }
}

```


