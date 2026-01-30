
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ShieldAlert, Activity, Wifi } from "lucide-react";

// Types for our threat data
type Threat = {
  id: number;
  source: [number, number, number]; // x,y,z
  target: [number, number, number]; // x,y,z
  type: "Deepfake Video" | "Voice Clone" | "Synthetic Image";
  location: string;
  timestamp: string;
};

// Helper to get point on sphere from lat/long (simplified)
const getPosition = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

function Earth({ onThreatDetected }: { onThreatDetected: (t: Threat) => void }) {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [threats, setThreats] = useState<Threat[]>([]);

  // Rotate earth
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.1;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.14;
  });

  // Generate random threats
  useEffect(() => {
    const interval = setInterval(() => {
      const lat1 = (Math.random() - 0.5) * 160;
      const lng1 = (Math.random() - 0.5) * 360;
      const lat2 = (Math.random() - 0.5) * 160;
      const lng2 = (Math.random() - 0.5) * 360;

      const source = getPosition(lat1, lng1, 2);
      const target = getPosition(lat2, lng2, 2);

      const types = ["Deepfake Video", "Voice Clone", "Synthetic Image"] as const;
      const cities = ["New York", "London", "Tokyo", "Berlin", "Moscow", "Beijing", "Sydney", "Delhi", "Sao Paulo"];
      
      const newThreat: Threat = {
        id: Date.now(),
        source: [source.x, source.y, source.z],
        target: [target.x, target.y, target.z],
        type: types[Math.floor(Math.random() * types.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        timestamp: new Date().toLocaleTimeString(),
      };

      setThreats(prev => [...prev.slice(-4), newThreat]);
      onThreatDetected(newThreat);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cyan = new THREE.Color("#00f2ff");
  const purple = new THREE.Color("#7000ff");
  
  return (
    <group ref={earthRef}>
      {/* Wireframe Earth */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial 
          color="#1a1a3a" 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </Sphere>
      
      {/* Solid Ghost Earth for depth */}
      <Sphere args={[1.98, 32, 32]}>
         <meshBasicMaterial color="#000" transparent opacity={0.6} />
      </Sphere>

      {/* Clouds / Atmosphere */}
      <Sphere ref={cloudsRef} args={[2.05, 32, 32]}>
        <meshBasicMaterial 
          color={cyan}
          wireframe
          transparent
          opacity={0.05}
        />
      </Sphere>

      {/* Threat Lines */}
      {threats.map((t) => (
        <ThreatArc key={t.id} start={new THREE.Vector3(...t.source)} end={new THREE.Vector3(...t.target)} color={t.id % 2 === 0 ? cyan : purple} />
      ))}

      {/* Active Nodes */}
      {threats.map((t) => (
        <mesh key={`node-${t.id}`} position={new THREE.Vector3(...t.target)}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
      ))}
    </group>
  );
}

function ThreatArc({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: THREE.Color }) {
  const curve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.5);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(20), [curve]);

  return (
    <Line points={points} color={color} lineWidth={1} transparent opacity={0.6} />
  );
}

export const ThreatMapSection = () => {
  const [recentThreats, setRecentThreats] = useState<Threat[]>([]);

  const addThreat = (t: Threat) => {
    setRecentThreats(prev => [t, ...prev].slice(0, 5));
  };

  return (
    <section className="py-24 relative overflow-hidden">
        {/* Background Gradients */}
      <div className="absolute inset-0 bg-background/90 z-0" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full transform translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-secondary/5 blur-3xl rounded-full transform -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Panel: Info & Feed */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-red-500 font-mono text-sm tracking-wider uppercase">Live Threat Intelligence</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Global <span className="text-gradient">Deepfake</span> Monitoring
              </h2>
              <p className="text-xl text-muted-foreground">
                Real-time interception of synthetic media attacks across the globe. 
                Our decentralized nodes protect integrity at the source.
              </p>
            </motion.div>

            {/* Live Feed */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        INTERCEPTION LOG
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">STATUS: ACTIVE</span>
                </div>
                
                <div className="space-y-3 h-[200px] overflow-hidden relative">
                    <AnimatePresence mode="popLayout">
                        {recentThreats.map((threat) => (
                            <motion.div 
                                key={threat.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-4 h-4 text-secondary shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-gray-200 font-mono text-xs">{threat.type}</span>
                                        <span className="text-xs text-muted-foreground">{threat.location}</span>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-primary/80">{threat.timestamp}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {recentThreats.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground animate-pulse text-xs">
                            Syncing with satellite nodes...
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary mb-1">2.4M+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Scanned</div>
                </div>
                <div className="bg-secondary/5 border border-secondary/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-secondary mb-1">99.8%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Accuracy</div>
                </div>
                <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-accent mb-1">0.2s</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">Latency</div>
                </div>
            </div>
          </div>

          {/* Right Panel: 3D Globe */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[500px] relative w-full"
          >
             <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30" />
             <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
                <Earth onThreatDetected={addThreat} />
             </Canvas>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
