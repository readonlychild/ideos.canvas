if (typeof CanvasRenderingContext2D !== 'undefined') {

    CanvasRenderingContext2D.prototype.roundRect = 

    	function(x, y, width, height, radius, fill, stroke) {
		  if (typeof stroke == "undefined" ) {
		    stroke = true;
		  }
		  if (typeof radius === "undefined") {
		    radius = 5;
		  }
		  this.beginPath();
		  this.moveTo(x + radius, y);
		  this.lineTo(x + width - radius, y);
		  this.quadraticCurveTo(x + width, y, x + width, y + radius);
		  this.lineTo(x + width, y + height - radius);
		  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		  this.lineTo(x + radius, y + height);
		  this.quadraticCurveTo(x, y + height, x, y + height - radius);
		  this.lineTo(x, y + radius);
		  this.quadraticCurveTo(x, y, x + radius, y);
		  this.closePath();
		  if (stroke) {
		    this.stroke();
		  }
		  if (fill) {
		    this.fill();
		  }        
		};

	CanvasRenderingContext2D.prototype.dashedLineTo = 
		
		function (fromX, fromY, toX, toY, pattern) {
		  // Our growth rate for our line can be one of the following:
		  //   (+,+), (+,-), (-,+), (-,-)
		  // Because of this, our algorithm needs to understand if the x-coord and
		  // y-coord should be getting smaller or larger and properly cap the values
		  // based on (x,y).
		  var lt = function (a, b) { return a <= b; };
		  var gt = function (a, b) { return a >= b; };
		  var capmin = function (a, b) { return Math.min(a, b); };
		  var capmax = function (a, b) { return Math.max(a, b); };
		
		  var checkX = { thereYet: gt, cap: capmin };
		  var checkY = { thereYet: gt, cap: capmin };
		
		  if (fromY - toY > 0) {
		    checkY.thereYet = lt;
		    checkY.cap = capmax;
		  }
		  if (fromX - toX > 0) {
		    checkX.thereYet = lt;
		    checkX.cap = capmax;
		  }
		
		  this.moveTo(fromX, fromY);
		  var offsetX = fromX;
		  var offsetY = fromY;
		  var idx = 0, dash = true;
		  while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
		    var ang = Math.atan2(toY - fromY, toX - fromX);
		    var len = pattern[idx];
		
		    offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
		    offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));
		
		    if (dash) this.lineTo(offsetX, offsetY);
		    else this.moveTo(offsetX, offsetY);
		
		    idx = (idx + 1) % pattern.length;
		    dash = !dash;
		  }
		};


}