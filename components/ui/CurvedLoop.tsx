import { useRef, useEffect, useState, useMemo, useId, FC } from "react";

interface CurvedLoopProps {
  text?: string;
  speed?: number;
  className?: string;
  curve?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

const CurvedLoop: FC<CurvedLoopProps> = ({
  text = "",
  speed = 2,
  className = "",
  curve = 600,
  direction = "left",
  interactive = true,
}) => {
  const cleanText = useMemo(() => text.trim() + " \u00A0", [text]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);

  const [textWidth, setTextWidth] = useState(0);
  const [offset, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid}`;

  const drag = useRef(false);
  const lastX = useRef(0);

  // Curve responsive
  const curveHeight = useMemo(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 500) return curve * 0.4;
      if (window.innerWidth < 900) return curve * 0.7;
    }
    return curve;
  }, [curve]);

  const d = `M -200 50 Q 700 ${50 + curveHeight} 1800 50`;

  // Measure once
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.getComputedTextLength());
    }
  }, [cleanText]);

  // Animation loop
  useEffect(() => {
    if (!textWidth || !textPathRef.current) return;

    let frame: number;
    const animate = () => {
      if (!drag.current) {
        const move = direction === "right" ? speed : -speed;
        let newOff = offset + move;

        if (newOff <= -textWidth) newOff += textWidth;
        if (newOff >= 0) newOff -= textWidth;

        setOffset(newOff);
        textPathRef.current!.setAttribute("startOffset", newOff + "px");
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [textWidth, speed, direction, offset]);

  // Dragging
  const onDown = (e: any) => {
    if (!interactive) return;
    drag.current = true;
    lastX.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const onMove = (e: any) => {
    if (!drag.current || !textPathRef.current) return;

    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;

    let newOff = offset + dx;
    if (newOff <= -textWidth) newOff += textWidth;
    if (newOff >= 0) newOff -= textWidth;

    setOffset(newOff);
    textPathRef.current.setAttribute("startOffset", newOff + "px");
  };

  const onUp = () => {
    drag.current = false;
  };

  const repeatText = textWidth ? cleanText.repeat(30) : cleanText;

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ cursor: interactive ? (drag.current ? "grabbing" : "grab") : "auto" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <svg
        className={"block w-full overflow-visible select-none " + className}
        viewBox="0 0 1600 150"
      >
        <text ref={measureRef} className="opacity-0 pointer-events-none">
          {cleanText}
        </text>

        <defs>
          <path id={pathId} ref={pathRef} d={d} fill="none" />
        </defs>

        <text className="fill-gray-900">
          <textPath
            ref={textPathRef}
            href={`#${pathId}`}
            startOffset={offset + "px"}
          >
            {repeatText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default function PropertyMarquee() {
  return (
    <div className="w-full bg-gradient-to-r from-amber-50 via-white to-amber-50 py-6">
      <div className="h-20 flex items-center justify-center overflow-visible">
        <CurvedLoop
          text="Premium Properties ✦ Dubai Real Estate ✦ Luxury Living ✦ Investment Opportunities ✦ Palm Jumeirah Residences ✦ Downtown Dubai Apartments ✦ Marina Waterfront Homes ✦ Ultra Luxury Penthouses ✦ High ROI Investments ✦ Off-Plan Projects ✦ Exclusive Listings ✦ Trusted Realtors ✦ Roarrealty Dubai ✦ Premium Properties ✦"
          speed={8}
          direction="left"
          curve={0}
          className="text-[5.3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.3rem] font-extrabold tracking-wide"
        />
      </div>
    </div>
  );
}