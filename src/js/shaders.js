export const vertex_shader_source=`precision highp float;

attribute vec4 coord;
attribute vec3 norm;
attribute vec2 texCoord;
attribute vec3 color;

// параметры преобразований
uniform mat4 transform_model;
uniform mat4 transform_view;
uniform mat4 transform_projection;
uniform mat3 transform_normal;
uniform vec3 transform_viewPosition;

// параметры точечного источника освещения
uniform vec4 light_position;

// параметры для фрагментного шейдера
varying vec2 vert_texcoord;   // текстурные координаты
varying vec3 vert_normal;     // нормаль
varying vec3 vert_lightDir;   // направление на источник освещения
varying vec3 vert_viewDir;    // направление от вершины к наблюдателю
varying float vert_distance;  // расстояние от вершины до источника освещения
varying vec3 vert_color;

void main(){
	vec4 vertex = transform_model * coord;
	vec4 lightDir = light_position - vertex;
	gl_Position = transform_projection * transform_view * vertex;

	vert_texcoord = texCoord;
	vert_normal = transform_normal * norm;
	vert_lightDir = vec3(lightDir);
	vert_viewDir = transform_viewPosition - vec3(vertex);
	vert_distance = length(lightDir);
	vert_color = color;
}
`
export const frag_shader_source=`precision highp float;


// параметры точечного источника освещения
uniform vec4 light_ambient;
uniform vec4 light_diffuse;
uniform vec4 light_specular;
uniform vec3 light_attenuation;

// параметры материала
uniform vec4 material_ambient;
uniform vec4 material_diffuse;
uniform vec4 material_specular;
uniform vec4 material_emission;
uniform float material_shininess;

// параметры, полученные из вершинного шейдера
varying vec2 vert_texcoord;   // текстурные координаты
varying vec3 vert_normal;     // нормаль
varying vec3 vert_lightDir;   // направление на источник освещения
varying vec3 vert_viewDir;    // направление от вершины к наблюдателю
varying float vert_distance;  // расстояние от вершины до источника освещения
varying vec3 vert_color;

void main(){
	vec3 normal = normalize(vert_normal);
	vec3 lightDir = normalize(vert_lightDir);
	vec3 viewDir = normalize(vert_viewDir);

	float attenuation = 1.0;
	if(length(light_attenuation) != 0.0)
		 attenuation = 1.0 / (light_attenuation[0] + light_attenuation[1] * vert_distance + light_attenuation[2] * vert_distance * vert_distance);

	gl_FragColor = material_emission;
	gl_FragColor += material_ambient * light_ambient;
	float Ndot = max(dot(normal, lightDir), 0.0);
  if(Ndot>0.0){
	   gl_FragColor += material_diffuse * light_diffuse * Ndot;
     float RdotVpow =pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), material_shininess);
	   //gl_FragColor += material_specular * light_specular* RdotVpow;
  }
  gl_FragColor *= vec4(vert_color,1);

}
`
