"use client";

import { useEffect, useRef } from "react";
import useReducedMotion from "../hooks/useReducedMotion";

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

const easeInOut = (value) =>
  value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;

const createStars = (count) =>
  Array.from({ length: count }, (_, index) => ({
    x: ((index * 47) % 997) / 997,
    y: ((index * 83) % 613) / 613,
    depth: 0.35 + ((index * 29) % 65) / 100,
    size: 0.45 + ((index * 11) % 12) / 10,
    phase: (index * 0.71) % (Math.PI * 2),
  }));

const intersectionThresholds = Array.from(
  { length: 21 },
  (_, index) => index / 20,
);

export default function MotionCanvas() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return undefined;

    let cancelled = false;
    let idleRequest = 0;
    let fallbackTimer = 0;
    let stopAnimation;
    let queuedPluck = false;
    let queuedSmash = false;
    let forwardPluck = () => {
      queuedPluck = true;
    };
    let forwardSmash = () => {
      queuedSmash = true;
    };

    const handlePluck = () => forwardPluck();
    const handleSmash = () => forwardSmash();

    window.addEventListener("portfolio:guitar-pluck", handlePluck);
    window.addEventListener("portfolio:ball-smash", handleSmash);

    const initialize = () => {
      if (cancelled) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const finePointer = window.matchMedia("(pointer: fine)");
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let isMobile = false;
      let frameInterval = 1000 / 45;
      let maximumScroll = 1;
      let stars = createStars(72);
      let trailLimit = 34;
      let animationFrame = 0;
      let resizeFrame = 0;
      let previousTick = performance.now();
      let accumulatedTime = frameInterval;
      let previousScroll = window.scrollY;
      let previousBallProgress = 0;
      let scrollVelocity = 0;
      let pluckStrength = 0;
      let smashStrength = 0;
      let pointerX = 0.5;
      let pointerY = 0.5;
      let heroVisibility = 0;
      let skillsVisibility = 0;
      let isVisible = !document.hidden;
      const trail = [];

      const updateScrollRange = () => {
        maximumScroll = Math.max(
          document.documentElement.scrollHeight - height,
          1,
        );
      };

      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;

        const nextMobile = width < 768 || !finePointer.matches;
        if (nextMobile !== isMobile) {
          isMobile = nextMobile;
          stars = createStars(isMobile ? 38 : 72);
          trailLimit = isMobile ? 18 : 34;
          frameInterval = 1000 / (isMobile ? 30 : 45);
          while (trail.length > trailLimit) trail.shift();
        }

        pixelRatio = Math.min(
          window.devicePixelRatio || 1,
          isMobile ? 1 : 1.25,
        );
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        updateScrollRange();
      };

      const queueResize = () => {
        if (resizeFrame) return;
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0;
          resize();
        });
      };

      const updatePointer = (event) => {
        pointerX = event.clientX / Math.max(width, 1);
        pointerY = event.clientY / Math.max(height, 1);
      };

      const triggerPluck = () => {
        pluckStrength = 1;
      };

      const triggerSmash = () => {
        smashStrength = 1;
      };

      forwardPluck = triggerPluck;
      forwardSmash = triggerSmash;
      if (queuedPluck) triggerPluck();
      if (queuedSmash) triggerSmash();

      const drawStars = (time, scrollProgress, visibility) => {
        if (visibility <= 0) return;

        context.save();
        context.globalCompositeOperation = "screen";

        for (let index = 0; index < stars.length; index += 1) {
          const star = stars[index];
          const driftX = finePointer.matches
            ? (pointerX - 0.5) * star.depth * 18
            : 0;
          const driftY =
            (finePointer.matches ? (pointerY - 0.5) * star.depth * 10 : 0) -
            scrollProgress * star.depth * 24;
          const x = star.x * width + driftX;
          const y = star.y * height * 0.78 + driftY;
          const twinkle = 0.42 + Math.sin(time * 0.0007 + star.phase) * 0.2;

          context.beginPath();
          context.fillStyle = `rgba(159, 178, 255, ${twinkle * visibility})`;
          context.arc(x, y, star.size, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      };

      const drawStrings = (time, heroRatio, skillsRatio) => {
        const isSkillsChapter = skillsRatio > heroRatio;
        const visibility = Math.max(heroRatio, skillsRatio * 0.86);
        if (visibility <= 0) return;

        const stringCount = isMobile ? 3 : 6;
        const startX = isSkillsChapter
          ? width * -0.03
          : width < 980
            ? width * 0.08
            : width * 0.36;
        const endX = width * 1.02;
        const startY = isSkillsChapter
          ? height * 0.34
          : width < 980
            ? height * 0.56
            : height * 0.28;
        const gap = isMobile ? 14 : 18;
        const velocityEnergy = Math.min(Math.abs(scrollVelocity) * 0.11, 0.42);
        const energy = Math.max(pluckStrength, velocityEnergy) * visibility;

        context.save();
        context.globalCompositeOperation = "screen";
        context.lineWidth = 1;

        for (let index = 0; index < stringCount; index += 1) {
          const baseY = startY + index * gap;
          const stagger = index * 0.55;
          const wave = Math.sin(time * 0.02 - stagger) * energy * (12 - index);
          const controlX = startX + (endX - startX) * 0.48;
          const color = index % 2 === 0 ? "127, 151, 255" : "197, 137, 255";
          const restingAlpha = isSkillsChapter ? 0.12 : 0.28;

          context.beginPath();
          context.strokeStyle = `rgba(${color}, ${
            (restingAlpha + energy * 0.48) * visibility
          })`;
          context.moveTo(startX, baseY);
          context.quadraticCurveTo(controlX, baseY + wave, endX, baseY - 44);
          context.stroke();
        }

        context.restore();
      };

      const drawBall = (pageProgress, deltaTime, time) => {
        if (Math.abs(pageProgress - previousBallProgress) > 0.06) {
          trail.length = 0;
        }
        previousBallProgress = pageProgress;

        const progress = easeInOut(pageProgress);
        const horizontalWave = Math.sin(progress * Math.PI * 4.5);
        const verticalWave = Math.cos(progress * Math.PI * 3.2);
        const guidedX =
          width * (0.13 + progress * 0.76) + horizontalWave * width * 0.08;
        const guidedY =
          height * (0.72 - progress * 0.38) + verticalWave * height * 0.11;
        const heroPhase = time * 0.00082;
        const heroX = width * (0.58 + Math.cos(heroPhase) * 0.2);
        const heroY = height * (0.66 + Math.sin(heroPhase * 1.14) * 0.105);
        const heroBlend = 1 - clamp(pageProgress * 11, 0, 1);
        const x = guidedX * (1 - heroBlend) + heroX * heroBlend;
        const y = guidedY * (1 - heroBlend) + heroY * heroBlend;
        const boost = 1 + smashStrength * 0.35;

        trail.push({ x, y, life: 1 });
        while (trail.length > trailLimit) trail.shift();
        for (let index = 0; index < trail.length; index += 1) {
          trail[index].life -= deltaTime * 0.0028;
        }
        while (trail.length && trail[0].life <= 0) trail.shift();

        context.save();
        context.globalCompositeOperation = "screen";

        if (trail.length > 1) {
          context.beginPath();
          context.moveTo(trail[0].x, trail[0].y);
          for (let index = 1; index < trail.length - 1; index += 1) {
            const point = trail[index];
            const nextPoint = trail[index + 1];
            context.quadraticCurveTo(
              point.x,
              point.y,
              (point.x + nextPoint.x) / 2,
              (point.y + nextPoint.y) / 2,
            );
          }
          const lastPoint = trail[trail.length - 1];
          context.lineTo(lastPoint.x, lastPoint.y);
          context.lineCap = "round";
          context.lineJoin = "round";
          context.lineWidth = 1.5 + heroBlend * 2.5;
          context.strokeStyle = `rgba(86, 129, 255, ${0.24 + heroBlend * 0.26})`;
          context.shadowColor = "rgba(108, 79, 255, 0.88)";
          context.shadowBlur = 16 + heroBlend * 16;
          context.stroke();
        }

        for (let index = 0; index < trail.length; index += 1) {
          const point = trail[index];
          const alpha = (index / trail.length) * 0.52 * point.life;
          context.beginPath();
          context.fillStyle = `rgba(102, 218, 255, ${alpha})`;
          context.arc(point.x, point.y, 2 + index * 0.18, 0, Math.PI * 2);
          context.fill();
        }

        context.shadowColor = "rgba(122, 209, 255, 0.95)";
        context.shadowBlur = (heroBlend > 0.5 ? 28 : 18) * boost;
        context.beginPath();
        context.fillStyle = "rgba(235, 249, 255, 0.96)";
        context.arc(
          x,
          y,
          (isMobile ? 5 : heroBlend > 0.5 ? 9 : 7) * boost,
          0,
          Math.PI * 2,
        );
        context.fill();
        context.restore();
      };

      const scheduleDraw = () => {
        if (isVisible && !animationFrame) {
          animationFrame = requestAnimationFrame(draw);
        }
      };

      function draw(time) {
        animationFrame = 0;
        if (!isVisible) return;

        const tickDuration = Math.min(time - previousTick, 100);
        previousTick = time;
        accumulatedTime += tickDuration;

        if (accumulatedTime < frameInterval) {
          scheduleDraw();
          return;
        }

        const deltaTime = Math.min(accumulatedTime, 50);
        accumulatedTime %= frameInterval;
        const currentScroll = window.scrollY;
        const rawVelocity = currentScroll - previousScroll;
        previousScroll = currentScroll;
        scrollVelocity += (rawVelocity - scrollVelocity) * 0.18;
        scrollVelocity *= 0.91;
        pluckStrength *= Math.pow(0.965, deltaTime / 16.67);
        smashStrength *= Math.pow(0.95, deltaTime / 16.67);

        const pageProgress = clamp(currentScroll / maximumScroll, 0, 1);

        context.clearRect(0, 0, width, height);
        drawStars(time, pageProgress, heroVisibility);
        drawStrings(time, heroVisibility, skillsVisibility);
        drawBall(pageProgress, deltaTime, time);

        scheduleDraw();
      }

      const updateVisibility = () => {
        isVisible = !document.hidden;
        if (isVisible) {
          previousTick = performance.now();
          accumulatedTime = frameInterval;
          scheduleDraw();
        } else {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      };

      resize();

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target.id === "home") {
              heroVisibility = entry.isIntersecting
                ? clamp(
                    (entry.boundingClientRect.bottom + height * 0.2) /
                      (height * 1.2),
                    0,
                    1,
                  )
                : 0;
            }

            if (entry.target.id === "skills") {
              skillsVisibility = entry.isIntersecting
                ? clamp(entry.intersectionRect.height / Math.max(height, 1), 0, 1)
                : 0;
            }
          }
        },
        { threshold: intersectionThresholds },
      );
      const hero = document.getElementById("home");
      const skills = document.getElementById("skills");
      if (hero) sectionObserver.observe(hero);
      if (skills) sectionObserver.observe(skills);

      const pageResizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(updateScrollRange);
      pageResizeObserver?.observe(document.documentElement);

      window.addEventListener("resize", queueResize, { passive: true });
      window.addEventListener("pointermove", updatePointer, { passive: true });
      finePointer.addEventListener("change", queueResize);
      document.addEventListener("visibilitychange", updateVisibility);
      scheduleDraw();

      stopAnimation = () => {
        isVisible = false;
        cancelAnimationFrame(animationFrame);
        cancelAnimationFrame(resizeFrame);
        sectionObserver.disconnect();
        pageResizeObserver?.disconnect();
        window.removeEventListener("resize", queueResize);
        window.removeEventListener("pointermove", updatePointer);
        finePointer.removeEventListener("change", queueResize);
        document.removeEventListener("visibilitychange", updateVisibility);
      };
    };

    if ("requestIdleCallback" in window) {
      idleRequest = window.requestIdleCallback(initialize, { timeout: 700 });
    } else {
      fallbackTimer = window.setTimeout(initialize, 160);
    }

    return () => {
      cancelled = true;
      if (idleRequest) window.cancelIdleCallback(idleRequest);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      stopAnimation?.();
      window.removeEventListener("portfolio:guitar-pluck", handlePluck);
      window.removeEventListener("portfolio:ball-smash", handleSmash);
    };
  }, [reducedMotion]);

  return <canvas className="motion-canvas" ref={canvasRef} aria-hidden="true" />;
}
