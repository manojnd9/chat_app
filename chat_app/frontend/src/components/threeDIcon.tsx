import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

interface ThreeDIconProps {
    visible: boolean;
}

/** Function to render 3D animation of a tetrahedron geometry.
 *
 *  - uses componenents from react-three/fiber to render the animation.
 *  - the motion is made visible from the local state for the canvas component
 *      - which is passed as boolean to this function to show/hide animation. *
 */
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
