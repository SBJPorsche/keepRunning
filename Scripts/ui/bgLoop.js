// define a user behaviour
var bgLoop = qc.defineBehaviour('qc.engine.bgLoop', qc.Behaviour, 
    function() {
        this.bg1 = null;    
    	this.bg2 = null;
    },
    {
        // 需要序列化的字段
        bg1: qc.Serializer.NODE,
    	bg2:qc.Serializer.NODE
    }
);

// Awake is called when the script instance is being loaded.
//bgLoop.prototype.awake = function() {
//
//};

// Update is called every frame, if the behaviour is enabled.
bgLoop.prototype.update = function() {
// 	if ( G.bgRun == true) {
//         G.distance ++ ;
//         if(this.bg1){
//         	this.bg1.y = this.bg1.y - G.offset;
//             if (this.bg1.y < -this.bg1.height) {
//                 this.bg1.y = this.bg1.height-10;
//             };
//         }
//         if(this.bg2){
//             this.bg2.y = this.bg2.y - G.offset;
//             if (this.bg2.y < -this.bg2.height) {
//                 this.bg2.y = this.bg2.height-10;
//             };   
//         }
//     };
};
