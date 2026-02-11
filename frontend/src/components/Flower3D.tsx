import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface Flower3DProps {
    flower: {
        petals: number
        color: string
        color_hex: string
    }
}

// 🌸 FLEUR PROCÉDURALE RÉALISTE
function RealisticFlower({ flower }: Flower3DProps) {
    const groupRef = useRef<THREE.Group>(null)
    const petalsRef = useRef<THREE.Mesh[]>([])
    const stemRef = useRef<THREE.Mesh>(null)
    const leavesRef = useRef<THREE.Mesh[]>([])

    const petalCount = Math.min(flower.petals, 12) // Max 12 pétales
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const baseColor = new THREE.Color(flower.color_hex || '#ff4d6d')

    // Création des pétales (forme de goutte/coeur)
    useEffect(() => {
        if (!groupRef.current) return
        const group = groupRef.current

        // Nettoyer les anciens pétales
        while (group.children.length > 0) group.remove(group.children[0])

        // --- Centre de la fleur ---
        const centerGeo = new THREE.SphereGeometry(0.5, 32, 16)
        const centerMat = new THREE.MeshStandardMaterial({
            color: '#ffd700',
            emissive: '#ffaa00',
            emissiveIntensity: 0.3,
            roughness: 0.4,
            metalness: 0.6
        })
        const center = new THREE.Mesh(centerGeo, centerMat)
        center.castShadow = true
        center.receiveShadow = true
        group.add(center)

        // Ajout de petites étamines autour du centre
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2
            const x = Math.cos(angle) * 0.6
            const z = Math.sin(angle) * 0.6
            const stamenGeo = new THREE.SphereGeometry(0.08, 8, 8)
            const stamenMat = new THREE.MeshStandardMaterial({ color: '#ffaa33', emissive: '#ff8800', emissiveIntensity: 0.2 })
            const stamen = new THREE.Mesh(stamenGeo, stamenMat)
            stamen.position.set(x, 0.2, z)
            stamen.castShadow = true
            stamen.receiveShadow = true
            group.add(stamen)
        }

        // --- Pétales ---
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2

            // Forme de pétale : sphère aplatie allongée
            const petalGeo = new THREE.SphereGeometry(1, 16, 16)
            const petalMat = new THREE.MeshStandardMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.2,
                roughness: 0.3,
                metalness: 0.1,
                transparent: true,
                opacity: 0.9
            })
            const petal = new THREE.Mesh(petalGeo, petalMat)
            petal.castShadow = true
            petal.receiveShadow = true

            // Position : autour du centre avec un rayon
            const radius = 1.2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            petal.position.set(x, 0.2, z)

            // Rotation pour orienter le pétale vers l'extérieur
            petal.rotation.x = -0.4
            petal.rotation.y = angle
            petal.rotation.z = 0.3

            // Échelle : forme ovale allongée
            petal.scale.set(0.7, 0.2, 0.4)

            petalsRef.current[i] = petal
            group.add(petal)
        }

        // --- Tige ---
        const stemGeo = new THREE.CylinderGeometry(0.1, 0.12, 3, 8)
        const stemMat = new THREE.MeshStandardMaterial({ color: '#2e8b57', roughness: 0.7 })
        const stem = new THREE.Mesh(stemGeo, stemMat)
        stem.position.set(0, -1.8, 0)
        stem.castShadow = true
        stem.receiveShadow = true
        group.add(stem)
        stemRef.current = stem

        // --- Feuilles ---
        const leafGeo = new THREE.SphereGeometry(0.6, 8, 8)
        const leafMat = new THREE.MeshStandardMaterial({ color: '#3cb371', roughness: 0.6, side: THREE.DoubleSide })

        // Feuille gauche
        const leafLeft = new THREE.Mesh(leafGeo, leafMat)
        leafLeft.position.set(0.6, -1.0, 0)
        leafLeft.rotation.set(0.2, 0.5, 0.8)
        leafLeft.scale.set(0.8, 0.1, 0.4)
        leafLeft.castShadow = true
        leafLeft.receiveShadow = true
        group.add(leafLeft)
        leavesRef.current.push(leafLeft)

        // Feuille droite
        const leafRight = new THREE.Mesh(leafGeo, leafMat)
        leafRight.position.set(-0.6, -1.3, 0)
        leafRight.rotation.set(-0.2, -0.5, -0.8)
        leafRight.scale.set(0.8, 0.1, 0.4)
        leafRight.castShadow = true
        leafRight.receiveShadow = true
        group.add(leafRight)
        leavesRef.current.push(leafRight)

    }, [flower.petals, flower.color_hex, petalCount, baseColor])

    // Animation
    useFrame((state) => {
        if (groupRef.current) {
            // Rotation lente
            groupRef.current.rotation.y += 0.001
            // Flottement
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
            groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.03
        }

        // Animation des pétales (léger battement)
        petalsRef.current.forEach((petal, i) => {
            if (petal) {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.03
                petal.scale.x = 0.7 * scale
                petal.scale.y = 0.2 * scale
                petal.scale.z = 0.4 * scale
            }
        })

        // Animation des feuilles
        leavesRef.current.forEach((leaf, i) => {
            if (leaf) {
                leaf.rotation.z += Math.sin(state.clock.elapsedTime * 2 + i) * 0.005
            }
        })
    })

    return <group ref={groupRef} />
}

// 🌟 COMPOSANT PRINCIPAL
export default function Flower3D({ flower }: Flower3DProps) {
    return (
        <Canvas
            camera={{ position: [4, 2, 6], fov: 40 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            shadows
            onCreated={({ gl }) => {
                gl.shadowMap.enabled = true
                gl.shadowMap.type = THREE.PCFSoftShadowMap
            }}
        >
            {/* Éclairage */}
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize={1024}
            />
            <pointLight position={[-3, 2, 4]} intensity={0.8} color="#ffccdd" />
            <pointLight position={[4, 1, -2]} intensity={0.5} color="#ccddff" />

            {/* Environnement */}
            <Environment preset="sunset" />

            {/* La fleur */}
            <RealisticFlower flower={flower} />

            {/* Ombre */}
            <ContactShadows
                position={[0, -2.2, 0]}
                opacity={0.4}
                scale={5}
                blur={2}
                far={4}
            />

            {/* Contrôles */}
            <OrbitControls
                enableZoom
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.8}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
            />
        </Canvas>
    )
}