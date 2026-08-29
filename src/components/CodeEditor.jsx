"use client";

import { useEffect, useRef, useState } from "react";
import { CodeIcon } from "@phosphor-icons/react/Code";
import useReducedMotion from "../hooks/useReducedMotion";

export default function CodeEditor({ lines, title = "team.js" }) {
  const editorRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [visibleLineCount, setVisibleLineCount] = useState(
    reducedMotion ? lines.length : 0,
  );

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLineCount(lines.length);
      return undefined;
    }

    const editor = editorRef.current;
    if (!editor) return undefined;

    let timer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let nextLine = 0;
        timer = window.setInterval(() => {
          nextLine += 1;
          setVisibleLineCount(Math.min(nextLine, lines.length));
          if (nextLine >= lines.length) window.clearInterval(timer);
        }, 120);
      },
      { threshold: 0.35 },
    );

    observer.observe(editor);
    return () => {
      observer.disconnect();
      if (timer !== null) window.clearInterval(timer);
    };
  }, [lines, reducedMotion]);

  return (
    <div className="code-editor" ref={editorRef} aria-label={`${title} code preview`}>
      <div className="code-editor-titlebar">
        <span className="editor-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="editor-file">
          <CodeIcon size={16} weight="duotone" aria-hidden="true" />
          {title}
        </span>
        <span className="editor-language">JavaScript</span>
      </div>
      <ol className="code-editor-body">
        {lines.map((line, index) => (
          <li className={index < visibleLineCount ? "is-typed" : ""} key={`${line}-${index}`}>
            <code>{line}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
