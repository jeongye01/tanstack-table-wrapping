import { useEffect, useRef } from 'react';

export const useInfiniteScroll = ({
   containerRef,
   onLoadMore,
   hasMoreData = true,
   rootMargin = '0px',
   threshold = 1.0,
}) => {
   const bottomRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!containerRef.current || !bottomRef.current || !onLoadMore || !hasMoreData) return;
      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               onLoadMore();
            }
         },
         {
            root: containerRef.current,
            rootMargin,
            threshold,
         },
      );

      observer.observe(bottomRef.current);

      return () => observer.disconnect();
   }, [containerRef, onLoadMore, hasMoreData, rootMargin, threshold]);

   return { bottomRef };
};
