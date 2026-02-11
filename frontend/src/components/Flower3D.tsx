import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface FlowerProps {
    flower: {
        petals: number
        color: string
        color_hex: string
    }
}

function Flower3DComponent({ flower }: FlowerProps) {
    const groupRef = useRef<THREE.Group>(null)
    const petalsRef = useRef<THREE.Mesh[]>([])

    // Parse color
    const getColor = (colorStr: string) => {
        if (colorStr.includes('gradient')) {
            // Handle gradient colors
            return new THREE.Color('#ff4d6d')
        }
        return new THREE.Color(colorStr || '#ff4d6d')
    }

    const baseColor = getColor(flower.color_hex)
    const petalCount = flower.petals

    // Create petals
    const petals = useMemo(() => {
        const petalsArray = []
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2
            const radius = 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            petalsArray.push({
                position: [x, 0, z] as [number, number, number],
                rotation: [0, angle, 0] as [number, number, number],
                scale: [0.8, 1.2, 0.1] as [number, number, number],
            })
        }
        return petalsArray
    }, [petalCount])

    // Animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.005
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
        }

        petalsRef.current.forEach((petal, i) => {
            if (petal) {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.1
                petal.scale.set(scale * 0.8, scale * 1.2, scale * 0.1)
            }
        })
    })

    return (
        <group ref={groupRef}>
            {/* Center */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color="#ffd700"
                    emissive="#ffaa00"
                    emissiveIntensity={0.5}
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>

            {/* Petals */}
            {petals.map((petal, i) => (
                <mesh
                    key={i}
                    ref={el => petalsRef.current[i] = el!}
                    position={petal.position}
                    rotation={petal.rotation}
                    scale={petal.scale}
                >
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        color={baseColor}
                        transparent
                        opacity={0.9}
                        roughness={0.2}
                        metalness={0.1}
                    />
                </mesh>
            ))}

            {/* Stem */}
            <mesh position={[0, -3, 0]}>
                <cylinderGeometry args={[0.1, 0.15, 6, 8]} />
                <meshStandardMaterial color="#2e8b57" />
            </mesh>

            {/* Leaves */}
            <mesh position={[0.5, -1, 0]} rotation={[0, 0, Math.PI / 4]}>
                <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#3cb371" side={THREE.DoubleSide} />
            </mesh>

            <mesh position={[-0.5, -1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#3cb371" side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}

interface Flower3DProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flower: any
}

export default function Flower3D({ flower }: Flower3DProps) {
    return (
        <Canvas
            camera={{ position: [10, 5, 10], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4d6d" />

            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Flower3DComponent flower={flower} />
            </Float>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
            />

            <fog attach="fog" args={['#ffccd5', 10, 25]} />
        </Canvas>
    )
}