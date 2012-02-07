IdeosStackedBarChart.prototype = new IdeosChart();

function IdeosStackedBarChart(settings) {

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
        var barWidth = this._distanceBetweenPoints;
        
        barWidth *= 0.75;
        
        var compensateLeftSide = 0; //barWidth/2;
        
        //override hotArea values...
        for (var k = 0, kk = datapoints.length; k < kk; k++) {
            var dp = datapoints[k];
            dp.hotArea = {};
            dp.hotArea.x1 = dp.hotArea.sx1;
            dp.hotArea.y1 = dp.hotArea.sy1;
            dp.hotArea.x2 = dp.hotArea.sx2;
            dp.hotArea.y2 = dp.hotArea.sy2;
        }
        
		for (var i = 0, z = datapoints.length; i < z; i++) {
            
			var dp = datapoints[i];
			
            if (dp.value !== 0) {
                c.strokeStyle = dp.borderStrokeColor || "#000";
                c.lineWidth = dp.borderStrokeWidth || 0;
	            c.shadowColor = "rgba(0,0,0,.5)";
			    c.shadowBlur = 0;
			    c.shadowOffsetX = 0;
                c.shadowOffsetY = 0;

                c.fillStyle = dp.color || seriesColor;
                
                //gradienting...
                var lgrad = c.createLinearGradient(
                    dp.xCenter - barWidth/2 + compensateLeftSide,
                    0,
                    dp.xCenter + barWidth/2 - compensateLeftSide,
                    0
                );
                
                var dpclr = dp.color || seriesColor;
                dp.color = dp.color || seriesColor;
                lgrad.addColorStop(1, this.lightenColor(dpclr, 33));
                lgrad.addColorStop(0.51, dpclr);
                lgrad.addColorStop(0.5, this.darkenColor(dpclr, 22));
                lgrad.addColorStop(0, dpclr);
                c.fillStyle = lgrad;
            
                c.fillRect(
                    dp.xCenter - barWidth/2 + compensateLeftSide,
                    this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor - dp.yCenterStacked, 
                    barWidth,
                    (this.settings.height - this.settings.marginBottom - dp.yCenter) * -1 - this.settings.displaceYOriginTo * this._valueFactor 
                );
                
                dp.hotArea = {};
                dp.hotArea.x1 = dp.xCenter - barWidth/2 + compensateLeftSide;
                dp.hotArea.y1 = this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor - dp.yCenterStacked +
                    (this.settings.height - this.settings.marginBottom - dp.yCenter) * -1 - this.settings.displaceYOriginTo * this._valueFactor;
                dp.hotArea.x2 = dp.xCenter - barWidth/2 + compensateLeftSide + barWidth;
                dp.hotArea.y2 = this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor - dp.yCenterStacked;
                
                if (dp.borderStrokeColor) {
                    c.shadowBlur = 0;
                    c.shadowOffsetX = 0;
			        c.shadowOffsetY = 0;
                    c.strokeRect(
                        dp.xCenter - barWidth/2 + compensateLeftSide,
                        this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
                        barWidth,
                        (this.settings.height - this.settings.marginBottom - dp.yCenter) * -1 - this.settings.displaceYOriginTo * this._valueFactor
                    );
                }
                
            }
		}
        
		
	};

}