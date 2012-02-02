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
        for (var i = 0, z = this.settings.datapoints.length; i < z; i++) {
            this.drawBarsFor(c, this.settings.datapoints[i]);
        }
    };

	this.drawBarsFor = function (c, datapoints) {

		for (var i = 0, z = datapoints.length; i < z; i++) {
            
			var dp = datapoints[i];
			
            if (dp.value !== 0) {
                c.strokeStyle = dp.borderStrokeColor || "#000";
                c.lineWidth = dp.borderStrokeWidth || 0;
	            c.shadowColor = "rgba(0,0,0,.5)";
			    c.shadowBlur = 10;
			    c.shadowOffsetX = 4;
                c.shadowOffsetY = 4;
            
                var barMargin = this._distanceBetweenPoints*0.92;
            
                c.fillStyle = dp.color || "#abd";
            
                //gradienting...
                var lgrad = c.createLinearGradient(
                    dp.xCenter - this._distanceBetweenPoints/2 + barMargin,
                    0,
                    dp.xCenter + this._distanceBetweenPoints/2 - barMargin,
                    0
                );
                var dpclr = dp.color || "#abd";
                lgrad.addColorStop(1, this.lightenColor(dpclr, 33));
                lgrad.addColorStop(0.51, dpclr);
                lgrad.addColorStop(0.5, this.darkenColor(dpclr, 22));
                lgrad.addColorStop(0, dpclr);
                c.fillStyle = lgrad;
            
                c.fillRect(
                    dp.xCenter - this._distanceBetweenPoints/2 + barMargin,
                    this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
                    this._distanceBetweenPoints - barMargin*2,
                    (this._chartAreaHeight - dp.yCenter + this.settings.displaceYOriginTo) * -1
                );
                if (dp.borderStrokeColor) {
                    c.shadowBlur = 0;
                    c.shadowOffsetX = 0;
			        c.shadowOffsetY = 0;
                    c.strokeRect(
                        dp.xCenter - this._distanceBetweenPoints/2 + barMargin,
                        this.settings.height - this.settings.marginBottom + this.settings.displaceYOriginTo * this._valueFactor,
                        this._distanceBetweenPoints - barMargin*2,
                        (this._chartAreaHeight - dp.yCenter + this.settings.displaceYOriginTo) * -1
                    );
                }
            }
		}
        
		
	};

}