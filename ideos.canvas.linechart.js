function IdeosLineChart(settings) {
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
		displaceYOriginTo: 0
		
	}, settings);
	
	
	this._maxValue = 0;
	this._minValue = 0;
	this._distanceBetweenPoints = 100;
	this._chartAreaWidth = 0;
	this._chartAreaHeight = 0;
	this._valueFactor = 1;
	
	this.getMaxValue = function () {
		var mx = -99999;
		for(var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			if (this.settings.datapoints[i].value - this.settings.displaceYOriginTo > mx) mx = this.settings.datapoints[i].value;
		}
		this._maxValue = mx + this.settings.maxValueGap;
		return mx + this.settings.maxValueGap;
	}
	this.getMinValue = function () {
		var mn = 0;
		for(var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			if (this.settings.datapoints[i].value < mn) mn = this.settings.datapoints[i].value;
		}
		this._minValue = mn;
		return mn;
	}
	this.getChartAreaWidth = function () {
		this._chartAreaWidth = this.settings.width - this.settings.marginLeft - this.settings.marginRight;
		return this._chartAreaWidth;
	}
	this.getChartAreaHeight = function () {
			this._chartAreaHeight = this.settings.height - this.settings.marginTop - this.settings.marginBottom;
			return this._chartAreaHeight;
	}
	this.getDistanceBetweenPoints = function () {
		this._distanceBetweenPoints = this._chartAreaWidth / this.settings.datapoints.length;
		return this._distanceBetweenPoints;
	}
	this.getValueFactor = function () {
		var f = this.getChartAreaHeight();
		f = f / (this.getMaxValue() - this.getMinValue());
		this._valueFactor = f; // / this.getChartAreaHeight();
		console.log(this._chartAreaHeight, f);
		return f;
	}
	
	this.render = function (container) {
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
		
		for ( var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			dp.xCenter = this._distanceBetweenPoints * i + this.settings.marginLeft + this._distanceBetweenPoints/2;
			dp.yCenter = this._chartAreaHeight - (dp.value - this.settings.displaceYOriginTo) * this._valueFactor + this.settings.marginTop;
			dp.hotArea = {};
			dp.hotArea.x1 = this.settings.marginLeft + this._distanceBetweenPoints * i;
			dp.hotArea.y1 = this.settings.marginTop  + 0;
			dp.hotArea.x2 = dp.hotArea.x1 + this._distanceBetweenPoints;
			dp.hotArea.y2 = this.height - this.settings.marginBottom;
			//console.log(dp.label, dp.hotArea.x1, dp.hotArea.x2);
		}
		
		this.drawAxisLines(c);
		
		if (this.settings.displaceYOriginTo != 0)
			this.drawYAxisLine(c);
		
		c.lineWidth = 3;
		c.strokeStyle = "#333";
		c.font = "italic 8pt sans-serif";
		c.textAlign = "center";
		c.fillStyle = "#000";
		
		this.drawLabels(c);
		
		this.drawSeriesLines(c);
		
		this.drawMarkers(c);
		
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
				//console.log(dp.label);
				var xoffset = -10;
				var yoffset = -40;
				var xpadd = 12;
				var ypos = uy + yoffset;
				if (ypos < 0) ypos = 4;
				var v = dp.value.toString();
				if (dp.tooltip) v = dp.tooltip + " " + v;
				var vw = e.data.context.measureText(v).width;
				xoffset = vw/2 * -1;
				if (ux + xoffset + vw + xpadd >= this.width) xoffset = this.width - ux - vw - xpadd - 4;
				//console.log(xoffset);
				e.data.context.roundRect(ux + xoffset, ypos, vw + xpadd, 21, 4, true, true);
				e.data.context.fillStyle = "#000";
				e.data.context.textAlign = "center";
				e.data.context.fillText(v, ux + xoffset + vw/2 + xpadd/2, ypos + 13);
				
			}
		});
	}
	
	this.getDatapointAt = function (x, y) {
		for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			if (dp.hotArea.x1 < x && dp.hotArea.x2 > x) {
				return dp;
				break;
			}
		}
		return null;
	}
	
	this.drawAxisLines = function (c) {
		
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
		
	}
	
	this.drawLabels = function (c) {
		for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			c.fillText(this.settings.datapoints[i].label, 
				dp.xCenter, 
				this.settings.height - this.settings.marginBottom + 15);
		}
	}
	
	this.drawSeriesLines = function (c) {
		var prevX = 0;
		var prevY = 0;		
		c.moveTo(this.settings.datapoints[0].xCenter, this.settings.datapoints[0].yCenter);
		prevX = this.settings.datapoints[0].xCenter;
		prevY = this.settings.datapoints[0].yCenter;
		
		for (var i = 1, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			
			c.strokeStyle = dp.lineColor;
			c.lineWidth = dp.lineWidth || 3;
			c.shadowColor = "rgba(0,0,0,.5)";
			c.shadowBlur = 10;
			c.shadowOffsetX = 4;
			c.shadowOffsetY = 4;
			c.beginPath();
			
			c.moveTo(prevX, prevY);
			c.lineTo(dp.xCenter, dp.yCenter);
			c.closePath();
			c.stroke();
			
			prevX = dp.xCenter;
			prevY = dp.yCenter;
		}
		
	}
	
	this.drawMarkers = function (c) {
		for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			c.fillStyle = dp.markerColor;
			c.beginPath();
			c.arc(dp.xCenter, dp.yCenter, dp.markerSize, 0, Math.PI * 2, true);
			c.fill();
			if (dp.markerStrokeWidth) {
				c.lineWidth = dp.markerStrokeWidth || 0;
				c.strokeStyle = dp.markerStrokeColor || "#000";
				c.stroke();
			}
			c.closePath();
		}
	}
	
	this.drawYAxisLine = function (c) {
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
	}
}