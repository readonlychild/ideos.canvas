function IdeosChart(settings) {
    
    this.settings = $.extend({
        container: 'linechart',
		width: 300, height: 200,
		marginTop: 10,
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
				value: 28
			},
			{
				label: "Mar",
				value: 18
			},
			{
				label: "Apr",
				value: 34
			},
			{
				label: "May",
				value: 40
			},
			{
				label: "Jun",
				value: 32
			}
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
		yRegions: []
	}, settings);
    
    this._maxValue = 0;
    this._minValue = 0;
	this._distanceBetweenPoints = 100;
	this._chartAreaWidth = 0;
	this._chartAreaHeight = 0;
	this._valueFactor = 1;
    
}

IdeosChart.prototype.getMaxValue = function () {
	var mx = -99999;
	for(var i = 0, z = this.settings.datapoints.length; i < z; i++) {
		if (this.settings.datapoints[i].value - this.settings.displaceYOriginTo > mx) mx = this.settings.datapoints[i].value;
	}
	this._maxValue = mx + this.settings.maxValueGap;
	return mx + this.settings.maxValueGap;
};
IdeosChart.prototype.getMinValue = function () {
	var mn = 0;
	for(var i = 0, z = this.settings.datapoints.length; i < z; i++) {
		if (this.settings.datapoints[i].value < mn) mn = this.settings.datapoints[i].value;
	}
	this._minValue = mn;
	return mn;
};
IdeosChart.prototype.getChartAreaWidth = function () {
	this._chartAreaWidth = this.settings.width - this.settings.marginLeft - this.settings.marginRight;
	return this._chartAreaWidth;
};
IdeosChart.prototype.getChartAreaHeight = function () {
		this._chartAreaHeight = this.settings.height - this.settings.marginTop - this.settings.marginBottom;
		return this._chartAreaHeight;
};
IdeosChart.prototype.getDistanceBetweenPoints = function () {
	this._distanceBetweenPoints = this._chartAreaWidth / this.settings.datapoints.length;
	return this._distanceBetweenPoints;
};

IdeosChart.prototype.getValueFactor = function () {
    var f = this.getChartAreaHeight();
	f = f / (this.getMaxValue() - this.getMinValue());
	this._valueFactor = f; // / this.getChartAreaHeight();
	console.log(this._chartAreaHeight, f);
	return f;
};

IdeosChart.prototype.drawLabels = function (c) {    // c = a canvas 2d context
    for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
        var dp = this.settings.datapoints[i];
		c.fillText(this.settings.datapoints[i].label, 
			dp.xCenter, 
			this.settings.height - this.settings.marginBottom + 15);
	}
};

IdeosChart.prototype.drawAxisLines = function (c) { // c = a canvas 2d context

	c.fillStyle = this.settings.chartArea.fillStyle;
	c.roundRect(this.settings.marginLeft, this.settings.marginTop, this._chartAreaWidth, this._chartAreaHeight, 5, true, true);
		
	// draw horizontal grid lines
	var lineCount = this.settings.chartArea.gridLines.yCount || 5;
	var lineGap = this._chartAreaHeight / lineCount;
	c.strokeStyle = this.settings.chartArea.gridLines.lineColor;
	c.lineWidth = this.settings.chartArea.gridLines.lineWidth;
	for (var i = 0, z = lineCount; i <= z; i++) {
		c.strokeStyle = this.settings.chartArea.gridLines.lineColor;
		c.beginPath();
		c.moveTo(this.settings.marginLeft, this.settings.marginTop + i * lineGap);
		c.lineTo(this.settings.width - this.settings.marginRight, this.settings.marginTop + i * lineGap);
		c.stroke();
		
		if (this.settings.chartArea.gridLines.showValues) {
			c.strokeStyle = "#555";
			c.fillStyle = "#555";
			var lbl = Math.round(this._maxValue - this._minValue - i * lineGap / this._valueFactor + this.settings.displaceYOriginTo).toString();
			var xcoord = this.settings.marginLeft - c.measureText(lbl).width - 5;
			//console.log(c.measureText(lbl));
			c.fillText(lbl, xcoord, this.settings.marginTop + i * lineGap + 3);
		}
		c.closePath();
	}
	
};

IdeosChart.prototype.drawYAxisLine = function (c) {
	console.log('drawing yAxisLine');
	c.strokeStyle = "#f00";
	var p = 5;
	c.lineWidth = 2;
	var lcap = c.lineCap;
	c.beginPath();
	c.lineCap = "round";
	//c.moveTo(this.settings.marginLeft + p, this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor);
	//c.lineTo(this.settings.width - this.settings.marginRight - p, this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor);
	c.dashedLineTo(
		this.settings.marginLeft + p, this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
		this.settings.width - this.settings.marginRight - p, this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
		[5,5]);
	c.closePath();
	c.stroke();
	c.lineCap = lcap;
};

IdeosChart.prototype.drawYRegions = function (c) {
    for (var i = 0, z = this.settings.yRegions.length; i < z; i++) {
        var yreg = this.settings.yRegions[i];
        //dp.yCenter = this._chartAreaHeight - (dp.value - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop;
        yreg.yVal1 = this._chartAreaHeight - (yreg.from - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop;
        yreg.yVal2 = this._chartAreaHeight - (yreg.to - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop;
    }
    for (var i = 0, z = this.settings.yRegions.length; i < z; i++) {
        var yreg = this.settings.yRegions[i];
        c.fillStyle = yreg.color;
        c.fillRect(this.settings.marginLeft, yreg.yVal2, this._chartAreaWidth, Math.abs(yreg.yVal2 - yreg.yVal1) * 1);
        console.log(this.settings.marginLeft, yreg.yVal2, this._chartAreaWidth, yreg.yVal1);
    }
};

IdeosChart.prototype.lightenDarkenColor = function (clr, amt) {
    var usePound = false;
    var color = clr;
    if ( color[0] == "#" ) {
        color = color.slice(1);
        usePound = true;
    }

    if (color.length == 3) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    var num = parseInt(color,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var g = ((num >> 8) & 0x00FF) + amt;

    if ( g > 255 ) g = 255;
    else if  (g < 0) g = 0;

    var b = (num & 0x0000FF) + amt;

    if ( b > 255 ) b = 255;
    else if  ( b < 0 ) b = 0;

    var rStr = (r.toString(16).length < 2)?'0'+r.toString(16):r.toString(16);
    var gStr = (g.toString(16).length < 2)?'0'+g.toString(16):g.toString(16);
    var bStr = (b.toString(16).length < 2)?'0'+b.toString(16):b.toString(16);

    return (usePound?"#":"") + rStr + gStr + bStr;
};
IdeosChart.prototype.lightenColor = function (color, amt) {
    return this.lightenDarkenColor(color, amt);
};
IdeosChart.prototype.darkenColor = function (color, amt) {
    return this.lightenDarkenColor(color, amt * -1);
};


//-- these need to be overriden

IdeosChart.prototype.render = function(container) {
    
};


