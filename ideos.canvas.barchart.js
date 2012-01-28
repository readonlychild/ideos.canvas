IdeosBarChart.prototype = new IdeosChart();

function IdeosBarChart(settings) {

    IdeosChart.apply( this, arguments );



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
		
		if (this.settings.displaceYOriginTo !== 0)
			this.drawYAxisLine(c);
		
		c.lineWidth = 3;
		c.strokeStyle = "#333";
		c.font = "italic 8pt sans-serif";
		c.textAlign = "center";
		c.fillStyle = "#000";
		
		this.drawLabels(c);
		
        this.drawYRegions(c);
        
		this.drawBars(c);
				
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
                // hilite marker
                /*
                e.data.context.fillStyle = dp.markerColor || "#abd";
                e.data.context.beginPath();
			    e.data.context.arc(dp.xCenter, dp.yCenter, dp.markerSize + 4, 0, Math.PI * 2, true);
			    e.data.context.fill();
			    if (dp.markerStrokeWidth) {
                    e.data.context.lineWidth = dp.markerStrokeWidth || 0;
                    e.data.context.strokeStyle = dp.markerStrokeColor || "#000";
                    e.data.context.stroke();
			    } else {
                    e.data.context.lineWidth = 1;
                    e.data.context.strokeStyle = "#000";
		            e.data.context.stroke();
			    }
			    e.data.context.closePath();
                */
                
				//console.log(dp.label);
                e.data.context.strokeStyle = "rgba(0,0,0,.5)";
                e.data.context.fillStyle = "rgba(222,222,222,.5)";
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
	
	this.getDatapointAt = function (x, y) {
		for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			if (dp.hotArea.x1 < x && dp.hotArea.x2 > x) {
				return dp;
				break;
			}
		}
		return null;
	};

	this.drawBars = function (c) {
		//var prevX = 0;
		//var prevY = 0;		
		//c.moveTo(this.settings.datapoints[0].xCenter, this.settings.datapoints[0].yCenter);
		//prevX = this.settings.datapoints[0].xCenter;
		//prevY = this.settings.datapoints[0].yCenter;
		
		for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
			var dp = this.settings.datapoints[i];
			
			c.strokeStyle = dp.borderStrokeColor || "#000";
			c.lineWidth = dp.borderStrokeWidth || 1;
			c.shadowColor = "rgba(0,0,0,.5)";
			c.shadowBlur = 10;
			c.shadowOffsetX = 4;
			c.shadowOffsetY = 4;
            
            var barMargin = this._distanceBetweenPoints*0.92;
            
            c.fillStyle = dp.color || "#abd";
            c.fillRect(
                dp.xCenter - this._distanceBetweenPoints/2 + barMargin,
                this.settings.height - this.settings.marginBottom,
                this._distanceBetweenPoints - barMargin*2,
                (this._chartAreaHeight - dp.yCenter) * -1
            );
            if (dp.borderStrokeColor) {
                c.shadowBlur = 0;
                c.shadowOffsetX = 0;
			    c.shadowOffsetY = 0;
                c.strokeRect(
                    dp.xCenter - this._distanceBetweenPoints/2 + barMargin,
                    this.settings.height - this.settings.marginBottom,
                    this._distanceBetweenPoints - barMargin*2,
                    (this._chartAreaHeight - dp.yCenter) * -1    
                );
            }
            
			//c.beginPath();
			
			//c.moveTo(prevX, prevY);
			//c.lineTo(dp.xCenter, dp.yCenter);
			//c.closePath();
			//c.stroke();
			
			//prevX = dp.xCenter;
			//prevY = dp.yCenter;
		}
		
	};

}