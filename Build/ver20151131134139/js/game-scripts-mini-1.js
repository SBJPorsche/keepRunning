(function(e,t,n){"use strict";var r=Phaser.Physics.Arcade=function(e){this.game=e,this.gravity=new Phaser.Point,this.bounds=new Phaser.Rectangle(0,0,e.world.width,e.world.height),this.checkCollision={up:!0,down:!0,left:!0,right:!0},this.maxObjects=10,this.maxLevels=4,this.OVERLAP_BIAS=4,this.forceX=!1,this.sortDirection=Phaser.Physics.Arcade.LEFT_RIGHT,this.skipQuadTree=!0,this.isPaused=!1,this.quadTree=new Phaser.QuadTree(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height,this.maxObjects,this.maxLevels),this._total=0,this.setBoundsToWorld()};r.prototype={},r.prototype.constructor=r,r.SORT_NONE=0,r.LEFT_RIGHT=1,r.RIGHT_LEFT=2,r.TOP_BOTTOM=3,r.BOTTOM_TOP=4,r.prototype.setBounds=function(e,t,n,r){this.bounds.setTo(e,t,n,r)},r.prototype.setBoundsToWorld=function(){this.bounds.setTo(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height)},r.prototype.enable=function(e,t){typeof t=="undefined"&&(t=!0);var n=1;if(Array.isArray(e)){n=e.length;while(n--)e[n]instanceof Phaser.Group?this.enable(e[n].children,t):(this.enableBody(e[n]),t&&e[n].hasOwnProperty("children")&&e[n].children.length>0&&this.enable(e[n],!0))}else e instanceof Phaser.Group?this.enable(e.children,t):(this.enableBody(e),t&&e.hasOwnProperty("children")&&e.children.length>0&&this.enable(e.children,!0))},r.prototype.enableBody=function(e){e.hasOwnProperty("body")&&e.body===null&&(e.body=new Phaser.Physics.Arcade.Body(e))},r.prototype.updateMotion=function(e){var t=this.computeVelocity(0,e,e.angularVelocity,e.angularAcceleration,e.angularDrag,e.maxAngular)-e.angularVelocity;e.angularVelocity+=t,e.rotation+=e.angularVelocity*this.game.time.physicsElapsed,e.velocity.x=this.computeVelocity(1,e,e.velocity.x,e.acceleration.x,e.drag.x,e.maxVelocity.x),e.velocity.y=this.computeVelocity(2,e,e.velocity.y,e.acceleration.y,e.drag.y,e.maxVelocity.y)},r.prototype.computeVelocity=function(e,t,n,r,i,s){return typeof s=="undefined"&&(s=1e4),e===1&&t.allowGravity?n+=(this.gravity.x+t.gravity.x)*this.game.time.physicsElapsed:e===2&&t.allowGravity&&(n+=(this.gravity.y+t.gravity.y)*this.game.time.physicsElapsed),r?n+=r*this.game.time.physicsElapsed:i&&(i*=this.game.time.physicsElapsed,n-i>0?n-=i:n+i<0?n+=i:n=0),n>s?n=s:n<-s&&(n=-s),n},r.prototype.overlap=function(e,t,n,r,i){n=n||null,r=r||null,i=i||n,this._total=0;if(!Array.isArray(e)&&Array.isArray(t))for(var s=0;s<t.length;s++)this.collideHandler(e,t[s],n,r,i,!0);else if(Array.isArray(e)&&!Array.isArray(t))for(var s=0;s<e.length;s++)this.collideHandler(e[s],t,n,r,i,!0);else if(Array.isArray(e)&&Array.isArray(t))for(var s=0;s<e.length;s++)for(var o=0;o<t.length;o++)this.collideHandler(e[s],t[o],n,r,i,!0);else this.collideHandler(e,t,n,r,i,!0);return this._total>0},r.prototype.collide=function(e,t,n,r,i){n=n||null,r=r||null,i=i||n,this._total=0;if(!Array.isArray(e)&&Array.isArray(t))for(var s=0;s<t.length;s++)this.collideHandler(e,t[s],n,r,i,!1);else if(Array.isArray(e)&&!Array.isArray(t))for(var s=0;s<e.length;s++)this.collideHandler(e[s],t,n,r,i,!1);else if(Array.isArray(e)&&Array.isArray(t))for(var s=0;s<e.length;s++)for(var o=0;o<t.length;o++)this.collideHandler(e[s],t[o],n,r,i,!1);else this.collideHandler(e,t,n,r,i,!1);return this._total>0},r.prototype.sort=function(e){this.sortDirection===Phaser.Physics.Arcade.LEFT_RIGHT?e._hash.sort(function(e,t){return!e.body||!t.body?-1:e.body.x-t.body.x}):this.sortDirection===Phaser.Physics.Arcade.RIGHT_LEFT?e._hash.sort(function(e,t){return!e.body||!t.body?-1:t.body.x-e.body.x}):this.sortDirection===Phaser.Physics.Arcade.TOP_BOTTOM?e._hash.sort(function(e,t){return!e.body||!t.body?-1:e.body.y-t.body.y}):this.sortDirection===Phaser.Physics.Arcade.BOTTOM_TOP&&e._hash.sort(function(e,t){return!e.body||!t.body?-1:t.body.y-e.body.y})},r.prototype.collideHandler=function(e,t,n,r,i,s){if(!e||!t||!e.exists||!t.exists)return;this.sortDirection!==Phaser.Physics.Arcade.SORT_NONE&&(e.physicsType===Phaser.GROUP&&this.sort(e),t.physicsType===Phaser.GROUP&&this.sort(t)),this.collideSpriteVsSprite(e,t,n,r,i,s)},r.prototype.collideSpriteVsSprite=function(e,t,n,r,i,s){return!e.body||!t.body?!1:(this.separate(e.body,t.body,r,i,s)&&(n&&n.call(i,e,t),this._total++),!0)},r.prototype.separate=function(e,t,n,r,i){if(!e.enable||!t.enable||!this.intersects(e,t))return!1;if(n&&n.call(r,e.sprite,t.sprite)===!1)return!1;var s=!1;return this.forceX||Math.abs(this.gravity.y+e.gravity.y)<Math.abs(this.gravity.x+e.gravity.x)?s=this.separateX(e,t,i)||this.separateY(e,t,i):s=this.separateY(e,t,i)||this.separateX(e,t,i),i?!0:s},r.prototype.intersects=function(e,t){var n=Math.max(e.ccdIterations,t.ccdIterations);if(n<=0)return!(e.right<=t.x||e.bottom<=t.y||e.x>=t.right||e.y>=t.bottom);var r=e._dx/(n+2),i=t._dx/(n+2),s=e._dy/(n+2),o=t._dy/(n+2),u=Array(n+1),a=Array(n+1);u[n]=[e.x,e.right,e.y,e.bottom],a[n]=[t.x,t.right,t.y,t.bottom];for(var f=n-1;f>=0;f--)u[f]=[u[f+1][0]-r,u[f+1][1]-r,u[f+1][2]-s,u[f+1][3]-s];for(f=n-1;f>=0;f--)a[f]=[a[f+1][0]-i,a[f+1][1]-i,a[f+1][2]-o,a[f+1][3]-o];for(f=0;f<=n;f++){if(u[f][1]<=a[f][0]||u[f][3]<=a[f][2]||u[f][0]>=a[f][1]||u[f][2]>=a[f][3])continue;return e.x=u[f][0],e.y=u[f][2],t.x=a[f][0],t.y=a[f][2],!0}return!1},r.prototype.separateX=function(e,t,n){if(e.immovable&&t.immovable)return!1;var r=0;if(this.intersects(e,t)){var i=e.deltaAbsX()+t.deltaAbsX()+this.OVERLAP_BIAS;e.deltaX()===0&&t.deltaX()===0?(e.embedded=!0,t.embedded=!0):e.deltaX()>t.deltaX()?(r=e.right-t.x,r>i||e.checkCollision.right===!1||t.checkCollision.left===!1?r=0:(e.touching.none=!1,e.touching.right=!0,t.touching.none=!1,t.touching.left=!0)):e.deltaX()<t.deltaX()&&(r=e.x-t.width-t.x,-r>i||e.checkCollision.left===!1||t.checkCollision.right===!1?r=0:(e.touching.none=!1,e.touching.left=!0,t.touching.none=!1,t.touching.right=!0)),e.overlapX=r,t.overlapX=r;if(r!==0){if(n||e.customSeparateX||t.customSeparateX)return!0;var s=e.velocity.x,o=t.velocity.x;if(!e.immovable&&!t.immovable){r*=.5,e.x-=r,t.x+=r;var u=Math.sqrt(o*o*t.mass/e.mass)*(o>0?1:-1),a=Math.sqrt(s*s*e.mass/t.mass)*(s>0?1:-1),f=(u+a)*.5;u-=f,a-=f,e.velocity.x=f+u*e.bounce.x,t.velocity.x=f+a*t.bounce.x}else e.immovable?t.immovable||(t.x+=r,t.velocity.x=s-o*t.bounce.x,e.moves&&(t.y+=(e.y-e.prevY)*e.friction.y)):(e.x-=r,e.velocity.x=o-s*e.bounce.x,t.moves&&(e.y+=(t.y-t.prevY)*t.friction.y));return!0}}return!1},r.prototype.separateY=function(e,t,n){if(e.immovable&&t.immovable)return!1;var r=0;if(this.intersects(e,t)){var i=e.deltaAbsY()+t.deltaAbsY()+this.OVERLAP_BIAS;e.deltaY()===0&&t.deltaY()===0?(e.embedded=!0,t.embedded=!0):e.deltaY()>t.deltaY()?(r=e.bottom-t.y,r>i||e.checkCollision.down===!1||t.checkCollision.up===!1?r=0:(e.touching.none=!1,e.touching.down=!0,t.touching.none=!1,t.touching.up=!0)):e.deltaY()<t.deltaY()&&(r=e.y-t.bottom,-r>i||e.checkCollision.up===!1||t.checkCollision.down===!1?r=0:(e.touching.none=!1,e.touching.up=!0,t.touching.none=!1,t.touching.down=!0)),e.overlapY=r,t.overlapY=r;if(r!==0){if(n||e.customSeparateY||t.customSeparateY)return!0;var s=e.velocity.y,o=t.velocity.y;if(!e.immovable&&!t.immovable){r*=.5,e.y-=r,t.y+=r;var u=Math.sqrt(o*o*t.mass/e.mass)*(o>0?1:-1),a=Math.sqrt(s*s*e.mass/t.mass)*(s>0?1:-1),f=(u+a)*.5;u-=f,a-=f,e.velocity.y=f+u*e.bounce.y,t.velocity.y=f+a*t.bounce.y}else e.immovable?t.immovable||(t.y+=r,t.velocity.y=s-o*t.bounce.y,e.moves&&(t.x+=(e.x-e.prevX)*e.friction.x)):(e.y-=r,e.velocity.y=o-s*e.bounce.y,t.moves&&(e.x+=(t.x-t.prevX)*t.friction.x));return!0}}return!1},r.prototype.moveToObject=function(e,t,n,r){typeof n=="undefined"&&(n=60),typeof r=="undefined"&&(r=0);var i=Math.atan2(t.y-e.y,t.x-e.x);return r>0&&(n=this.distanceBetween(e,t)/(r/1e3)),e.body.velocity.x=Math.cos(i)*n,e.body.velocity.y=Math.sin(i)*n,i},r.prototype.velocityFromAngle=function(e,t,n){return typeof t=="undefined"&&(t=60),n=n||new Phaser.Point,n.setTo(Math.cos(this.game.math.degToRad(e))*t,Math.sin(this.game.math.degToRad(e))*t)},r.prototype.velocityFromRotation=function(e,t,n){return typeof t=="undefined"&&(t=60),n=n||new Phaser.Point,n.setTo(Math.cos(e)*t,Math.sin(e)*t)},r.prototype.accelerateToObject=function(e,t,n,r,i){typeof n=="undefined"&&(n=60),typeof r=="undefined"&&(r=1e3),typeof i=="undefined"&&(i=1e3);var s=this.angleBetween(e,t);return e.body.acceleration.setTo(Math.cos(s)*n,Math.sin(s)*n),e.body.maxVelocity.setTo(r,i),s},r.prototype.distanceBetween=function(e,t){var n=e.x-t.x,r=e.y-t.y;return Math.sqrt(n*n+r*r)},r.prototype.angleBetween=function(e,t){var n=t.x-e.x,r=t.y-e.y;return Math.atan2(r,n)},Phaser.Physics.Arcade.Body=function(e){this.sprite=e,this.qc=e._qc,this.game=e.game,this.type=Phaser.Physics.ARCADE,this.enable=!0,this.x=e.world.x,this.prevX=this.x,this.y=e.world.y,this.prevY=this.y,this.width=e.width,this.height=e.height,this.allowRotation=!0,this.rotation=e.rotation,this.preRotation=e.rotation,this.gravity=new Phaser.Point(0,0),this.ccdIterations=0,this.velocity=new Phaser.Point,this.newVelocity=new Phaser.Point(0,0),this.deltaMax=new Phaser.Point(0,0),this.acceleration=new Phaser.Point,this.drag=new Phaser.Point,this.allowGravity=!0,this.bounce=new Phaser.Point,this.maxVelocity=new Phaser.Point(1e4,1e4),this.friction=new Phaser.Point(1,0),this.angularVelocity=0,this.angularAcceleration=0,this.angularDrag=0,this.maxAngular=1e3,this.mass=1,this.angle=0,this.speed=0,this.facing=Phaser.NONE,this.immovable=!1,this.moves=!0,this.customSeparateX=!1,this.customSeparateY=!1,this.overlapX=0,this.overlapY=0,this.embedded=!1,this.collideWorldBounds=!1,this.checkCollision={none:!1,any:!0,up:!0,down:!0,left:!0,right:!0},this.touching={none:!0,up:!1,down:!1,left:!1,right:!1},this.wasTouching={none:!0,up:!1,down:!1,left:!1,right:!1},this.blocked={up:!1,down:!1,left:!1,right:!1},this.dirty=!1,this._reset=!0,this._sx=e.scale.x,this._spx=this._sx,this._sy=e.scale.y,this._spy=this._sy,this._dx=0,this._dy=0};var i=Phaser.Physics.Arcade.Body;i.prototype={},i.prototype.constructor=i,t.defineProperties(i.prototype,{right:{get:function(){return this.x+this.width}},bottom:{get:function(){return this.y+this.height}}}),i.prototype.updateBounds=function(e){var t=this.qc.worldTransform,n=t.a,r=t.d,i=this.qc.parent.worldTransform;this._spx=i.a,this._spy=i.d;if(e||n!==this._sx||r!==this._sy)this._sx=n,this._sy=r,this.width=Math.abs(n*this.qc._width),this.height=Math.abs(r*this.qc._height),this._reset=!0},i.prototype.preUpdate=function(){if(!this.enable||this.game.physics.arcade.isPaused)return;this.dirty=!0,this.wasTouching.none=this.touching.none,this.wasTouching.up=this.touching.up,this.wasTouching.down=this.touching.down,this.wasTouching.left=this.touching.left,this.wasTouching.right=this.touching.right,this.touching.none=!0,this.touching.up=!1,this.touching.down=!1,this.touching.left=!1,this.touching.right=!1,this.blocked.up=!1,this.blocked.down=!1,this.blocked.left=!1,this.blocked.right=!1,this.embedded=!1,this.updateBounds(),this._sx>=0?this.x=this.sprite.world.x-this.sprite.anchor.x*this.width:this.x=this.sprite.world.x-(1-this.sprite.anchor.x)*this.width,this._sy>=0?this.y=this.sprite.world.y-this.sprite.anchor.y*this.height:this.y=this.sprite.world.y-(1-this.sprite.anchor.y)*this.height,this.rotation=this.sprite.angle,this.preRotation=this.rotation;if(this._reset||this.sprite.fresh)this.prevX=this.x,this.prevY=this.y;if(this.moves){this.game.physics.arcade.updateMotion(this),this.newVelocity.set(this.velocity.x*this.game.time.physicsElapsed,this.velocity.y*this.game.time.physicsElapsed),this.x+=this.newVelocity.x*this._spx,this.y+=this.newVelocity.y*this._spy;if(this.x!==this.prevX||this.y!==this.prevY)this.speed=Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y),this.angle=Math.atan2(this.velocity.y,this.velocity.x);this.collideWorldBounds&&this.checkWorldBounds()}this._dx=this.x-this.prevX,this._dy=this.y-this.prevY,this._reset=!1},i.prototype.postUpdate=function(){if(!this.enable||!this.dirty)return;this.dirty=!1;var e=this.x-this.prevX,t=this.y-this.prevY;e<0?this.facing=Phaser.LEFT:e>0&&(this.facing=Phaser.RIGHT),t<0?this.facing=Phaser.UP:t>0&&(this.facing=Phaser.DOWN),this.moves&&(this._dx=e,this._dy=t,this.deltaMax.x!==0&&this._dx!==0&&(this._dx<0&&this._dx<-this.deltaMax.x?(this._dx=-this.deltaMax.x,this.x=this._dx+this.prevX):this._dx>0&&this._dx>this.deltaMax.x&&(this._dx=this.deltaMax.x,this.x=this._dx+this.prevX)),this.deltaMax.y!==0&&this._dy!==0&&(this._dy<0&&this._dy<-this.deltaMax.y?(this._dy=-this.deltaMax.y,this.y=this._dy+this.prevY):this._dy>0&&this._dy>this.deltaMax.y&&(this._dy=this.deltaMax.y,this.y=this._dy+this.prevY)),this._dx!==0&&(this.qc.x+=this._dx/this._spx),this._dy!==0&&(this.qc.y+=this._dy/this._spy),this._reset=!0),this.allowRotation&&(this.sprite.angle+=this.deltaZ()),this.prevX=this.x,this.prevY=this.y},i.prototype.destroy=function(){this.sprite.body=null,this.sprite=null,this.qc=null},i.prototype.checkWorldBounds=function(){if(this.x<this.game.physics.arcade.bounds.x&&this.game.physics.arcade.checkCollision.left&&this._dx<0){var e=this.sprite._qc;this.x=this.game.physics.arcade.bounds.x,this.velocity.x*=-this.bounce.x,this.blocked.left=!0}else if(this.right>this.game.physics.arcade.bounds.right&&this.game.physics.arcade.checkCollision.right&&this._dx>0){var e=this.sprite._qc;this.x=this.game.physics.arcade.bounds.right-this.width,this.velocity.x*=-this.bounce.x,this.blocked.right=!0}if(this.y<this.game.physics.arcade.bounds.y&&this.game.physics.arcade.checkCollision.up&&this._dy<0){var e=this.sprite._qc;this.y=this.game.physics.arcade.bounds.y,this.velocity.y*=-this.bounce.y,this.blocked.up=!0}else if(this.bottom>this.game.physics.arcade.bounds.bottom&&this.game.physics.arcade.checkCollision.down&&this._dy>0){var e=this.sprite._qc;this.y=this.game.physics.arcade.bounds.bottom-this.height,this.velocity.y*=-this.bounce.y,this.blocked.down=!0}},i.prototype.reset=function(e,t){this.velocity.set(0),this.acceleration.set(0),this.speed=0,this.angularVelocity=0,this.angularAcceleration=0,this._reset=!0},i.prototype.onFloor=function(){return this.blocked.down},i.prototype.onWall=function(){return this.blocked.left||this.blocked.right},i.prototype.deltaAbsX=function(){return this.deltaX()>0?this.deltaX():-this.deltaX()},i.prototype.deltaAbsY=function(){return this.deltaY()>0?this.deltaY():-this.deltaY()},i.prototype.deltaX=function(){return this.x-this.prevX},i.prototype.deltaY=function(){return this.y-this.prevY},i.prototype.deltaZ=function(){return this.rotation-this.preRotation};var s=qc.defineBehaviour("qc.arcade.RigidBody",qc.Behaviour,function(){var e=this;e.arcade=e.game.phaser.physics.arcade,e.phaser=e.gameObject.phaser,e._collide=[],e._overlap=[];if(!(e.gameObject instanceof qc.Sprite||e.gameObject instanceof qc.UIImage))throw new Error("Only Sprite or UIImage can attack RigidBody!");e.phaser.enableBody=!1,e.phaser.physicsBodyType=Phaser.Physics.ARCADE,e.arcade.enable(e.phaser,e.phaser.physicsBodyType,!1),e.phaser.body.enable=!1,e.phaser.body._qc=e},function(){return{mass:qc.Serializer.NUMBER,collideWorldBounds:qc.Serializer.BOOLEAN,allowRotation:qc.Serializer.BOOLEAN,allowGravity:qc.Serializer.BOOLEAN,velocity:qc.Serializer.POINT,maxVelocity:qc.Serializer.POINT,acceleration:qc.Serializer.POINT,drag:qc.Serializer.POINT,gravity:qc.Serializer.POINT,friction:qc.Serializer.POINT,angularVelocity:qc.Serializer.NUMBER,maxAngular:qc.Serializer.NUMBER,angularAcceleration:qc.Serializer.NUMBER,angularDrag:qc.Serializer.NUMBER,bounce:qc.Serializer.POINT,immovable:qc.Serializer.BOOLEAN,moves:qc.Serializer.BOOLEAN,checkCollision:qc.Serializer.MAPPING,tilePadding:qc.Serializer.POINT,collides:qc.Serializer.NODES,overlaps:qc.Serializer.NODES,ccdIterations:qc.Serializer.INT}});s.__menu="Plugins/Arcade/RigidBody",t.defineProperties(s.prototype,{mass:{get:function(){return this.phaser.body.mass},set:function(e){this.phaser.body.mass=e}},collideWorldBounds:{get:function(){return this.phaser.body.collideWorldBounds},set:function(e){this.phaser.body.collideWorldBounds=e}},allowRotation:{get:function(){return this.phaser.body.allowRotation},set:function(e){this.phaser.body.allowRotation=e}},allowGravity:{get:function(){return this.phaser.body.allowGravity},set:function(e){this.phaser.body.allowGravity=e}},velocity:{get:function(){return this.phaser.body.velocity},set:function(e){this.phaser.body.velocity=e}},maxVelocity:{get:function(){return this.phaser.body.maxVelocity},set:function(e){this.phaser.body.maxVelocity=e}},angularAcceleration:{get:function(){return this.phaser.body.angularAcceleration},set:function(e){this.phaser.body.angularAcceleration=e,this.gameObject._isTransformDirty=!0}},acceleration:{get:function(){return this.phaser.body.acceleration},set:function(e){this.phaser.body.acceleration=e}},drag:{get:function(){return this.phaser.body.drag},set:function(e){this.phaser.body.drag=e}},gravity:{get:function(){return this.phaser.body.gravity},set:function(e){this.phaser.body.gravity=e,this.gameObject._isTransformDirty=!0}},bounce:{get:function(){return this.phaser.body.bounce},set:function(e){this.phaser.body.bounce=e,this.gameObject._isTransformDirty=!0}},friction:{get:function(){return this.phaser.body.friction},set:function(e){this.phaser.body.friction=e,this.gameObject._isTransformDirty=!0}},angularVelocity:{get:function(){return this.phaser.body.angularVelocity},set:function(e){this.phaser.body.angularVelocity=e,this.gameObject._isTransformDirty=!0}},angularDrag:{get:function(){return this.phaser.body.angularDrag},set:function(e){this.phaser.body.angularDrag=e,this.gameObject._isTransformDirty=!0}},maxAngular:{get:function(){return this.phaser.body.maxAngular},set:function(e){this.phaser.body.maxAngular=e}},angle:{get:function(){return this.phaser.body.angle}},speed:{get:function(){return this.phaser.body.speed}},immovable:{get:function(){return this.phaser.body.immovable},set:function(e){this.phaser.body.immovable=e}},moves:{get:function(){return this.phaser.body.moves},set:function(e){this.phaser.body.moves=e,this.gameObject._isTransformDirty=!0}},overlapX:{get:function(){return this.phaser.body.overlapX}},overlapY:{get:function(){return this.phaser.body.overlapY}},embedded:{get:function(){return this.phaser.body.embedded},set:function(e){this.phaser.body.embedded=e}},checkCollision:{get:function(){return this.phaser.body.checkCollision},set:function(e){this.phaser.body.checkCollision=e}},touching:{get:function(){return this.phaser.body.touching}},wasTouching:{get:function(){return this.phaser.body.wasTouching}},blocked:{get:function(){return this.phaser.body.blocked},set:function(e){this.phaser.body.blocked=e}},tilePadding:{get:function(){return this.phaser.body.tilePadding},set:function(e){this.phaser.body.tilePadding=e}},onFloor:{get:function(){return this.phaser.body.onFloor()}},onWall:{get:function(){return this.phaser.body.onWall()}},deltaX:{get:function(){return this.phaser.body.deltaX()}},deltaY:{get:function(){return this.phaser.body.deltaY()}},deltaZ:{get:function(){return this.phaser.body.deltaZ()}},collides:{get:function(){return this._collide},set:function(e){this._collide=e}},overlaps:{get:function(){return this._overlap},set:function(e){this._overlap=e}},ccdIterations:{get:function(){return this.phaser.body.ccdIterations},set:function(e){this.phaser.body.ccdIterations=e}}}),s.prototype.awake=function(){var e=this.phaser.body;e.updateBounds(!0)},s.prototype.onEnable=function(){var e=this;e.phaser.enableBody=!0,e.phaser.body.enable=!0},s.prototype.onDisable=function(){var e=this;e.phaser.enableBody=!1,e.phaser.body.enable=!1},s.prototype.update=function(){var e=this;for(var t=0;t<e._collide.length;t++){var r=e._collide[t];if(!r||r._destroy)continue;e.arcade.collide(e.phaser,r.phaser,e._collideCallback,n,e)}for(var t=0;t<e._overlap.length;t++){var r=e._overlap[t];if(!r||r._destroy)continue;e.arcade.overlap(e.phaser,r.phaser,e._overlapCallback,n,e)}},s.prototype.reset=function(){this._collide=[],this._overlap=[],this.phaser.body.reset(this.gameObject.x,this.gameObject.y)},s.prototype.addCollide=function(e){this._collide.indexOf(e)===-1&&this._collide.push(e)},s.prototype.removeCollide=function(e){var t=this._collide.indexOf(e);t!==-1&&this._collide.splice(t,1)},s.prototype.addOverlap=function(e){this._overlap.indexOf(e)===-1&&this._overlap.push(e)},s.prototype.removeOverlap=function(e){var t=this._overlap.indexOf(e);t!==-1&&this._overlap.splice(t,1)},s.prototype.moveToObject=function(e,t,n){return this.arcade.moveToObject(this.phaser,e,t,n)},s.prototype.velocityFromAngle=function(e,t,n){return this.arcade.velocityFromAngle(e,t,n)},s.prototype.velocityFromRotation=function(e,t,n){return this.arcade.velocityFromRotation(e,t,n)},s.prototype.accelerateToObject=function(e,t,n,r){return this.arcade.accelerateToObject(this.phaser,e,t,n,r)},s.prototype.distanceBetween=function(e){return this.arcade.distanceBetween(this.phaser,e)},s.prototype.angleBetween=function(e){return this.arcade.angleBetween(this.phaser,e)},s.prototype._collideCallback=function(e,t){this.gameObject._sendMessage("onCollide",e._qc,t._qc)},s.prototype._overlapCallback=function(e,t){this.gameObject._sendMessage("onOverlap",e._qc,t._qc)};var o=qc.defineBehaviour("qc.Plugins.NodeFadeInOut",qc.Tween,function(){this.fadeType=o.FADE_IN,this.columnCount=1,this.rowCount=1,this.pivotX=.5,this.pivotY=.5,this.fadeStyle=o.STYLE_ZOOM,this.fadeEffect=o.EFFECT_XY,this.target=null},{fadeType:qc.Serializer.NUMBER,columnCount:qc.Serializer.NUMBER,rowCount:qc.Serializer.NUMBER,pivotX:qc.Serializer.NUMBER,pivotY:qc.Serializer.NUMBER,fadeStyle:qc.Serializer.NUMBER,fadeEffect:qc.Serializer.NUMBER,target:qc.Serializer.NODE});o.__menu="Plugins/NodeFadeInOut",t.defineProperties(o.prototype,{columnCount:{get:function(){return this._columnCount},set:function(e){e=isNaN(e)||e===0?1:e;if(e===this._columnCount)return;this._columnCount=e}},rowCount:{get:function(){return this._rowCount},set:function(e){e=isNaN(e)||e===0?1:e;if(e===this._rowCount)return;this._rowCount=e}},_cachedTarget:{get:function(){return this.target&&this.target._destroy&&(this.target=null),this.target||this.gameObject}}}),o.prototype.onEnable=function(){if(this._cachedTarget._destroy)return;this._cachedTarget.visible=!0,this._cachedTexture&&(this._cachedTexture.destroy(!0),this._cachedTexture=null),this._cachedBounds=this._cachedTarget.localBounds,this._cachedTexture=this._cachedTarget.generateTexture(),this._cachedSprite=new PIXI.Sprite(this._cachedTexture),this._cachedSprite.worldTransform=this._cachedTarget.worldTransform,this._cachedTarget.phaser.anchor&&(this._cachedSprite.anchor=this._cachedTarget.phaser.anchor),this._nodeRenderCanvas||(this._nodeRenderCanvas=this.gameObject.phaser._renderCanvas,this.gameObject.phaser._renderCanvas=this.renderCanvas.bind(this)),this._nodeRenderWebGL||(this._nodeRenderWebGL=this.gameObject.phaser._renderWebGL,this.gameObject.phaser._renderWebGL=this.renderWebGL.bind(this))},o.prototype.onDisable=function(){this._nodeRenderCanvas&&(this.gameObject.phaser._renderCanvas=this._nodeRenderCanvas,this._nodeRenderCanvas=null),this._nodeRenderWebGL&&(this.gameObject.phaser._renderWebGL=this._nodeRenderWebGL,this._nodeRenderWebGL=null),this._cachedTexture&&(this._cachedTexture.destroy(!0),this._cachedTexture=null),this._cachedSprite&&(this._cachedSprite=null),qc.Tween.prototype.onDisable.call(this)},o.prototype.onDestroy=function(){this._nodeRenderCanvas&&(this.gameObject.phaser._renderCanvas=this._nodeRenderCanvas,this._nodeRenderCanvas=null),this._nodeRenderWebGL&&(this.gameObject.phaser._renderWebGL=this._nodeRenderWebGL,this._nodeRenderWebGL=null),this._cachedTexture&&(this._cachedTexture.destroy(!0),this._cachedTexture=null),this._cachedSprite&&(this._cachedSprite=null),qc.Tween.prototype.onDestroy&&qc.Tween.prototype.onDestroy.call(this)},o.prototype.onUpdate=function(e,t){this._factorValue=this.fadeType===o.FADE_IN?1-e:e,t&&!this._cachedTarget._destroy&&this._cachedTarget===this.gameObject&&(this._cachedTarget.visible=this.fadeType===o.FADE_IN)},o.prototype.renderCanvas=function(e){this._cachedTarget!==this.gameObject&&this._nodeRenderCanvas.call(this.gameObject.phaser,e);var t=this._cachedTexture,n=this._cachedSprite,r=this._cachedBounds;if(t){var i=t.baseTexture.resolution/e.resolution;e.context.globalAlpha=n.worldAlpha,e.smoothProperty&&e.scaleMode!==t.baseTexture.scaleMode&&(e.scaleMode=t.baseTexture.scaleMode,e.context[e.smoothProperty]=e.scaleMode===PIXI.scaleModes.LINEAR);var s=t.trim?t.trim.x-n.anchor.x*t.trim.width:n.anchor.x*-t.frame.width,u=t.trim?t.trim.y-n.anchor.y*t.trim.height:n.anchor.y*-t.frame.height;e.roundPixels?(e.context.setTransform(n.worldTransform.a,n.worldTransform.b,n.worldTransform.c,n.worldTransform.d,n.worldTransform.tx*e.resolution|0,n.worldTransform.ty*e.resolution|0),s|=0,u|=0):e.context.setTransform(n.worldTransform.a,n.worldTransform.b,n.worldTransform.c,n.worldTransform.d,n.worldTransform.tx*e.resolution,n.worldTransform.ty*e.resolution);var a=t.crop.width/this.columnCount,f=t.crop.height/this.rowCount,l=this.fadeEffect===o.EFFECT_X||this.fadeEffect===o.EFFECT_XY,c=this.fadeEffect===o.EFFECT_Y||this.fadeEffect===o.EFFECT_XY,h=(l?1-this._factorValue:1)*a/i,p=(c?1-this._factorValue:1)*f/i,d=l&&this.fadeStyle===o.STYLE_CLIP?a*(1-this._factorValue):a,v=c&&this.fadeStyle===o.STYLE_CLIP?f*(1-this._factorValue):f;for(var m=0;m<t.crop.height;m+=f){var g=(u+m+f*(c?this._factorValue:0)*this.pivotY)/i+r.y;for(var y=0;y<t.crop.width;y+=a){var b=(s+y+a*(l?this._factorValue:0)*this.pivotX)/i+r.x;e.context.drawImage(t.baseTexture.source,t.crop.x+y,t.crop.y+m,d,v,b,g,h,p)}}}},o.prototype.renderWebGL=function(e){this._cachedTarget!==this.gameObject&&this._nodeRenderWebGL.call(this.gameObject.phaser,e);var t=this._cachedTexture,n=this._cachedBounds,r=this._cachedSprite,i=t._uvs;if(!i)return;var s=t.baseTexture.resolution/e.resolution,u=t.crop.width/this.columnCount,a=t.crop.height/this.rowCount,f=this.fadeEffect===o.EFFECT_X||this.fadeEffect===o.EFFECT_XY,l=this.fadeEffect===o.EFFECT_Y||this.fadeEffect===o.EFFECT_XY,c=(f?1-this._factorValue:1)*u/s,h=(l?1-this._factorValue:1)*a/s,p=f&&this.fadeStyle===o.STYLE_CLIP?u*(1-this._factorValue):u,d=l&&this.fadeStyle===o.STYLE_CLIP?a*(1-this._factorValue):a,v=r.worldTransform,m=v.a/s,g=v.b/s,y=v.c/s,b=v.d/s,w=v.tx,E=v.ty,S=i.x2-i.x0,x=i.y2-i.y0;for(var T=0;T<t.crop.height;T+=a){var N=(T+a*(l?this._factorValue:0)*this.pivotY)/s+n.y;for(var C=0;C<t.crop.width;C+=u){var k=(C+u*(f?this._factorValue:0)*this.pivotX)/s+n.x;this._webGLAddQuad(e.spriteBatch,r,k,N,k+c,N+h,i.x0+S*C/t.crop.width,i.y0+x*T/t.crop.height,i.x0+S*(C+p)/t.crop.width,i.y0+x*(T+d)/t.crop.height,m,g,y,b,w,E,r.tint)}}},o.prototype._webGLAddQuad=function(e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m){e.currentBatchSize>=e.size&&(e.flush(),e.currentBaseTexture=t.texture.baseTexture);var g=e.colors,y=e.positions,b=e.currentBatchSize*4*e.vertSize;e.renderSession.roundPixels?(y[b]=l*n+h*r+d|0,y[b+1]=p*r+c*n+v|0,y[b+5]=l*i+h*r+d|0,y[b+6]=p*r+c*i+v|0,y[b+10]=l*i+h*s+d|0,y[b+11]=p*s+c*i+v|0,y[b+15]=l*n+h*s+d|0,y[b+16]=p*s+c*n+v|0):(y[b]=l*n+h*r+d,y[b+1]=p*r+c*n+v,y[b+5]=l*i+h*r+d,y[b+6]=p*r+c*i+v,y[b+10]=l*i+h*s+d,y[b+11]=p*s+c*i+v,y[b+15]=l*n+h*s+d,y[b+16]=p*s+c*n+v),y[b+2]=o,y[b+3]=u,y[b+7]=a,y[b+8]=u,y[b+12]=a,y[b+13]=f,y[b+17]=o,y[b+18]=f,g[b+4]=g[b+9]=g[b+14]=g[b+19]=(m>>16)+(m&65280)+((m&255)<<16)+(t.worldAlpha*255<<24),e.sprites[e.currentBatchSize++]=t},o.FADE_IN=0,o.FADE_OUT=1,o.STYLE_ZOOM=0,o.STYLE_CLIP=1,o.EFFECT_XY=0,o.EFFECT_X=1,o.EFFECT_Y=2,qc.keepRunning={},e.G=qc.keepRunning.G={},G.bgRun=!0,G.distance=0,G.offset=4,qc.initGame=function(e){e.log.trace("Start the game logic."),G.game=e};var u=qc.defineBehaviour("qc.demo.LoadingUI",qc.Behaviour,function(){this.clue=null,this.bg=null},{clue:qc.Serializer.NODE,bg:qc.Serializer.NODE});u.prototype.awake=function(){var e=this;e.game.state.onStartLoad.add(function(){e.show()}),e.game.state.onEndLoad.add(function(){e.gameObject.visible&&(e.duringTween?e.nextChange=1:e.hide())})},u.prototype.update=function(){var e=this,t=e.game.assets.loaded,n=e.game.assets.total;n?e.clue.text="拼命加载中：... "+t+"/"+n:e.clue.text="",e.gameObject.parent.setChildIndex(this.gameObject,e.gameObject.parent.children.length-1)},u.prototype.show=function(){var e=this,t=e.gameObject.getScript("qc.Plugins.NodeFadeInOut");e.gameObject.visible=!0,e.gameObject.alpha=0,t.stop(),t.enable=!1,t.target=e.gameObject.game.world,t.fadeType=o.FADE_OUT,t.fadeStyle=this.getRandomInt(0,2),t.fadeEffect=this.getRandomInt(0,3),t.pivotX=Math.random(0,1),t.pivotY=Math.random(0,1),t.columnCount=this.getRandomInt(1,32),t.rowCount=this.getRandomInt(1,32),t.resetToBeginning(),t.playForward(),e.gameObject.alpha=1,e.duringTween=!0,t.onFinished.addOnce(function(){e.duringTween=!1,e.nextChange&&(e.hide(),e.nextChange=0)})},u.prototype.hide=function(){var e=this,t=e.gameObject.getScript("qc.Plugins.NodeFadeInOut");e.gameObject.alpha=1,t.enable=!1,t.target=null,t.fadeType=o.FADE_OUT,t.fadeStyle=this.getRandomInt(0,2),t.fadeEffect=this.getRandomInt(0,3),t.pivotX=Math.random(0,1),t.pivotY=Math.random(0,1),t.columnCount=this.getRandomInt(1,32),t.rowCount=this.getRandomInt(1,32),t.resetToBeginning(),t.playForward(),e.duringTween=!0,t.onFinished.addOnce(function(){e.gameObject.visible=!1,e.duringTween=!1,e.nextChange=0})},u.prototype.getRandomInt=function(e,t){return Math.floor(Math.random()*(t-e))+e};var a=qc.defineBehaviour("qc.engine.bgLoop",qc.Behaviour,function(){this.bg1=null,this.bg2=null},{bg1:qc.Serializer.NODE,bg2:qc.Serializer.NODE});a.prototype.update=function(){G.bgRun==1&&(G.distance++,this.bg1&&(this.bg1.y=this.bg1.y-G.offset,this.bg1.y<-this.bg1.height&&(this.bg1.y=this.bg1.height-10)),this.bg2&&(this.bg2.y=this.bg2.y-G.offset,this.bg2.y<-this.bg2.height&&(this.bg2.y=this.bg2.height-10)))};var f=qc.defineBehaviour("qc.engine.startGameBtnClicked",qc.Behaviour,function(){this.scene=""},{scene:qc.Serializer.STRING});f.prototype.onClick=function(){var e=this,t=function(){e.game.state.load(e.scene,!1,function(){},function(){console.log(e.scene+"场景加载完毕。")})};e.game.timer.add(1,t)};var l=qc.defineBehaviour("qc.engine.gameJs",qc.Behaviour,function(){var e=this;e.timerCreateEnemy=null,e.player=null},{player:qc.Serializer.NODE});l.prototype.awake=function(){this.timerCreateEnemy=G.game.timer.loop(5e3,this.createEnemy,this)},l.prototype.update=function(){},l.prototype.createEnemy=function(){var e=this;G.bgRun===!0&&G.game.assets.load("fence","Assets/prefab/fence.bin",function(t){var n=G.game.assets.find("fence"),r=G.game.add.clone(n),i=r.getScript("qc.arcade.RigidBody");i.addCollide(e.player)})};var c=qc.defineBehaviour("qc.engine.fenceJs",qc.Behaviour,function(){this.fence=null,this.player=null},{fence:qc.Serializer.NODE,player:qc.Serializer.NODE});c.prototype.awake=function(){},c.prototype.update=function(){},c.prototype.onCollide=function(e,t){G.bgRun=!1},c.prototype.onClick=function(){this.gameObject.destroy(),G.bgRun=!0}}).call(this,this,Object)