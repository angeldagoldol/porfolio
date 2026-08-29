"use client";

import { useEffect, useRef } from "react";
import useReducedMotion from "../hooks/useReducedMotion";

const getSignalPoint = (progress, width, height, phase) => {
  const centerY = height * 0.56;
  const middlePulse = Math.exp(-Math.pow((progress - 0.5) / 0.095, 2));
  const rightLift = Math.exp(-Math.pow((progress - 0.79) / 0.11, 2));
  const wave =
    Math.sin(progress * Math.PI * 22 + phase) * height * 0.075 * middlePulse;
  const curve = Math.sin(progress * Math.PI * 2.4) * height * 0.022;

  return {
    x: progress * width,
    y: centerY + wave + curve - rightLift * height * 0.035,
  };
};

export default function TeamSignal() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let animationFrame = 0;
    let resizeFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let lastFrame = 0;
    let visible = !document.hidden;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time = 0) => {
      const phase = reducedMotion ? 0 : time * 0.0022;
      context.clearRect(0, 0, width, height);

      const lineGradient = context.createLinearGradient(0, 0, width, 0);
      lineGradient.addColorStop(0, "rgba(174, 91, 255, 0.88)");
      lineGradient.addColorStop(0.5, "rgba(87, 221, 255, 0.96)");
      lineGradient.addColorStop(1, "rgba(204, 102, 255, 0.9)");

      context.save();
      context.globalCompositeOperation = "screen";
      context.beginPath();

      for (let step = 0; step <= 180; step += 1) {
        const progress = step / 180;
        const point = getSignalPoint(progress, width, height, phase);
        if (step === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }

      context.lineWidth = 2;
      context.strokeStyle = lineGradient;
      context.shadowColor = "rgba(92, 125, 255, 0.92)";
      context.shadowBlur = 18;
      context.stroke();

      const ballProgress = reducedMotion ? 0.9 : 0.88 + Math.sin(phase * 0.55) * 0.025;
      const ball = getSignalPoint(ballProgress, width, height, phase);
      context.beginPath();
      context.fillStyle = "rgba(247, 252, 255, 0.98)";
      context.shadowColor = "rgba(126, 205, 255, 1)";
      context.shadowBlur = 24;
      context.arc(ball.x, ball.y, width < 768 ? 5 : 8, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const animate = (time) => {
      animationFrame = 0;
      if (!visible) return;

      const targetInterval = window.innerWidth < 768 ? 1000 / 30 : 1000 / 45;
      if (time - lastFrame >= targetInterval) {
        lastFrame = time;
        draw(time);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const queueResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
        draw(performance.now());
      });
    };

    const updateVisibility = () => {
      visible = !document.hidden;
      if (visible && !reducedMotion && !animationFrame) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(queueResize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", updateVisibility);
    resize();
    draw(performance.now());

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [reducedMotion]);

  return <canvas className="team-signal" ref={canvasRef} aria-hidden="true" />;
}
