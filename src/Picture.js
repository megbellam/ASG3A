class Picture{
    constructor(){
         this.type='circle';
         this.position = [0.0, 0.0, 0.0];
         this.color = [0.0, 1.0, 0.0, 1.0];
         this.size = 5.0;
         this.segments = 10;
     }
 
   // Render this shape
   render() {
    let green = [0.02, 1.0, 0.05, 1.0];
    let darkgreen = [0.04, 0.39, 0.1, 1.0];
    let brown = [0.5, 0.25, 0.0, 1.0];
    let lightbrown = [0.5, 0.45, 0.3, 1.0];
    let black = [0.0, 0.0, 0.0, 1.0];
    
    
     var xy = this.position;
     var rgba = this.color;
     var size = this.size;
     var segments = this.segments;

     this.color = brown;
     rgba = this.color;
     //We have 4f below as we are passing 4 floating point values
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     drawTriangle( [0,-0.2,0.1,-0.1,0.1,-0.2] );
     drawTriangle( [0,-0.2,0.0,-0.1,0.1,-0.1] );
     drawTriangle( [-0.1,-0.2,0.0,-0.1,0.0,-0.2] );
     drawTriangle( [-0.1,-0.2,-0.1,-0.1,0.0,-0.1] );
     drawTriangle( [-0.1,-0.1,0.0,0.0,0.0,-0.1] );
     drawTriangle( [-0.1,-0.1,-0.1,0.0,0.0,0.0] );
     drawTriangle( [0.0,-0.1,0.1,0.0,0.1,-0.1] );
     drawTriangle( [0.0,-0.1,0.0,0.0,0.1,0.0] );
     drawTriangle( [0.0,0.0,0.1,0.1,0.1,0.0] );
     drawTriangle( [0.0,0.0,0.0,0.1,0.1,0.1] );
     drawTriangle( [-0.1,0.0,0.0,0.1,0.0,0.0] );
     drawTriangle( [-0.1,0.0,-0.1,0.1,0.0,0.1] );

     this.color = green;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     drawTriangle( [-0.5,0.1,0.0,0.6,0.5,0.1] );

     this.color = darkgreen;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     drawTriangle( [-0.4,0.3,0.0,0.7,0.4,0.3] );

     this.color = green;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     drawTriangle( [-0.3,0.5,0.0,0.8,0.3,0.5] );
     
     this.color = darkgreen;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     drawTriangle( [-0.2,0.7,0.0,0.9,0.2,0.7] );

     this.color = brown;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     drawTriangle( [0.1,-0.2,0.1,-0.3,0.2,-0.3] );
     drawTriangle( [0.1,-0.3,0.1,-0.4,0.0,-0.4] );
     drawTriangle( [0.1,-0.4,0.2,-0.5,0.1,-0.5] );
     drawTriangle( [-0.1,-0.2,-0.1,-0.3,-0.2,-0.3] );
     drawTriangle( [-0.1,-0.3,-0.1,-0.4,0.0,-0.4] );
     drawTriangle( [-0.1,-0.4,-0.2,-0.5,-0.1,-0.5] );

     this.color = black;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     drawTriangle( [0.0,0.0,-0.05,0.0,-0.025,-0.025] );
     drawTriangle( [0.0,0.0,0.05,0.0,0.025,-0.025] );

     this.color = lightbrown;
     rgba = this.color;
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     drawTriangle( [-0.1,-0.3,0.0,-0.4,0.1,-0.3] );
     drawTriangle( [-0.1,-0.2,-0.1,-0.3,0.1,-0.2] );
     drawTriangle( [-0.1,-0.3,0.1,-0.2,0.1,-0.3] );


   }
 }