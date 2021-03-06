IdeosBarChart.prototype = new IdeosChart();

function IdeosBarChart(settings) {

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
        
		this.drawBars(c);

        this.includeTooltipLayer(c);

	};

    this.drawBars = function (c) {
        this.currentColorIdx = 0;
        for (var i = 0, z = this.settings.series.length; i < z; i++) {
            this.drawBarsFor(c, this.settings.series[i].datapoints, i);
        }
    };

	this.drawBarsFor = function (c, datapoints, idx) {
        var seriesColor = this.nextColor();
        var barWidth = this._distanceBetweenPoints / this.settings.series.length;
        barWidth *= 0.75;
        
        var compensateLeftSide = barWidth/2;
        
        //override hotArea values...
        
            for (var k = 0, kk = datapoints.length; k < kk; k++) {
                var dp = datapoints[k];
                dp.hotArea = {};
                dp.hotArea.x1 = dp.xCenter - this._distanceBetweenPoints/2 + (idx * barWidth) + compensateLeftSide;
                dp.hotArea.y1 = this.settings.marginTop  + 0;
                dp.hotArea.x2 = dp.hotArea.x1 + barWidth;
                dp.hotArea.y2 = this.height - this.settings.marginBottom;
                //dp.seriesName = dp.seriesName || this.settings.series[i].name;
            }
        
		for (var i = 0, z = datapoints.length; i < z; i++) {
            
			var dp = datapoints[i];
			
            if (dp.value !== 0) {
                c.strokeStyle = dp.borderStrokeColor || "#000";
                c.lineWidth = dp.borderStrokeWidth || 0;
	            c.shadowColor = "rgba(0,0,0,.5)";
			    c.shadowBlur = 10;
			    c.shadowOffsetX = 4;
                c.shadowOffsetY = 4;

                c.fillStyle = dp.color || seriesColor;
                
                //side-by-side (not-stacked) bar...
                var thisSeriesBar = {};
                thisSeriesBar.x1 = dp.xCenter - this._distanceBetweenPoints/2 + (idx * barWidth) + compensateLeftSide;
                
                //gradienting...
                var lgrad = c.createLinearGradient(
                    thisSeriesBar.x1, 
                    0,
                    thisSeriesBar.x1 + barWidth, 
                    0
                );
                var dpclr = dp.color || seriesColor;
                lgrad.addColorStop(1, this.lightenColor(dpclr, 33));
                lgrad.addColorStop(0.51, dpclr);
                lgrad.addColorStop(0.5, this.darkenColor(dpclr, 22));
                lgrad.addColorStop(0, dpclr);
                c.fillStyle = lgrad;
            
                c.fillRect(
                    thisSeriesBar.x1, 
                    this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor, 
                    barWidth, 
                    (this.settings.height - this.settings.marginBottom - dp.yCenter) * -1 - this.settings.displaceYOriginTo * this._valueFactor 
                );
                if (dp.borderStrokeColor) {
                    c.shadowBlur = 0;
                    c.shadowOffsetX = 0;
			        c.shadowOffsetY = 0;
                    c.strokeRect(
                        thisSeriesBar.x1, 
                        this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
                        barWidth,
                        (this.settings.height - this.settings.marginBottom - dp.yCenter) * -1 - this.settings.displaceYOriginTo * this._valueFactor
                    );
                }
            }
		}
        
		
	};

}