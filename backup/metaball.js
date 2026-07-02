const menuItems = document.querySelectorAll('.menu-item');
const svgPath = document.getElementById('metaball-path');
const menuContainer = document.getElementById('menu');
const cursor = document.querySelector('.small');

// Function to calculate distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to generate metaball path
function generateMetaballPath(radius1, radius2, center1, center2) {
  const handleLength = 2.4;
  const d = distance(center1[0], center1[1], center2[0], center2[1]);

  // Early exit if distance is too large
  if (d > radius1 + radius2) return '';

  const u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d));
  const u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d));

  const angle1 = Math.atan2(center2[1] - center1[1], center2[0] - center1[0]);
  const angle2 = Math.acos((radius1 - radius2) / d);

  const p1a = [
    center1[0] + radius1 * Math.cos(angle1 + u1),
    center1[1] + radius1 * Math.sin(angle1 + u1),
  ];
  const p1b = [
    center1[0] + radius1 * Math.cos(angle1 - u1),
    center1[1] + radius1 * Math.sin(angle1 - u1),
  ];
  const p2a = [
    center2[0] + radius2 * Math.cos(angle1 + Math.PI - u2),
    center2[1] + radius2 * Math.sin(angle1 + Math.PI - u2),
  ];
  const p2b = [
    center2[0] + radius2 * Math.cos(angle1 - Math.PI + u2),
    center2[1] + radius2 * Math.sin(angle1 - Math.PI + u2),
  ];

  return `
    M${p1a[0]},${p1a[1]}
    C${p1a[0] + handleLength},${p1a[1]},
     ${p2a[0] - handleLength},${p2a[1]},
     ${p2a[0]},${p2a[1]}
    A${radius2},${radius2} 0 1,1 ${p2b[0]},${p2b[1]}
    C${p2b[0] + handleLength},${p2b[1]},
     ${p1b[0] - handleLength},${p1b[1]},
     ${p1b[0]},${p1b[1]}
    A${radius1},${radius1} 0 1,0 ${p1a[0]},${p1a[1]}
  `;
}

// Update metaball path on mouse move
document.addEventListener('mousemove', (e) => {
  const cursorX = e.clientX;
  const cursorY = e.clientY;

  // Update cursor position
  cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px)`;

  menuItems.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemX = rect.left + rect.width / 2;
    const itemY = rect.top + rect.height / 2;
    const metaballPath = generateMetaballPath(25, 15, [itemX, itemY], [cursorX, cursorY]);
    svgPath.setAttribute('d', metaballPath);
    
    // Change color based on proximity
    const distanceToCursor = distance(cursorX, cursorY, itemX, itemY);
    if (distanceToCursor < 100) {
      svgPath.setAttribute('stroke', 'orange');
      item.style.color = 'orange';
    } else {
      svgPath.setAttribute('stroke', 'rgba(0, 0, 0, 0.489)');
      item.style.color = '';
    }
  });
});

// Reset menu item color on mouseout
menuContainer.addEventListener('mouseout', () => {
  menuItems.forEach(item => {
    item.style.color = '';
  });
  svgPath.setAttribute('stroke', 'rgba(0, 0, 0, 0.489)');
});