"use client";

import { useEffect } from "react";
import MotionCanvas from "./MotionCanvas";

export default function PageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let effectsFrame = 0;
    let navigationFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerDirty = false;
    let scrollDirty = true;

    const flushEffects = () => {
      effectsFrame = 0;

      if (pointerDirty) {
        pointerDirty = false;
        const normalizedX = pointerX / window.innerWidth;
        const normalizedY = pointerY / window.innerHeight;
        root.style.setProperty("--pointer-x", `${pointerX}px`);
        root.style.setProperty("--pointer-y", `${pointerY}px`);
        root.style.setProperty("--parallax-x", `${(normalizedX - 0.5) * 2}`);
        root.style.setProperty("--parallax-y", `${(normalizedY - 0.5) * 2}`);
      }

      if (scrollDirty) {
        scrollDirty = false;
        const maximum = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        root.style.setProperty("--page-progress", `${window.scrollY / maximum}`);
      }
    };

    const requestEffectsUpdate = () => {
      if (!effectsFrame) {
        effectsFrame = requestAnimationFrame(flushEffects);
      }
    };

    const updatePointer = (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerDirty = true;
      requestEffectsUpdate();
    };

    const updateScroll = () => {
      scrollDirty = true;
      requestEffectsUpdate();
    };

    const navigateToAnchor = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      const target = hash && hash.length > 1 ? document.querySelector(hash) : null;

      if (!target) return;

      event.preventDefault();
      cancelAnimationFrame(navigationFrame);

      const headerOffset = hash === "#main-content" ? 0 : 106;
      const start = window.scrollY;
      const destination = Math.max(
        target.getBoundingClientRect().top + start - headerOffset,
        0,
      );
      const distance = destination - start;
      const duration = reducedMotion.matches
        ? 0
        : Math.min(900, 620 + Math.abs(distance) * 0.035);
      const startedAt = performance.now();

      window.history.replaceState(null, "", hash);

      const finish = () => {
        if (hash === "#main-content") {
          target.focus({ preventScroll: true });
        }
      };

      if (duration === 0) {
        window.scrollTo(0, destination);
        finish();
        return;
      }

      const animateNavigation = (time) => {
        const progress = Math.min((time - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        window.scrollTo(0, start + distance * eased);

        if (progress < 1) {
          navigationFrame = requestAnimationFrame(animateNavigation);
        } else {
          finish();
        }
      };

      navigationFrame = requestAnimationFrame(animateNavigation);
    };

    root.classList.add("effects-ready");
    requestEffectsUpdate();
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("click", navigateToAnchor);

    return () => {
      cancelAnimationFrame(effectsFrame);
      cancelAnimationFrame(navigationFrame);
      root.classList.remove("effects-ready");
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      document.removeEventListener("click", navigateToAnchor);
    };
  }, []);

  return (
    <>
      <div className="page-effects" aria-hidden="true">
        <div className="davao-environment" />
        <div className="cursor-glow" />
        <div className="scroll-progress-track">
          <span />
        </div>
      </div>
      <MotionCanvas />
    </>
  );
}
