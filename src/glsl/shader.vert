var vert_shader_source=`#version 300 es
precision mediump float;

in vec4 coord;
in vec3 norm;
in vec2 texCoord;
in vec3 color;

// параметры преобразований
uniform mat4 transform_model;
uniform mat4 transform_viewProjection;
uniform mat3 transform_normal;
uniform vec3 transform_viewPosition;

// параметры точечного источника освещения
uniform vec4 light_position;

// параметры для фрагментного шейдера
out vec2 vert_texcoord;   // текстурные координаты
out vec3 vert_normal;     // нормаль
out vec3 vert_lightDir;   // направление на источник освещения
out vec3 vert_viewDir;    // направление от вершины к наблюдателю
out float vert_distance;  // расстояние от вершины до источника освещения
out vec3 vert_color;

void main(){
	vec4 vertex = transform_model * coord;
	vec4 lightDir = light_position - vertex;
	gl_Position = transform_viewProjection * vertex;

	vert_texcoord = texCoord;
	vert_normal = transform_normal * norm;
	vert_lightDir = vec3(lightDir);
	vert_viewDir = transform_viewPosition - vec3(vertex);
	vert_distance = length(lightDir);
	vert_color = color;
}
`
