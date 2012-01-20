# IdeosLineChart object

you instantiate the object by a 
var myobj = new IdeosLineChart(mysettings);

Here is a detailed settings object literal that can be passed in...

'''javascript

{
    container: 'linechart',     // the id of a canvas element on the page
	marginTop: 10,              // margins around what will be called the 'chartArea'
	marginRight: 10,
	marginBottom: 20,
	marginLeft: 30,
	datapoints: [
		{
			label: "Jan",
			value: 12
		},
		{
			label: "Feb",
			value: 28,
            tooltip: "April",
            markerSize: 4,
            markerColor:"#ffa",
            markerStrokeColor:"#f72",
            markerStrokeWidth:2,
            lineColor: "#070",
            lineWidth: 5
		},
		...
	],
	chartArea: {
		strokeWidth: 1,
		strokeStyle: "#aaa",
		fillStyle: "#fff",
		gridLines: {
			yCount: 6,
			lineColor: "#eee",
			lineWidth: 1,
			showValues: true
		}
	},
	maxValueGap: 0,
	displaceYOriginTo: 0,
	yRegions: [
        {
            color:"rgba(255,200,200,0.6)", 
            from:40, 
            to:60
        }
    ]
}

'''
