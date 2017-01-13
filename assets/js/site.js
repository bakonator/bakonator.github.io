Em = {
	EMORYISCOOL: [
		'awesome',
		'really good smelling',
		'always getting really good grades for some reason',
		'good with the ladies',
		'a tech wizard',
		'livin the dream',
		'full of good ideas',
		'fun on the weekends',
		'dope on a ripstick',
		'fast on an electric ripstick',
		'funny',
		'hot',
		'quiet, but secretly brilliant'
	],

	init: function( ) {
		Em.bgGenerate();
		$('#tellMe').on('click', Em.rollTheDice);
	},

	rollTheDice: function() {
		var randNum = Math.floor(Math.random() * Em.EMORYISCOOL.length);
		var randPosX = Math.floor(Math.random() * $(window).width());
		var randPosY = Math.floor(Math.random() * $(window).height());

		$("#emIs").html(Em.EMORYISCOOL[randNum]);
		$('#tellMe').css({
			'position': 'absolute',
			'top': randPosY,
			'left': randPosX
		})
	},

	bgGenerate: function() {
		var canvas = document.createElement( 'canvas' ),
		    ctx = canvas.getContext( '2d' ),
		    width = canvas.width = window.innerWidth,
		    height = canvas.height = window.innerHeight,
		    avg = ( width + height ) / 2,
		    blobs = [],
		    speedRange = 3,
		    maxCombo = 15,
		    radius = 2,
		    count = avg * 0.5,
		    PI = Math.PI,
		    TWOPI = PI * 2;

		function rand( min, max ) {
		  return Math.random() * (max - min) + min;
		}

		function dist( p1, p2 ) {
		  var dx = p1.x - p2.x,
		      dy = p1.y - p2.y;
		  return Math.sqrt( dx * dx + dy * dy );
		}

		function Blob() {
		  this.radius = radius;
		  this.targetRadius = radius;
		  this.x = rand( this.radius, width - this.radius );
		  this.y = rand( this.radius, height - this.radius );
		  this.vx = rand( -speedRange, speedRange );
		  this.vy = rand( -speedRange, speedRange );
		  this.hue = 0;
		  this.combineCount = 1;
		  this.deathFlag = 0;
		}

		Blob.prototype.update = function( i ) {
		  if( this.deathFlag ) {
		    blobs.splice( i, 1 );
		    return;
		  }
		  if( this.combineCount >= maxCombo ) {
		    var j = this.combineCount - 4;
		    while( j-- ) {
		      var blob = new Blob();
		      blob.x = this.x;
		      blob.y = this.y;
		      blob.vx = rand( -speedRange, speedRange );
		      blob.vy = rand( -speedRange, speedRange );
		      blob.immuneFlag = 50;
		      blobs.push( blob );
		    }
		    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
		    ctx.beginPath();
		    ctx.arc( this.x, this.y, this.radius, 0, TWOPI );
		    ctx.fill();
		    blobs.splice( i, 1 );
		    return;
		  }
		  this.index = i;
		  if( this.immuneFlag > 0 ) {
		    this.immuneFlag--;
		  }
		  this.radius += ( this.targetRadius - this.radius ) * 0.2;
		  this.x += this.vx;
		  this.y += this.vy;
		  this.hue = 200 + ( this.combineCount / maxCombo ) * 160;
		  this.wrapBounds();
		  this.checkCollisions();
		};

		Blob.prototype.checkCollisions = function() {
		  this.colliding = 0;
		  var i = blobs.length;
		  while( i-- ) {
		    if( this.index != i ) {
		      var other = blobs[ i ];
		      if( !this.immuneFlag && dist( this, other ) <= this.radius + other.radius ) {
		        if( this.radius >= other.radius ) {
		          this.targetRadius += other.radius;
		          this.combineCount += other.combineCount;
		          other.deathFlag = 1;
		        } else {
		          other.targetRadius += this.radius;
		          other.combineCount += this.combineCount;
		          this.deathFlag = 1;
		        }
		        break;
		      }
		    }
		  }
		};

		Blob.prototype.wrapBounds = function() {
		  if( this.x + this.radius < 0 ) {
		    this.x = width + this.radius;
		  }
		  if( this.x - this.radius > width ) {
		    this.x = -this.radius;
		  }
		  if( this.y + this.radius < 0 ) {
		    this.y = height + this.radius;
		  }
		  if( this.y - this.radius > height ) {
		    this.y = -this.radius;
		  }
		};

		Blob.prototype.render = function( i ) {
		  ctx.beginPath();
		  ctx.arc( this.x, this.y, this.radius, 0, TWOPI );
		  ctx.fillStyle = 'hsl(' + this.hue + ', 100%, 50%)';
		  ctx.fill();
		};

		function createBlobs() {
		  for( var i = 0; i < count; i++ ) {
		    blobs.push( new Blob() );
		  }
		}

		function loop() {
		  requestAnimationFrame( loop );
		  ctx.clearRect( 0, 0, width, height );
		  var i = blobs.length;
		  while( i-- ) {
		    blobs[ i ].update( i );
		  }
		  i = blobs.length;
		  while( i-- ) {
		    blobs[ i ].render();
		  }
		}

		document.body.appendChild( canvas );
		createBlobs();
		loop();
	}
}

$(Em.init);