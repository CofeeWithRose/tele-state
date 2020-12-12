attribute vec2 a_position;

uniform vec2 w_size;

void main(){
  gl_Position = vec4( (a_position/ w_size) * 2.0 -1.0 ,0 ,1);
}
