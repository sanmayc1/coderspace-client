import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";


export default function Avatar() {
const { scene } = useGLTF("/interviewer.glb");

  return (
    <primitive
      object={scene}
      scale={10}
      position={[0, -15, 0]}
    />
  );
}