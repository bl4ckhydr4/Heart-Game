import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Card3D } from './Card3D';
import { useMemo } from 'react';
import * as THREE from 'three';

export function Table3D() {
  const { hand, trick, gameState, mySeatIndex, playCard, toggleCardSelection, selectedCards } = useGameStore();

  const isMyTurn = gameState?.currentPlayerSeat === mySeatIndex;
  const isPassing = gameState?.state === 'PASS';

  // Calculate hand positions
  const handPositions = useMemo(() => {
    const total = hand.length;
    const spacing = 1.2;
    const offset = (total * spacing) / 2 - spacing / 2;
    return hand.map((card, i) => {
      const x = i * spacing - offset;
      const z = 4.5;
      const y = 0.5;
      const rotZ = (x / offset) * -0.1 || 0;
      return { x, y, z, rotZ };
    });
  }, [hand]);

  // Calculate trick positions based on seat index relative to me
  const trickPositions = useMemo(() => {
    if (mySeatIndex === null) return [];
    return trick.map((t) => {
      const relativeSeat = (t.seatIndex - mySeatIndex + 4) % 4;
      let x = 0, z = 0, rotZ = 0;
      
      switch (relativeSeat) {
        case 0: z = 1.5; rotZ = 0; break; // Me (bottom)
        case 1: x = -1.5; rotZ = -Math.PI / 2; break; // Left
        case 2: z = -1.5; rotZ = Math.PI; break; // Top
        case 3: x = 1.5; rotZ = Math.PI / 2; break; // Right
      }

      // Add slight random rotation for realism
      const randomRot = (t.card.id.length % 10 - 5) * 0.05;

      return { ...t, x, z, rotZ: rotZ + randomRot };
    });
  }, [trick, mySeatIndex]);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-neutral-950">
      <Canvas camera={{ position: [0, 8, 8], fov: 45 }}>
        <color attach="background" args={['#0a0a0a']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 10, 0]} angle={0.6} penumbra={0.5} intensity={2} castShadow />
        <pointLight position={[0, 5, 5]} intensity={0.5} />

        {/* The Table */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <cylinderGeometry args={[8, 8, 0.2, 64]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        
        {/* Table edge */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
          <cylinderGeometry args={[8.2, 8.2, 0.3, 64]} />
          <meshStandardMaterial color="#020617" roughness={0.7} metalness={0.5} />
        </mesh>

        {/* Trick Area */}
        <group position={[0, 0.1, 0]}>
          {trickPositions.map((t) => (
            <Card3D
              key={t.card.id}
              card={t.card}
              position={[t.x, 0.05, t.z]}
              rotation={[-Math.PI / 2, 0, t.rotZ]}
            />
          ))}
        </group>

        {/* Player Hand */}
        <group position={[0, 0, 0]}>
          {hand.map((card, i) => {
            const pos = handPositions[i];
            const isSelected = selectedCards.includes(card.id);
            const isPlayable = isMyTurn || isPassing;

            return (
              <Card3D
                key={card.id}
                card={card}
                position={[pos.x, pos.y, pos.z]}
                rotation={[-Math.PI / 4, 0, pos.rotZ]}
                isPlayable={isPlayable}
                isSelected={isSelected}
                onClick={() => {
                  if (isPassing) {
                    toggleCardSelection(card.id);
                  } else if (isMyTurn) {
                    playCard(card.id);
                  }
                }}
              />
            );
          })}
        </group>

        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.5} 
        />
      </Canvas>
    </div>
  );
}
