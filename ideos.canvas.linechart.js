IdeosLineChart.prototype = new IdeosChart();

function IdeosLineChart(settings) {

    IdeosChart.apply( this, arguments );



    this.render = function (container) {
		// get the 2dContext from the base preRender method...
        var c = this.preRender(container);
		
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
        
		this.drawSeriesLines(c);
		
		this.drawMarkers(c);
		
        this.settings.hotSpotHover = function (dp, ctx) {
            ctx.fillStyle = dp.markerColor || "#fff";
            ctx.beginPath();
            ctx.arc(dp.xCenter, dp.yCenter, dp.markerSize + 4, 0, Math.PI * 2, true);
            ctx.fill();
            if (dp.markerStrokeWidth) {
                ctx.lineWidth = dp.markerStrokeWidth || 0;
                ctx.strokeStyle = dp.markerStrokeColor || "#777";
                ctx.stroke();
		    } else {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#777";
		        ctx.stroke();
		    }
		    ctx.closePath();
        };
        
        this.includeTooltipLayer(c);

	};

	this.drawSeriesLines = function (c) {
		//console.log('multiSeries ', this.settings.multiSeries, this.settings.series.length);
        this.currentColorIdx = 0;
            for (var i = 0; i < this.settings.series.length; i++) {
                this.drawLinesFor(c, this.settings.series[i].datapoints);
            }
	};
    
    this.drawLinesFor = function (c, datapoints) {
        var prevX = 0;
    	var prevY = 0;		
		c.moveTo(datapoints[0].xCenter, datapoints[0].yCenter);
		prevX = datapoints[0].xCenter;
		prevY = datapoints[0].yCenter;
		var seriesColor = this.nextColor();
        
		for (var i = 1, z = datapoints.length; i < z; i++) {
			var dp = datapoints[i];
			
			c.strokeStyle = dp.color || seriesColor;
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
    };
	
	this.drawMarkers = function (c) {
            this.currentColorIdx = 0;
            for (var i = 0, z = this.settings.series.length; i < z; i++) {
                var seriesColor = this.nextColor();
                for (var k = 0, kk = this.settings.series[i].datapoints.length; k < kk; k++) {
                    var dp = this.settings.series[i].datapoints[k];
                    c.fillStyle = dp.markerColor || "#fff";
                    dp.markerSize = dp.markerSize || 3;
                    c.beginPath();
                    c.arc(dp.xCenter, dp.yCenter, dp.markerSize, 0, Math.PI * 2, true);
                    c.fill();
                    dp.borderStrokeWidth = dp.borderStrokeWidth || 2;
                    if (dp.borderStrokeWidth) {
                        c.lineWidth = dp.borderStrokeWidth || 0;
                        c.strokeStyle = dp.borderStrokeColor || seriesColor;
                        c.stroke();
                    } else {
                        c.lineWidth = 2;
                        c.strokeStyle = seriesColor;
                        c.stroke();
                    }
                    c.closePath();
                }
            }

	};

}