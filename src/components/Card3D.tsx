import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '../shared/types';

interface Card3DProps {
  card: Card;
  position: [number, number, number];
  rotation: [number, number, number];
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const SUIT_COLORS = {
  HEARTS: '#ef4444',
  DIAMONDS: '#ef4444',
  CLUBS: '#1f2937',
  SPADES: '#1f2937',
};

const SUIT_SYMBOLS = {
  HEARTS: '♥',
  DIAMONDS: '♦',
  CLUBS: '♣',
  SPADES: '♠',
};

export function Card3D({ card, position, rotation, isPlayable, isSelected, onClick }: Card3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animate position/rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Target position
    const targetY = position[1] + (isSelected ? 0.5 : 0) + (hovered && isPlayable ? 0.2 : 0);
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, position[0], delta * 10);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 10);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, position[2], delta * 10);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotation[0], delta * 10);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation[1], delta * 10);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotation[2], delta * 10);
  });

  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <RoundedBox args={[2, 3, 0.05]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={hovered && isPlayable ? '#f3f4f6' : '#ffffff'} roughness={0.2} metalness={0.1} />
      </RoundedBox>
      
      {/* Front Face Content */}
      <group position={[0, 0, 0.026]}>
        {/* Top Left */}
        <Text position={[-0.7, 1.1, 0]} fontSize={0.4} color={color} anchorX="center" anchorY="middle">
          {card.rank}
        </Text>
        <Text position={[-0.7, 0.7, 0]} fontSize={0.3} color={color} anchorX="center" anchorY="middle">
          {symbol}
        </Text>

        {/* Center */}
        <Text position={[0, 0, 0]} fontSize={1} color={color} anchorX="center" anchorY="middle">
          {symbol}
        </Text>

        {/* Bottom Right (inverted) */}
        <group position={[0.7, -1.1, 0]} rotation={[0, 0, Math.PI]}>
          <Text position={[0, 0, 0]} fontSize={0.4} color={color} anchorX="center" anchorY="middle">
            {card.rank}
          </Text>
          <Text position={[0, -0.4, 0]} fontSize={0.3} color={color} anchorX="center" anchorY="middle">
            {symbol}
          </Text>
        </group>
      </group>
      
      {/* Back Face */}
      <group position={[0, 0, -0.026]} rotation={[0, Math.PI, 0]}>
        <RoundedBox args={[1.8, 2.8, 0.01]} radius={0.05} smoothness={2}>
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </RoundedBox>
        <Text position={[0, 0, 0.01]} fontSize={0.3} color="#374151" anchorX="center" anchorY="middle" rotation={[0, 0, -Math.PI / 4]}>
          HEARTS
        </Text>
      </group>
    </group>
  );
}
