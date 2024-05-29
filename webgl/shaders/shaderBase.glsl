

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex;



void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float ty = smoothstep(0.3, 0.5, st.y);
  float tx = smoothstep(0.3, 0.5, st.x);

  float ratio = u_resolution.x/u_resolution.y;
  float l = distance(vec2(st.x, st.y / ratio ), vec2(0.5, 0.5 / ratio ));
  float color = smoothstep(0.3, 0.35, l) + (1.0 - smoothstep(0.25,0.28, l)) ;

  gl_FragColor = vec4(color, color, color, 1.0);
  // gl_FragColor=vec4(0, st.y, 0, 1.0);
}
