"use client"; // client side component

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !text || !fontsLoaded) return;

    const el = ref.current;
    const chars = text.split("").map(c => `<span>${c}</span>`).join("");
    el.innerHTML = chars;

    const targets = el.querySelectorAll("span");

    const startPct = (1 - threshold) * 100;
    const start = `top ${startPct}%`;

    const tween = gsap.fromTo(
      targets,
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start,
          once: true
        },
        onComplete: () => {
          onLetterAnimationComplete?.();
        },
        willChange: "transform, opacity",
        force3D: true
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      tween.kill();
    };
  }, [text, delay, duration, ease, from, to, threshold, fontsLoaded]);

  const renderTag = () => {
    const style = {
      textAlign,
      overflow: "hidden",
      display: "inline-block",
      whiteSpace: "normal",
      wordWrap: "break-word",
      willChange: "transform, opacity"
    };
    const classes = `split-parent ${className}`;

    switch (tag) {
      case "h1": return <h1 ref={ref} style={style} className={classes} />;
      case "h2": return <h2 ref={ref} style={style} className={classes} />;
      case "h3": return <h3 ref={ref} style={style} className={classes} />;
      case "h4": return <h4 ref={ref} style={style} className={classes} />;
      case "h5": return <h5 ref={ref} style={style} className={classes} />;
      case "h6": return <h6 ref={ref} style={style} className={classes} />;
      default: return <p ref={ref} style={style} className={classes} />;
    }
  };

  return renderTag();
};

export default SplitText;