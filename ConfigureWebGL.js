// Configure WebGL Settings
function configWebGL() {
  // Initialize the WebGL context
  gl = WebGLUtils.setupWebGL(canvas);

  // Check if WebGL is available
  if (!gl) {
    alert("WebGL isn't available");
  }

  // Set the viewport and clear the color
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Enable hidden-surface removal
  gl.enable(gl.DEPTH_TEST);

  // Compile the vertex and fragment shaders and link to WebGL
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Create buffers and link them to the corresponding attribute variables in vertex and fragment shaders
  // Buffer for positions
  pBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Buffer for normals
  nBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

  vNormal = gl.getAttribLocation(program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  // Get the location of the uniform variables within a compiled shader program
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
  normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");

  gl.uniform1i(gl.getUniformLocation(program, "isSpotlight"), 0);
  gl.uniform3fv(
    gl.getUniformLocation(program, "spotlightDir"),
    flatten(vec3(0, -1, 0))
  );
  gl.uniform1f(
    gl.getUniformLocation(program, "spotlightCutoff"),
    Math.cos((45 * Math.PI) / 180)
  );

  gl.uniform4fv(gl.getUniformLocation(program, "lightPos"), flatten(lightPos));

  // Inside configWebGL() or init(), after program setup:
  ambientProductLoc = gl.getUniformLocation(program, "ambientProduct");
  diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
  specularProductLoc = gl.getUniformLocation(program, "specularProduct");
  shininessLoc = gl.getUniformLocation(program, "shininess");

  // Texture coordinate buffer
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(texCoordsArray),
    gl.STATIC_DRAW
  );

  const vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  // Add texture uniforms
  uTextureLoc = gl.getUniformLocation(program, "uTexture");
  uUseTextureLoc = gl.getUniformLocation(program, "uUseTexture");
}

// Concatenate the corresponding shape's values
function concatData(vertices, normals, texCoords = []) {
  for (let i = 0; i < vertices.length; i++) {
    // Flatten vertex (4 components)
    pointsArray.push(...vertices[i]);
    // Flatten normal (3 components)
    normalsArray.push(...normals[i].slice(0, 3));
    // Texture coordinates (if available)
    if (i < texCoords.length) {
      texCoordsArray.push(...texCoords[i]);
    } else {
      texCoordsArray.push(0, 0); // Default if not provided
    }
  }
}
