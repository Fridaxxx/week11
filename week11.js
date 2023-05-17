const svg = document.getElementById('svg-canvas');
const width = window.innerWidth;
const height = window.innerHeight;

window.addEventListener("resize", resizeSvg);

function resizeSvg(){
    let bbox = svg.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);

    for(let circle of svg.children){
        circle.setAttribute('cr',  Math.min(bbox.width, bbox.height) * 0.1);
    }
}


let slimes = [];

function createFood(x, y) {
  const food = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  food.setAttribute('cx', x);
  food.setAttribute('cy', y);
  food.setAttribute('r', '4');
  food.setAttribute('fill', 'purple');
  svg.appendChild(food);
}

function createSlime(x, y) {
  const slime = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  slime.setAttribute('cx', x);
  slime.setAttribute('cy', y);
  slime.setAttribute('r', '3');
  slime.setAttribute('fill', 'pink');
  svg.appendChild(slime);
  
  return {
    element: slime,
    targetFood: null,
    move: function() {
      if (this.targetFood) {
       
        const dx = this.targetFood.cx.baseVal.value - x;
        const dy = this.targetFood.cy.baseVal.value - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 3; 
        
        if (distance > speed) {
          x += (dx / distance) * speed;
          y += (dy / distance) * speed;
        } else {
          
          this.targetFood = null;
        }
      } else {
        
        const angle = Math.random() * Math.PI * 2;
        const speed = 1; 
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        
        x += dx;
        y += dy;
      }
      
      
      slime.setAttribute('cx', x);
      slime.setAttribute('cy', y);
    }
  };
}


svg.addEventListener('click', function(event) {
  const x = event.clientX;
  const y = event.clientY;
  
  createFood(x, y);
  
  
  for (const slime of slimes) {
    slime.targetFood = { cx: { baseVal: { value: x } }, cy: { baseVal: { value: y } } };
  }
});


for (let i = 0; i < 50; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  
  const slime = createSlime(x, y);
  slimes.push(slime);
}


function animate() {
  for (const slime of slimes) {
    slime.move();
  }
  
  requestAnimationFrame(animate);
}

animate();