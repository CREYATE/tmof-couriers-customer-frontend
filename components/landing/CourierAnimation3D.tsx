"use client"

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Animated delivery truck component
function DeliveryTruck() {
  const truckRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (truckRef.current) {
      // Gentle floating animation
      truckRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      truckRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    
    // Rotate wheels
    wheelsRef.current.forEach((wheel) => {
      if (wheel) {
        wheel.rotation.x += 0.02;
      }
    });
    }
  });

  return (
    <group ref={truckRef} position={[-2, 0, 0]}>
      {/* Truck body */}
      <Box args={[2, 1, 1]} position={[0, 0.5, 0]}>
        <meshPhongMaterial color="#0C0E29" />
      </Box>
      
      {/* Truck cabin */}
      <Box args={[0.8, 0.8, 1]} position={[0.6, 1.2, 0]}>
        <meshPhongMaterial color="#1A1F45" />
      </Box>
      
      {/* Truck logo area */}
      <Box args={[0.1, 0.6, 0.6]} position={[-0.95, 0.5, 0]}>
        <meshPhongMaterial color="#ffd215" />
      </Box>
      
      {/* Wheels */}
      <Cylinder 
        ref={(el) => { if (el) wheelsRef.current[0] = el; }} 
        args={[0.3, 0.3, 0.2]} 
        position={[-0.6, -0.2, 0.6]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={(el) => { if (el) wheelsRef.current[1] = el; }} 
        args={[0.3, 0.3, 0.2]} 
        position={[-0.6, -0.2, -0.6]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={(el) => { if (el) wheelsRef.current[2] = el; }} 
        args={[0.3, 0.3, 0.2]} 
        position={[0.6, -0.2, 0.6]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial color="#333333" />
      </Cylinder>
      
      <Cylinder 
        ref={(el) => { if (el) wheelsRef.current[3] = el; }} 
        args={[0.3, 0.3, 0.2]} 
        position={[0.6, -0.2, -0.6]} 
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial color="#333333" />
      </Cylinder>
    </group>
  );
}

// Animated packages
function FloatingPackages() {
  const packagesRef = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    packagesRef.current.forEach((pkg, index) => {
      if (pkg) {
        pkg.position.y = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.2;
        pkg.rotation.y += 0.01;
      }
    });
  });

  return (
    <group position={[2, 1, 0]}>
      <Box 
        ref={(el) => { if (el) packagesRef.current[0] = el; }} 
        args={[0.5, 0.5, 0.5]} 
        position={[0, 0, 0]}
      >
        <meshPhongMaterial color="#ffd215" />
      </Box>
      
      <Box 
        ref={(el) => { if (el) packagesRef.current[1] = el; }} 
        args={[0.4, 0.6, 0.4]} 
        position={[0.8, 0.5, 0.3]}
      >
        <meshPhongMaterial color="#0C0E29" />
      </Box>
      
      <Box 
        ref={(el) => { if (el) packagesRef.current[2] = el; }} 
        args={[0.3, 0.4, 0.3]} 
        position={[-0.5, 0.8, -0.2]}
      >
        <meshPhongMaterial color="#E51E2A" />
      </Box>
    </group>
  );
}

// Animated delivery path
function DeliveryPath() {
  const pathRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pathRef.current) {
      pathRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={pathRef}>
      {/* Road/path elements */}
      <Box args={[8, 0.1, 0.5]} position={[0, -0.8, 0]}>
        <meshPhongMaterial color="#444444" />
      </Box>
      
      {/* Road markings */}
      <Box args={[1, 0.12, 0.1]} position={[-2, -0.75, 0]}>
        <meshPhongMaterial color="#ffd215" />
      </Box>
      <Box args={[1, 0.12, 0.1]} position={[0, -0.75, 0]}>
        <meshPhongMaterial color="#ffd215" />
      </Box>
      <Box args={[1, 0.12, 0.1]} position={[2, -0.75, 0]}>
        <meshPhongMaterial color="#ffd215" />
      </Box>
    </group>
  );
}

const CourierAnimation3D: React.FC = () => {
  console.log('CourierAnimation3D component is rendering');
  
  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        onCreated={() => console.log('Three.js Canvas created successfully')}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffd215" />
        
        {/* 3D Elements */}
        <DeliveryTruck />
        <FloatingPackages />
        <DeliveryPath />
        
        {/* Subtle orbit controls for interactivity */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default CourierAnimation3D;
