"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, type CSSProperties } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    // duplikasi konten sekali untuk efek tak berujung
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      scrollerRef.current!.appendChild(item.cloneNode(true));
    });
    // set var awal
    applyDirection(direction);
    applySpeed(speed);
    setStart(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reaktif ke perubahan props
  useEffect(() => {
    applyDirection(direction);
  }, [direction]);

  useEffect(() => {
    applySpeed(speed);
  }, [speed]);

  function applyDirection(dir: "left" | "right") {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty("--animation-direction", dir === "left" ? "forwards" : "reverse");
  }

  function applySpeed(spd: "fast" | "normal" | "slow") {
    if (!containerRef.current) return;
    const dur = spd === "fast" ? "20s" : spd === "normal" ? "40s" : "80s";
    containerRef.current.style.setProperty("--animation-duration", dur);
  }
  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 max-w-7xl overflow-hidden", "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}
      style={
        {
          // fallback kalau CSS var belum ke-set
          ["--animation-duration" as any]: "40s",
          ["--animation-direction" as any]: direction === "left" ? "forwards" : "reverse",
        } as CSSProperties
      }
    >
      <ul ref={scrollerRef} className={cn("flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4", start && "animate-[var(--animate-scroll)]", pauseOnHover && "hover:[animation-play-state:paused]")}>
        {items.map((item) => (
          <li
            key={item.name + item.title}
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200
                       bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-8 py-6 md:w-[450px]
                       dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
          >
            <blockquote>
              <span className="relative z-20 text-sm leading-[1.6] text-neutral-800 dark:text-gray-100">“{item.quote}”</span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] text-neutral-500 dark:text-gray-400">{item.name}</span>
                  <span className="text-sm leading-[1.6] text-neutral-500 dark:text-gray-400">{item.title}</span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
