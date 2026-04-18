
import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();

  return (
    <Html fullscreen className="bg-black/80 absolute scale-z-95">
      <div className="fixed inset-0 flex items-center justify-center ">
        <div className="text-white text-2xl">
          Connecting... {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}