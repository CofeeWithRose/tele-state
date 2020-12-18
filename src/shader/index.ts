export const VERTEX_SHADER = `
    uniform vec2 u_windowSize;

    attribute vec3 a_position;
    attribute vec2 a_size;
    attribute vec2 a_texCoord;

    varying vec2 v_texCoord;

    void main() {
        v_texCoord = a_texCoord;
        vec2 position = vec2(a_position.x, a_position.y);

        if(a_position.z <= 1.0){
            // 第1个点
            gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            return;
        } 
        if( a_position.z <= 2.0  ){
            // 第二个点
            gl_Position = vec4(( (position + vec2(a_size.x*2.0,0))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            return;
        }
        if( a_position.z <= 3.0  ){
            // 第3个点
            gl_Position = vec4(( (position + vec2(0, a_size.y*2.0))/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
            return;
        }
        gl_Position = vec4((position/u_windowSize *2.0 -1.0) * vec2(1, -1), 1,1);
    }
`

export const FRAGMENT_SHADER =`
    precision highp float;

    uniform sampler2D u_image;

    varying vec2 v_texCoord;

    void main(){
        gl_FragColor = texture2D(u_image, v_texCoord);
    }
`