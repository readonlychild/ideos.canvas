function IdeosChart(settings) {
    
    this.settings = $.extend({
        container: 'linechart',
		width: 300, height: 200,
		marginTop: 10,
		marginRight: 10,
		marginBottom: 20,
		marginLeft: 30,
        multiSeries: true,
		series: [
          {    
              name: "Series 1",
              datapoints: [
    			{
    				label: "Jan",
    				value: 1
    			},
    			{ label: "Feb", value: 2 },
    			{ label: "Mar", value: 3 },
    			{ label: "Apr", value: 4 },
    			{ label: "May", value: 5 },
    			{ label: "Jun", value: 6 },
                { label: "Jul", value: 7 },
                { label: "Aug", value: 8 },
                { label: "Sep", value: 9 },
                { label: "Oct", value: 10 },
                { label: "Nov", value: 11 },
                { label: "Dec", value: 12 }
              ]
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
    if (this.settings.stackedSeries) {
        return this.getMaxValueStacked();
    } 
    return this.getMaxValueNotStacked();
};
IdeosChart.prototype.getMaxValueNotStacked = function () {
	var mx = -99999;

        for(var i = 0, z = this.settings.series.length; i < z; i++) {
            for (var k = 0, kk = this.settings.series[i].datapoints.length; k < kk; k++) {
                if (this.settings.series[i].datapoints[k].value - this.settings.displaceYOriginTo > mx) mx = this.settings.series[i].datapoints[k].value;
            }
        }

	this._maxValue = mx + this.settings.maxValueGap; // + this.settings.displaceYOriginTo;
	return mx + this.settings.maxValueGap;
};
IdeosChart.prototype.getMaxValueStacked = function () {
    var mx = -99999;
    for (var i = 0, z = this.settings.series[0].datapoints.length; i < z; i++) {
        var stackVal = 0;
        for (var j = 0; j < this.settings.series.length; j++) {
            stackVal += this.settings.series[j].datapoints[i].value;
        }
        if (stackVal - this.settings.displaceYOriginTo > mx) mx = stackVal;
    }
    this._maxValue = mx + this.settings.maxValueGap;
    return mx + this.settings.maxValueGap;
};
IdeosChart.prototype.getMinValue = function () {
    if (this.settings.stackedSeries) {
        return this.getMinValueStacked();
    }
    return this.getMinValueNotStacked();
};
IdeosChart.prototype.getMinValueNotStacked = function () {
	var mn = 0;

        for(var i = 0, z = this.settings.series.length; i < z; i++) {
            for (var k = 0, kk = this.settings.series[i].datapoints.length; k < kk; k++) {
                if (this.settings.series[i].datapoints[k].value < mn) mn = this.settings.series[i].datapoints[k].value;
            }
        }

	this._minValue = mn;
	return mn;
};
IdeosChart.prototype.getMinValueStacked = function () {
    var mn = 0;
    for (var i = 0, z = this.settings.series[0].datapoints.length; i < z; i++) {
        var stackVal = 0;
        for (var j = 0; j < this.settings.series.length; j++) {
            stackVal += this.settings.series[j].datapoints[i].value;
        }
        if (stackVal < mn) mn = stackVal;
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

    this._distanceBetweenPoints = this._chartAreaWidth / this.settings.series[0].datapoints.length;
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
        for (var i = 0, z = this.settings.series[0].datapoints.length; i < z; i++) {
            var dp = this.settings.series[0].datapoints[i];
            c.fillText(dp.label, 
                dp.xCenter, 
                this.settings.height - this.settings.marginBottom + 15);
        }
};

IdeosChart.prototype.drawAxisLines = function (c) { // c = a canvas 2d context

    if (!this.settings.chartArea.gridLines.useIncrements) {
        this.drawAxisLinesV1(c);
        return;
    }
    var inc = this.settings.chartArea.gridLines.gap || 20;

	c.fillStyle = this.settings.chartArea.fillStyle;
	c.roundRect(this.settings.marginLeft, this.settings.marginTop, this._chartAreaWidth, this._chartAreaHeight, 5, true, true);
		
	// draw horizontal grid lines
	c.strokeStyle = this.settings.chartArea.gridLines.lineColor;
	c.lineWidth = this.settings.chartArea.gridLines.lineWidth;
    
    var weirdYValCompensation = 0;
    
	var curVal = 0;
    while (curVal + inc < this._maxValue) {
        c.strokeStyle = this.settings.chartArea.gridLines.lineColor;
        c.beginPath();
        var ypos = this._chartAreaHeight - (curVal - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop + weirdYValCompensation;
		c.moveTo(this.settings.marginLeft, ypos);
		c.lineTo(this.settings.width - this.settings.marginRight, ypos);
		c.stroke();
        if (this.settings.chartArea.gridLines.showValues) {
            c.strokeStyle = "#555";
			c.fillStyle = "#555";
			//var lbl = Math.round(this._maxValue - this._minValue - curVal / this._valueFactor + this.settings.displaceYOriginTo).toString();
            var lbl = Math.round(curVal).toString();
			var xcoord = this.settings.marginLeft - c.measureText(lbl).width - 5;
			//console.log(c.measureText(lbl));
			c.fillText(lbl, xcoord, ypos + 3);
		}
		c.closePath();
        curVal += inc;
    }
    curVal = 0;
    while (curVal - inc > this._minValue) {
        curVal -= inc;
        c.strokeStyle = this.settings.chartArea.gridLines.lineColor;
        c.beginPath();
        var ypos2 = this._chartAreaHeight - (curVal - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop + weirdYValCompensation;
		c.moveTo(this.settings.marginLeft, ypos2);
		c.lineTo(this.settings.width - this.settings.marginRight, ypos2);
		c.stroke();
        if (this.settings.chartArea.gridLines.showValues) {
            c.strokeStyle = "#555";
			c.fillStyle = "#555";
			var lbl2 = Math.round(curVal).toString();
			var xcoord2 = this.settings.marginLeft - c.measureText(lbl2).width - 5;
			//console.log(c.measureText(lbl));
			c.fillText(lbl2, xcoord2, ypos2 + 3);
		}
		c.closePath();
    }
    
	
};

IdeosChart.prototype.drawAxisLinesV1 = function (c) { // c = a canvas 2d context

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

IdeosChart.prototype.preRender = function (container) {
    if (container) this.settings.container = container;
	
	var canv = $("#" + this.settings.container);
	this.settings.width = canv.width();
	this.settings.height = canv.height();
	
	var c = canv[0].getContext('2d');
	
	this.getMaxValue();
	this.getMinValue();
	this.getChartAreaWidth();
	this.getChartAreaHeight();
	this.getDistanceBetweenPoints();
	this.getValueFactor();
	
	console.log('yaxis limits:', this._minValue, this._maxValue, this._valueFactor);
    //this hotspot logic works best for multiseries linechart
        for ( var i = 0, z = this.settings.series.length; i < z; i++) {
            for (var k = 0, kk = this.settings.series[i].datapoints.length; k < kk; k++) {
                var dp = this.settings.series[i].datapoints[k];
                dp.xCenter = this._distanceBetweenPoints * k + this.settings.marginLeft + this._distanceBetweenPoints/2;
                dp.yCenter = this._chartAreaHeight - (dp.value - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop;
                dp.hotArea = {};
                dp.hotArea.x1 = this.settings.marginLeft + this._distanceBetweenPoints * k;
                dp.hotArea.y1 = this.settings.marginTop  + 0;
                dp.hotArea.x2 = dp.hotArea.x1 + this._distanceBetweenPoints;
                dp.hotArea.y2 = this.height - this.settings.marginBottom;
                dp.seriesName = dp.seriesName || this.settings.series[i].name;
                //console.log(dp.label, dp.hotArea.x1, dp.hotArea.x2);
            }
        }
        if (this.settings.stackedSeries) {
            for (var i = 0, z = this.settings.series[0].datapoints.length; i < z; i++) {
                var stackedVal = 0;
                for (var j = 0; j < this.settings.series.length; j++) {
                    var dp = this.settings.series[j].datapoints[i];
                    dp.yCenterStacked = stackedVal * this._valueFactor;
                    dp.hotArea.sx1 = this.settings.marginLeft + this._distanceBetweenPoints * j;
                    dp.hotArea.sy1 = this.settings.marginTop + this._chartAreaHeight - stackedVal/this._valueFactor;
                    dp.hotArea.sx2 = dp.hotArea.x1 + this._distanceBetweenPoints;
                    dp.hotArea.sy2 = this.settings.marginTop + this._chartAreaHeight - stackedVal + dp.value/this._valueFactor;
                    stackedVal += dp.value;
                }
            }
        }
    
    return c;
};

IdeosChart.prototype.includeTooltipLayer = function (c) {
    //add a layer for tooltip
	$("#" + this.settings.container).before("<canvas id='" + this.settings.container + "-tt' width='" + this.settings.width + "' height='" + this.settings.height + "' style='position:absolute;' ></canvas>");
	this.ttPaper = $("#" + this.settings.container + "-tt")[0].getContext('2d');
	
	$("#" + this.settings.container + "-tt").bind("mousemove", { context: this.ttPaper, chart: this }, function (e) {
		var $this = $(this);
		var ux = e.pageX - $this.offset().left;
		var uy = e.pageY - $this.offset().top;
		//console.log(ux, uy);
		e.data.context.clearRect(0,0,this.width, this.height);
		e.data.context.strokeStyle = "rgba(0,0,0,.5)";
		e.data.context.fillStyle = "rgba(222,222,222,.5)";
		//e.data.context.fillText(ux + ", " + uy, 100, 100);
		var dp = e.data.chart.getDatapointAt(ux, uy);
		if (dp) {
            if (e.data.chart.settings.hotSpotHover) {
                e.data.chart.settings.hotSpotHover(dp, e.data.context);
            }
            
			//console.log(dp.label);
            e.data.context.globalAlpha = 0.67;
            e.data.context.strokeStyle = "#000";
            e.data.context.fillStyle = "rgba(222,222,222,.5)";
            e.data.context.fillStyle = dp.color;
			var xoffset = -10;
			var yoffset = -70;
			var xpadd = 12;
			var ypos = uy + yoffset;
			if (ypos < 0) ypos = 4;
			//var v = dp.value.toString();
			//if (dp.tooltip) v = dp.tooltip + " " + v;
            //v = dp.seriesName + " " + v;
			//var vw = e.data.context.measureText(v).width;
			//xoffset = vw/2 * -1;
			//if (ux + xoffset + vw + xpadd >= this.width) xoffset = this.width - ux - vw - xpadd - 4;
			//console.log(xoffset);
            
            var lineHeight = 12;
            
            var ttipHeight = 21;
            var ttipWidth = 40;
            if (dp.seriesName) {
                ttipHeight += lineHeight;
                var snw = e.data.context.measureText(dp.seriesName).width;
                if (snw > ttipWidth) ttipWidth = snw;
            }
            if (dp.tooltip) {
                ttipHeight += lineHeight;
                var lblw = e.data.context.measureText(dp.tooltip).width;
                if (lblw > ttipWidth) ttipWidth = lblw;
            }
            xoffset = ttipWidth/2 * -1;
            if (ux + xoffset + ttipWidth + xpadd >= this.width) xoffset = this.width - ux - ttipWidth - xpadd - 4;
            
			e.data.context.roundRect(ux + xoffset, ypos, ttipWidth + xpadd, ttipHeight, 4, true, true);
			
            e.data.context.globalAlpha = 1.0;
            
            e.data.context.fillStyle = "#000";
			e.data.context.textAlign = "center";
            
            e.data.context.font = "10px arial";
            var yshift = 13;
            if (dp.seriesName) {
                e.data.context.fillText(dp.seriesName, ux + xoffset + ttipWidth/2 + xpadd/2, ypos + yshift);
                yshift += lineHeight;
            }
            if (dp.tooltip) {
                e.data.context.fillText(dp.tooltip, ux + xoffset + ttipWidth/2 + xpadd/2, ypos + yshift);
                yshift += lineHeight;
            }
            
            e.data.context.fillText(dp.value, ux + xoffset + ttipWidth/2 + xpadd/2, ypos + yshift);
                
			if (e.data.chart.settings.hover) {
                e.data.chart.settings.hover(dp);
			}
            
		}
	});
    
    $("#" + this.settings.container + "-tt").bind("click", { context: this.ttPaper, chart: this }, function (e) {
        var $this = $(this);
        var ux = e.pageX - $this.offset().left;
		var uy = e.pageY - $this.offset().top;
        var dp = e.data.chart.getDatapointAt(ux, uy);
        //console.log('click on ', dp.label, dp.value);
        if (dp) {
            if (e.data.chart.settings.click) {
                e.data.chart.settings.click(dp);
            }
        }
    });
};

IdeosChart.prototype.getDatapointAt = function (x, y) {
    //TODO[done]: comply with multiseries...
    //TODO: may need to be re-thought for bars...
    var nearestPoint = null;
    for (var i = 0, z = this.settings.series.length; i < z; i++) {
        for (var k = 0, kk = this.settings.series[i].datapoints.length; k < kk; k++) {
            var dp = this.settings.series[i].datapoints[k];
            if (dp.hotArea.x1 < x && dp.hotArea.x2 > x) {
                // compare dp from this series to previous series nearest...
                if (nearestPoint !== null) {
                    if (this.settings.stackedSeries) {
                        if (dp.hotArea.y1 < y && dp.hotArea.y2 > y) {
                            //console.log(dp.hotArea.y1, y, dp.hotArea.y2);
                            nearestPoint = dp;
                        }
                    } else {
                        var nearestYDiff = Math.abs(nearestPoint.yCenter - y);
                        var thisYDiff = Math.abs(dp.yCenter - y);
                        if (thisYDiff < nearestYDiff) nearestPoint = dp;
                    }
                } else { 
                    nearestPoint = dp;
                }
                break;
            }
        }
    }
	return nearestPoint;
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


//#region -- these need to be overriden

IdeosChart.prototype.render = function(container) {
    
};

//#endregion -- these need to be overriden

//#region -- utility fxs

IdeosChart.prototype.isArray = function(objct) {
    if (objct.constructor.toString().indexOf("Array") == -1)
        return false;
    else
        return true;
};

IdeosChart.prototype.nextColor = function () {
    if (!this.currentColorIdx) this.currentColorIdx = 0;
    if (!this.settings.seriesColorArray) this.settings.seriesColorArray = ['#78a','#d84','#7b7','#ccf','#ffb','#eaa','#eae'];
    var clr = this.settings.seriesColorArray[this.currentColorIdx];
    this.currentColorIdx += 1;
    if (this.currentColorIdx > this.settings.seriesColorArray.length - 1) this.currentColorIdx = 0;
    return clr;
};

//#endregion -- utility fxs





