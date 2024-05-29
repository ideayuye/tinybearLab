

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D tex;

float plot(vec2 st,float pct){
    return smoothstep(pct-0.005,pct,st.y) - smoothstep(pct,pct+0.005,st.y);
}

//ripple
vec3 ripple(){
    vec2 cPos = -1.0 + 2.0*gl_FragCoord.xy/u_resolution.xy;
    float cLength = length(cPos);
    vec2 uv = gl_FragCoord.xy/u_resolution.xy + (cPos/cLength)*sin(cLength*12.0-u_time*2.0)*0.01;

    vec3 col = texture2D(tex,uv).xyz;
    return col;
}

//混合颜色
vec3 mixColor(vec2 st){
    vec3 clr1 = vec3(0.7,0.0,0.0);
    vec3 clr2 = vec3(0.0,0.9,0.0);

    float t = step(0.33,st.y)*(1.0-step(0.66,st.y)) + step(0.66,st.y)*0.3;

    return mix(clr1,clr2,t);
}

//绘制长方形
vec3 rectangle(vec2 st){
    vec3 color = vec3(1.0);
    /*color = step(0.1,st.x)*color;
    color = step(0.1,st.y)*color;
    color = (1.0-step(0.9,st.x))*color;
    color = (1.0-step(0.9,st.y))*color;*/

    color = smoothstep(0.0,0.1,st.x)*color;
    color = smoothstep(0.0,0.1,st.y)*color;
    color = (1.0-smoothstep(0.9,1.0,st.x))*color;
    color = (1.0-smoothstep(0.9,1.0,st.y))*color;

    return color;
}

vec3 circle(vec2 st,float r){
    vec2 center = vec2(0.5);

    float l = distance(center,st);
    vec3 color = vec3(step(r,l));

    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    float y = sin(st.x)/st.x;

    vec3 color = vec3(y);

    float pct = plot(st,y);
    //color = (1.0-pct)*color + pct*vec3(0.0,1.0,0.0);
    // color = pct*vec3(0.0,1.0,0.0);

    color = ripple();

    // color = mixColor(st);
    // color = rectangle(st);
    // color = circle(st,0.2);

    gl_FragColor=vec4(color, 1.0);
}

