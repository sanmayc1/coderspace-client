import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';

type AvatarProps = {
  jawRef: React.RefObject<THREE.Bone | null>;
  headRef: React.RefObject<THREE.Bone | null>;
  isTalkingRef: React.RefObject<boolean>;
    analyserRef: React.RefObject<AnalyserNode | null>;
  dataArrayRef: React.RefObject<Uint8Array<ArrayBuffer> | null>;
};

export default function Avatar({ jawRef, headRef, isTalkingRef,analyserRef,dataArrayRef }: AvatarProps) {
  const { scene } = useGLTF('/interviewer.glb');
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;

        if (bone.name.toLowerCase() === 'jaw') {
          jawRef.current = bone;
        }
        if (bone.name.toLowerCase() === 'head') {
          headRef.current = bone;
        }
      }
    });
  }, [scene, jawRef, headRef]);

  useFrame(() => {
if (
    jawRef.current &&
    analyserRef.current &&
    dataArrayRef.current &&
    isTalkingRef.current
  ) {
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    const volume =
      dataArrayRef.current.reduce((a, b) => a + b, 0) /
      dataArrayRef.current.length;

    const base = -2.0961220499689475;

    const openAmount = Math.min(volume * 0.002, 0.25);

    const target = base - openAmount;

    jawRef.current.rotation.z =
      jawRef.current.rotation.z * 0.6 + target * 0.4;
  }

if (headRef.current) {
  const t = Date.now() * 0.002;

  if (isTalkingRef.current) {
    const targetX = 0.03 + Math.sin(t) * 0.02;
    const targetY = 0 + Math.sin(t * 0.8) * 0.04;
    const targetZ = 0.3 + Math.sin(t * 0.6) * 0.015;

    headRef.current.rotation.x =
      headRef.current.rotation.x * 0.8 + targetX * 0.2;

    headRef.current.rotation.y =
      headRef.current.rotation.y * 0.8 + targetY * 0.2;

    headRef.current.rotation.z =
      headRef.current.rotation.z * 0.8 + targetZ * 0.2;
  } else {
    headRef.current.rotation.x = 0.03;
    headRef.current.rotation.y = 0;
    headRef.current.rotation.z = 0.3;
  }
}
  });

  return <primitive object={scene} scale={1} position={[3, -1.14, 2]} />;
}
