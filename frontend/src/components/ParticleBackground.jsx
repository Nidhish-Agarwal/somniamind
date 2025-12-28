import React, { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: {
            color: {
              value: "#000", // Dark background for starry effect
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: ["#ffffff", "#9ad0ec", "#e7e7ff"], // Multiple star colors
            },
            links: {
              enable: false, // Disable links/lines between particles
            },
            number: {
              value: 160, // More particles for stars
              density: {
                enable: true,
                area: 800,
              },
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: { min: 0.1, max: 1 }, // Variable opacity for twinkling effect
              animation: {
                enable: true,
                speed: 0.3,
                sync: false,
              },
            },
            size: {
              value: { min: 0.5, max: 3 }, // Variable sizes for depth effect
              random: true,
            },
            move: {
              enable: true,
              speed: 0.2, // Slow movement for dreamy effect
              direction: "none",
              random: true,
              straight: false,
              outModes: {
                default: "out",
              },
              warp: true, // Creates a warping effect
            },
            twinkle: {
              particles: {
                enable: true,
                color: "#ffffff",
                frequency: 0.05,
                opacity: 1,
              },
            },
          },
          interactivity: {
            detectsOn: "window",
            events: {
              onHover: {
                enable: true,
                mode: "bubble", // Changed to bubble for a magical effect
              },
              onClick: {
                enable: true,
                mode: "push",
              },
            },
            modes: {
              bubble: {
                distance: 200,
                size: 4,
                duration: 2,
                opacity: 1,
              },
              push: {
                quantity: 10, // More particles on click
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticleBackground;
