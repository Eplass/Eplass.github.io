const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray

const mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80)
}

// mouse detect
window.addEventListener('mousemove',
  function (event) {
    mouse.x = event.x
    mouse.y = event.y
  }
)

// particle creation
class Particle {
  constructor (x, y, dirX, dirY, size, color) {
    this.x = x
    this.y = y
    this.dirX = dirX
    this.dirY = dirY
    this.size = size
    this.color = color
  }

  // draw method
  draw () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false)
    ctx.fillStyle = '#000'
    ctx.fill()
  }

  // update particle position
  update () {
    // reverse direction on canvas border
    if (this.x > canvas.width || this.x < 0) {
      this.dirX = -this.dirX
    }
    if (this.y > canvas.height || this.y < 0) {
      this.dirY = -this.dirY
    }

    // particle/mouse collision detection (may not implement)
    /* const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10
      }
    }
    */
    // move particle
    this.x += this.dirX / 2
    this.y += this.dirY / 2
    this.draw()
  }
}

// fill particle array
function init () {
  particlesArray = []
  const numParticles = (canvas.height * canvas.width) / 9000
  for (let i = 0; i < numParticles; i++) {
    const size = (Math.random() * 5) + 1
    const x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2)
    const y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2)
    const dirX = (Math.random() * 5) - 2.5
    const dirY = (Math.random() * 5) - 2.5
    const color = '#000'

    particlesArray.push(new Particle(x, y, dirX, dirY, size, color))
  }
}
function connect () {
  let opacity = 1
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i; j < particlesArray.length; j++) {
      const distance = ((particlesArray[i].x - particlesArray[j].x) * (particlesArray[i].x - particlesArray[j].x) +
       (particlesArray[i].y - particlesArray[j].y) * (particlesArray[i].y - particlesArray[j].y))
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacity = 1 - (distance / 10000)
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
        ctx.stroke()
      }
    }
  }
}

// animation
function animate () {
  window.requestAnimationFrame(animate)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update()
  }
  connect()
}

// resize
window.addEventListener('resize',
  function () {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80))
    init()
  }
)
// mouse off screen
window.addEventListener('mouseout',
  function () {
    mouse.x = undefined
    mouse.y = undefined
  }
)
init()
animate()
