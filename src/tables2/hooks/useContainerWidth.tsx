import { useEffect, useRef, useState } from "react";
export interface SizeOption {
  width: number;
  height: number;
}
export function useResizableContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<SizeOption>();

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return {
    containerRef,
    size,
  };
}
