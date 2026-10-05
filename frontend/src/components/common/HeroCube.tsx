"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function HeroCube() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()

    // Responsive camera - adjusts based on screen size
    const isMobile = window.innerWidth <= 768
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024
    
    let cameraZ = 8 // Default desktop
    if (isMobile) {
      cameraZ = 6.5 // Mobile - zoom out less, cube bigger
    } else if (isTablet) {
      cameraZ = 7.5 // Tablet - slightly zoomed
    }

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, cameraZ)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    /* ===== LIGHTS - DRAMATIC ===== */
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.0)
    keyLight.position.set(3, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 1.2)
    fillLight.position.set(-4, 2, 3)
    scene.add(fillLight)

    const backLight = new THREE.DirectionalLight(0xfff0e0, 1.5)
    backLight.position.set(0, 0, -8)
    scene.add(backLight)

    const ambient = new THREE.AmbientLight(0x403830, 0.7)
    scene.add(ambient)

    const pointLight1 = new THREE.PointLight(0xffddbb, 1.5)
    pointLight1.position.set(4, 3, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xbbddff, 1.2)
    pointLight2.position.set(-3, -2, 5)
    scene.add(pointLight2)

    /* ===== MOUSE TRACKING ===== */
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    /* ===== CUBE GROUP ===== */
    const cubeGroup = new THREE.Group()

    const size = 0.95
    const gap = 0.06

    const geometry = new THREE.BoxGeometry(size, size, size)

    const cubeColor = 0xf7e7ce
    const emissiveColor = 0x332211

    const material = new THREE.MeshStandardMaterial({
      color: cubeColor,
      emissive: emissiveColor,
      emissiveIntensity: 0.12,
      metalness: 0.82,
      roughness: 0.18,
    })

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cube = new THREE.Mesh(geometry, material)
          
          cube.position.set(
            x * (size + gap),
            y * (size + gap),
            z * (size + gap)
          )
          
          cube.rotation.x = (Math.random() - 0.5) * 0.05
          cube.rotation.y = (Math.random() - 0.5) * 0.05
          cube.rotation.z = (Math.random() - 0.5) * 0.05
          
          cubeGroup.add(cube)
        }
      }
    }

    scene.add(cubeGroup)

    /* ===== CHAMPAGNE PARTICLES ===== */
    const particlesGeo = new THREE.BufferGeometry()
    const particlesCount = 500
    const particlesPositions = new Float32Array(particlesCount * 3)
    const particlesColors = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount; i++) {
      const radius = 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      particlesPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      particlesPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlesPositions[i * 3 + 2] = radius * Math.cos(phi)
      
      const r = 0.95 + Math.random() * 0.1
      const g = 0.85 + Math.random() * 0.15
      const b = 0.75 + Math.random() * 0.2
      
      particlesColors[i * 3] = r
      particlesColors[i * 3 + 1] = g
      particlesColors[i * 3 + 2] = b
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3))
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(particlesColors, 3))

    const particlesMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })

    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    /* ===== SUBTLE FLOOR GLOW ===== */
    const floorGeometry = new THREE.CircleGeometry(12, 32)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x332211,
      emissive: 0x221100,
      emissiveIntensity: 0.2,
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.5
    scene.add(floor)

    /* ===== ANIMATION ===== */
    let time = 0

    const animate = () => {
      time += 0.01
      
      cubeGroup.rotation.x = time * 0.25
      cubeGroup.rotation.y = time * 0.4
      
      cubeGroup.rotation.y += mouseX * 0.03
      cubeGroup.rotation.x += mouseY * 0.02
      
      keyLight.position.x = 3 + mouseX * 2
      keyLight.position.y = 5 + mouseY * 2
      
      pointLight1.position.x = 4 + mouseX * 3
      pointLight1.position.y = 3 + mouseY * 2
      
      particles.rotation.y += 0.0002

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize - Responsive
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobileNow = width <= 768
      const isTabletNow = width > 768 && width <= 1024
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      
      // Update camera position based on screen size
      if (isMobileNow) {
        camera.position.set(0, 0, 6.5)
      } else if (isTabletNow) {
        camera.position.set(0, 0, 7.5)
      } else {
        camera.position.set(0, 0, 8)
      }
      camera.lookAt(0, 0, 0)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1
      }}
    />
  )
}