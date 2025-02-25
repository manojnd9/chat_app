import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

interface ThreeDIconProps {
    visible: boolean;
}

const ThreeDIcon = ({ visible }: ThreeDIconProps) => {
    // This reference will give us direct access to the mesh
    const meshRef = useRef<Mesh>(null!);
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame(() => {
        if (meshRef.current) {
            // Rotate the sphere
            meshRef.current.rotation.y += 0.05;
        }
    });

    // If the sphere is not needed, hide it
    if (!visible) {
        return null;
    }

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
            {/* <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#2f74c0" /> */}
            <tetrahedronGeometry args={[1]} />
            <meshStandardMaterial color="#2f74c0" />
        </mesh>
    );
};

export default ThreeDIcon;
