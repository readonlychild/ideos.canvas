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
            ctx.fillStyle = dp.markerColor || "#abd";
            ctx.beginPath();
            ctx.arc(dp.xCenter, dp.yCenter, dp.markerSize + 4, 0, Math.PI * 2, true);
            ctx.fill();
            if (dp.markerStrokeWidth) {
                ctx.lineWidth = dp.markerStrokeWidth || 0;
                ctx.strokeStyle = dp.markerStrokeColor || "#000";
                ctx.stroke();
		    } else {
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#000";
		        ctx.stroke();
		    }
		    ctx.closePath();
        };
        
        this.includeTooltipLayer(c);

	};

	this.drawSeriesLines = function (c) {
		console.log('multiSeries ', this.settings.multiSeries, this.settings.datapoints.length);
        if (this.settings.multiSeries) {
            for (var i = 0; i < this.settings.datapoints.length; i++) {
                this.drawLinesFor(c, this.settings.datapoints[i]);
            }
        } else {
            this.drawLinesFor(c, this.settings.datapoints);
        }

	};
    
    this.drawLinesFor = function (c, datapoints) {
        var prevX = 0;
    	var prevY = 0;		
		c.moveTo(datapoints[0].xCenter, datapoints[0].yCenter);
		prevX = datapoints[0].xCenter;
		prevY = datapoints[0].yCenter;
		
		for (var i = 1, z = datapoints.length; i < z; i++) {
			var dp = datapoints[i];
			
			c.strokeStyle = dp.color || "#000";
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
        if (this.settings.multiSeries) {
            for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
                for (var k = 0, kk = this.settings.datapoints[i].length; k < kk; k++) {
                    var dp = this.settings.datapoints[i][k];
                    c.fillStyle = dp.markerColor || "#abd";
                    c.beginPath();
                    c.arc(dp.xCenter, dp.yCenter, dp.markerSize, 0, Math.PI * 2, true);
                    c.fill();
                    if (dp.borderStrokeWidth) {
                        c.lineWidth = dp.borderStrokeWidth || 0;
                        c.strokeStyle = dp.borderStrokeColor || "#000";
                        c.stroke();
                    } else {
                        c.lineWidth = 1;
                        c.strokeStyle = "#000";
                        c.stroke();
                    }
                    c.closePath();
                }
            }
        } else {
            for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
                var dp = this.settings.datapoints[i];
                c.fillStyle = dp.markerColor || "#abd";
                c.beginPath();
                c.arc(dp.xCenter, dp.yCenter, dp.markerSize, 0, Math.PI * 2, true);
                c.fill();
                if (dp.borderStrokeWidth) {
                    c.lineWidth = dp.borderStrokeWidth || 0;
                    c.strokeStyle = dp.borderStrokeColor || "#000";
                    c.stroke();
                } else {
                    c.lineWidth = 1;
                    c.strokeStyle = "#000";
                    c.stroke();
                }
                c.closePath();
            }
        }
	};

}