'use client';

/**
 * use-draggable — makes an element draggable within the viewport.
 * Returns position state and mouse handlers to attach to the drag handle.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Partial<Position>;
  /** Constrain the element within the viewport */
  constrain?: boolean;
}

export function useDraggable({
  initialPosition = {},
  constrain = true
}: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position>({
    x:
      initialPosition.x ??
      (typeof window !== 'undefined' ? window.innerWidth - 400 : 1200),
    y:
      initialPosition.y ??
      (typeof window !== 'undefined' ? window.innerHeight - 600 : 700)
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    elX: number;
    elY: number;
  } | null>(null);
  const elRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        elX: position.x,
        elY: position.y
      };
    },
    [position]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      setIsDragging(true);
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        elX: position.x,
        elY: position.y
      };
    },
    [position]
  );

  useEffect(() => {
    if (!isDragging || !dragRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      let newX = dragRef.current.elX + dx;
      let newY = dragRef.current.elY + dy;

      if (constrain && elRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const elW = elRef.current.offsetWidth;
        const elH = elRef.current.offsetHeight;
        newX = Math.max(0, Math.min(newX, w - elW));
        newY = Math.max(0, Math.min(newY, h - elH));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      let newX = dragRef.current.elX + dx;
      let newY = dragRef.current.elY + dy;

      if (constrain && elRef.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const elW = elRef.current.offsetWidth;
        const elH = elRef.current.offsetHeight;
        newX = Math.max(0, Math.min(newX, w - elW));
        newY = Math.max(0, Math.min(newY, h - elH));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, constrain]);

  return {
    position,
    isDragging,
    elRef,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart
    }
  };
}
