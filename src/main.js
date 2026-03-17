import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================
// Three.js - Particle Background
// ============================================
const canvas = document.getElementById('bg-canvas')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Particles
const particleCount = 1500
const positions = new Float32Array(particleCount * 3)
const colors = new Float32Array(particleCount * 3)

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3
  positions[i3] = (Math.random() - 0.5) * 20
  positions[i3 + 1] = (Math.random() - 0.5) * 20
  positions[i3 + 2] = (Math.random() - 0.5) * 20

  // Purple to pink gradient colors
  const mix = Math.random()
  colors[i3] = 0.42 + mix * 0.49       // R
  colors[i3 + 1] = 0.39 - mix * 0.13   // G
  colors[i3 + 2] = 1.0 - mix * 0.04    // B
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleMaterial = new THREE.PointsMaterial({
  size: 0.02,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

// Floating geometric shapes
const torusGeometry = new THREE.TorusGeometry(1.2, 0.04, 16, 100)
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x6c63ff,
  transparent: true,
  opacity: 0.15,
  wireframe: true,
})
const torus = new THREE.Mesh(torusGeometry, torusMaterial)
torus.position.set(3, 0, -3)
scene.add(torus)

const octaGeometry = new THREE.OctahedronGeometry(0.8, 0)
const octaMaterial = new THREE.MeshBasicMaterial({
  color: 0xe942f5,
  transparent: true,
  opacity: 0.1,
  wireframe: true,
})
const octahedron = new THREE.Mesh(octaGeometry, octaMaterial)
octahedron.position.set(-3, 1, -4)
scene.add(octahedron)

camera.position.z = 5

// Mouse tracking
const mouse = { x: 0, y: 0 }
document.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
})

// Scroll offset for camera
let scrollY = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  const time = performance.now() * 0.001

  // Rotate particles slowly
  particles.rotation.y = time * 0.05
  particles.rotation.x = time * 0.02

  // Floating shapes rotation
  torus.rotation.x = time * 0.3
  torus.rotation.y = time * 0.2
  octahedron.rotation.x = time * 0.4
  octahedron.rotation.z = time * 0.25

  // Mouse parallax
  camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
  camera.position.y += (mouse.y * 0.3 - camera.position.y + scrollY * -0.001) * 0.05

  renderer.render(scene, camera)
}
animate()

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ============================================
// GSAP Animations
// ============================================

// Hero entrance animation
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
heroTl
  .to('.hero-greeting', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
  .to('.hero-name', { opacity: 1, y: 0, duration: 1 }, '-=0.4')
  .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
  .to('.scroll-indicator', { opacity: 1, duration: 1 }, '-=0.2')

// Navbar scroll effect
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: (self) => {
    const navbar = document.getElementById('navbar')
    if (self.direction === 1 && self.scroll() > 80) {
      navbar.classList.add('scrolled')
    } else if (self.scroll() <= 80) {
      navbar.classList.remove('scrolled')
    }
  },
})

// Section animations - fade in & slide up
document.querySelectorAll('[data-animate]').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power2.out',
  })
})

// Skill bars fill animation
document.querySelectorAll('.skill-fill').forEach((bar) => {
  const level = bar.getAttribute('data-level')
  gsap.to(bar, {
    scrollTrigger: {
      trigger: bar,
      start: 'top 90%',
    },
    width: `${level}%`,
    duration: 1.2,
    ease: 'power2.out',
  })
})

// Counter animation for stats
document.querySelectorAll('.stat-number').forEach((num) => {
  const target = parseInt(num.getAttribute('data-count'))
  gsap.to(num, {
    scrollTrigger: {
      trigger: num,
      start: 'top 85%',
    },
    textContent: target,
    duration: 1.5,
    ease: 'power2.out',
    snap: { textContent: 1 },
  })
})

// Staggered project cards
gsap.from('.project-card', {
  scrollTrigger: {
    trigger: '.projects-grid',
    start: 'top 80%',
  },
  opacity: 0,
  y: 60,
  stagger: 0.2,
  duration: 0.8,
  ease: 'power2.out',
})

// Contact form - prevent default (no backend)
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault()
  const btn = e.target.querySelector('.btn')
  btn.textContent = 'Sent!'
  btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'
  setTimeout(() => {
    btn.textContent = 'Send Message'
    btn.style.background = ''
    e.target.reset()
  }, 2000)
})
