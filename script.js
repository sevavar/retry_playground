


// Matter.js setup imports
const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Composite, Query } = Matter;

// Set up engine, world, and renderer
const engine = Engine.create();
const world = engine.world;

engine.world.gravity.x = 0;
engine.world.gravity.y = 0;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'rgba(0,0,0,0)',
    pixelRatio: '1'
  }
});

// Keep the renderer and runner initialization
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);



// Define portfolio items
const portfolioItems = [
  { image: 'assets/vanscans.png', preview: 'assets/vanscans.mp4', link: 'https://vanscans.racing', name: 'vanscans.racing', shape: 'circle' },
  { image: 'assets/intertapes.png', preview: 'assets/intertapes.mp4', link: 'https://intertapes.net', name: 'intertapes.net', shape: 'rect' },
  { image: 'assets/sickmerch.png', preview: 'assets/sickmerch.mp4', link: 'https://t.me/sickmerch', name: 'sickmerch blog', shape: 'circle' },
  { image: 'assets/uglyph.png', preview: 'assets/uglyph.mp4', link: 'https://uglyph.xyz', name: 'uglyph.xyz', shape: 'rect' },
  { image: 'assets/detroit.png', preview: 'assets/detroitmono.mp4', link: 'https://project3.com', name: 'detroit mono typeface', shape: 'rect' },
  { image: 'assets/s44.png', link: 'https://sevavar.com/oct', name: 's44', shape: 'rect' },
  { image: 'assets/routegen.png', link: 'https://sevavar.com/oct', name: 'path solver tool', shape: 'rect' },
  { image: 'assets/mona.png', link: 'https://sevavar.com/oct', name: 'mona', shape: 'rect' },
  //{ image: 'assets/tripreport.png', link: 'https://tripreport.sevavar.com', name: 'trip report', shape: 'rect' },
  //{ image: 'assets/testcard.png', link: 'https://tripreport.sevavar.com', name: 'test card generator', shape: 'rect' }
];

// Hover text element setup
const hoverText = document.createElement("div");
hoverText.style.position = "absolute";
hoverText.style.color = "white";
hoverText.style.padding = "5px";
hoverText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
hoverText.style.display = "none"; // Hidden by default
document.body.appendChild(hoverText);

// Animation preview element setup
const animationPreview = document.createElement("video");
animationPreview.style.position = "absolute";
animationPreview.style.height = "400px"; // Set width based on your design
animationPreview.style.width = "auto"; // Maintain aspect ratio
animationPreview.style.display = "none"; // Hidden by default
animationPreview.loop = true; // Loop the animation
animationPreview.muted = true; // Mute to allow autoplay
animationPreview.style.zIndex = '10';
document.body.appendChild(animationPreview);




// Load portfolio items as sprites
portfolioItems.forEach((item) => {
const { image, preview, link, name, shape } = item;  
const img = new Image();
img.src = image;

const randAngle = 180 * Math.random() * (Math.PI / 180);

img.onload = function() {
  const width = img.naturalWidth;
  const height = img.naturalHeight;

  const x = Math.random() * (window.innerWidth - width); // Adjust layout based on window size
  const y = Math.random() * (window.innerHeight - height);

  let sprite;
  if (shape === 'rect') {


  sprite = Bodies.rectangle(x, y, width, height, {
    angle: randAngle,
    restitution: 0.8,
    friction: 0,
    frictionAir: 0,
    render: {
      sprite: {
        texture: image,
        xScale: 1, // Adjust these for proper scaling
        yScale: 1
      }
    },
    label: name // Add label for easy reference
  });
  
} else if (shape === 'circle') {

  sprite = Bodies.circle(x, y, width/2, {
    angle: randAngle,
    restitution: 0.8,
    friction: 0.1,
    frictionAir: 0.02,
    render: {
      sprite: {
        texture: image,
        xScale: 1, // Adjust these for proper scaling
        yScale: 1
      }
    },
    label:name
  }); 
}

  const randomVelocityX = (Math.random() - 0.5) * 2; 
  const randomVelocityY = (Math.random() - 0.5) * 2;
  Matter.Body.setVelocity(sprite, { x: randomVelocityX, y: randomVelocityY });
  

  // Add the sprite to the Matter.js world
  World.add(world, sprite);
};
});



let isDragging = false; // Flag to track dragging state

// Add mouse control for dragging and other interactions
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 1.9,
    render: { visible: false }
  }
});

World.add(world, mouseConstraint);

// Update render mouse object
render.mouse = mouse;

// Prevent from false clicks on drag
mouseConstraint.mouse.element.addEventListener('mousedown', () => {
  isDragging = false;
});

// Detect dragging
mouseConstraint.mouse.element.addEventListener('mousemove', () => {
  if (mouseConstraint.body) {
    isDragging = true;
  }
});

// Release dragging
mouseConstraint.mouse.element.addEventListener('mouseup', () => {
  setTimeout(() => { isDragging = false; }, 1);
  //hoverText.style.display = "none";
});


// render.canvas.addEventListener('mouseleave', function () {
//   hoverText.style.display = "none"; // Hide on leave
//   animationPreview.style.display = "none"; // Hide animation on leave
//   animationPreview.pause(); // Pause the animation
//   animationPreview.src = ""; // Clear the source to reset
// });

// Canvas event listeners for hover and click detection
render.canvas.addEventListener('mousemove', function (event) {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY
  };

  // Detect hover over any sprite
  const hoveredSprite = Query.point(Composite.allBodies(world), mousePosition)
    .find(body => portfolioItems.some(item => item.name === body.label));

  if (hoveredSprite) {
    const item = portfolioItems.find(i => i.name === hoveredSprite.label);
    hoverText.style.left = `${mousePosition.x}px`;
    hoverText.style.top = `${mousePosition.y - 30}px`; // Position above sprite
    hoverText.style.display = "block";
    hoverText.innerText = item.name;

    //  if (item.preview) { // Ensure the preview link exists
    //   animationPreview.src = item.preview; // Get the preview link from the portfolio item
    //   animationPreview.style.left = `${mousePosition.x}px`;
    //   animationPreview.style.top = `${mousePosition.y + 5}px`; // Position below hover text
    //   animationPreview.style.display = "block"; // Show the preview
    //   animationPreview.play(); // Play the animation
    // }
     
  } else {
    hoverText.style.display = "none"; // Hide if no sprite is hovered
    setTimeout(() => { animationPreview.style.display = "none"; }, 1000); // Hide animation if not hovered
  }
});

render.canvas.addEventListener('click', function (event) {
  if (isDragging) return; // Prevent click action if dragging occurred

  // Direct mapping of the mouse position to canvas coordinates
  const canvasBounds = render.canvas.getBoundingClientRect();
  const mousePosition = {
    x: (event.clientX - canvasBounds.left) * (render.options.width / canvasBounds.width),
    y: (event.clientY - canvasBounds.top) * (render.options.height / canvasBounds.height)
  };

  // Check if any sprite is clicked
  const clickedSprite = Query.point(Composite.allBodies(world), mousePosition)
    .find(body => portfolioItems.some(item => item.name === body.label));

  if (clickedSprite) {
    const item = portfolioItems.find(i => i.name === clickedSprite.label);
    if (item && item.link) {
      window.open(item.link, '_blank'); // Open project link in new tab
    }
  }
});


// Keep Render lookAt to ensure all sprites are visible on the canvas
Render.lookAt(render, { min: { x: 0, y: 0 }, max: { x: window.innerWidth, y: window.innerHeight } });







let wallThickness = 1000;
// // Add floor and walls to contain the sprite
const floor = Bodies.rectangle(window.innerWidth / 2, window.innerHeight+wallThickness/2, window.innerWidth, wallThickness, { isStatic: true });
const ceiling = Bodies.rectangle(window.innerWidth / 2, -wallThickness/2, window.innerWidth, wallThickness, { isStatic: true });
const wallLeft = Bodies.rectangle(-wallThickness/2, window.innerHeight / 2, wallThickness, window.innerHeight, { isStatic: true });
const wallRight = Bodies.rectangle(window.innerWidth+wallThickness/2, window.innerHeight / 2 , wallThickness, window.innerHeight, { isStatic: true});



World.add(world, [floor, ceiling, wallLeft, wallRight]);


// Function to generate random polygon vertices
function generateRandomPolygon(centerX, centerY, minVertices = 4, maxVertices = 8, radius = 1) {
  const verticesCount = Math.floor(Math.random() * (maxVertices - minVertices + 1)) + minVertices; // Random number of vertices between min and max
  const vertices = [];

  for (let i = 0; i < verticesCount; i++) {
      const angle = (i * 2 * Math.PI) / verticesCount; // Calculate angle for each vertex
      const x = centerX + Math.cos(angle) * (Math.random() * radius); // Random radius
      const y = centerY + Math.sin(angle) * (Math.random() * radius);
      vertices.push({ x, y }); // Add vertex to the array
  }

  return vertices; // Return the generated vertices
}


// const info = Bodies.rectangle(window.innerWidth / 2, window.innerHeight / 2, 500, 170, { // Adjust dimensions if needed
//   isStatic: true,
//   //angle: Math.PI / 4,
//   render: {
//     fillStyle: '#000000'
//   }
// });
// World.add(world, info);


// const randomVertices = generateRandomPolygon(window.innerWidth / 2, window.innerHeight / 2, 4, 10, 500); // Adjust radius as needed
// const infoPolygon = Bodies.fromVertices(window.innerWidth / 2, window.innerHeight / 2, randomVertices, {
//   isStatic: true,
//   render: {
//       fillStyle: '#000000' // Color of the polygon
//   }
// });

// World.add(world, infoPolygon);

// Create the text container div
const textContainer = document.createElement('div');
textContainer.id = 'text-container';
textContainer.style.position = 'absolute';
textContainer.style.top = '50%';
textContainer.style.left = '50%';
textContainer.style.transform = 'translate(-50%, -50%)';
textContainer.style.color = 'white';
textContainer.style.textAlign = 'center';
textContainer.style.zIndex = '1'; // Set to a low z-index so videos overlay it

// // Add content to the text container
// textContainer.innerHTML = `
    
  
//     <span class="label-left"><img src="assets/retry-logo-white.svg" alt="icon" style="width:500px; vertical-align:bottom"></span>
// `;

// // Append the text container to the body
// document.body.appendChild(textContainer);


const patternCanvas = document.createElement('canvas');
document.body.appendChild(patternCanvas);
const ctx = patternCanvas.getContext('2d');

const colors = ['#222222', '#333333'];


const drawPattern = (gridSize) => {
  const width = window.innerWidth;
  const height = window.innerHeight;


  patternCanvas.width = width;
  patternCanvas.height = height;


  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      ctx.fillStyle = colors[(Math.floor(x / gridSize) + Math.floor(y / gridSize)) % colors.length];
      ctx.fillRect(x, y, gridSize, gridSize);
    }
  }
};


let gridSize = 10;
drawPattern(gridSize);

//document.body.style.backgroundImage = `url(${patternCanvas.toDataURL()})`;
//document.body.style.backgroundSize = 'cover';