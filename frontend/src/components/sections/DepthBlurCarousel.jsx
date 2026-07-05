import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * Premium 3D Depth-Blur Carousel
 * Inspired by the Framer Depth_Blur_Carousel component.
 * Features: 3D perspective rotation, depth-based scaling, edge blur,
 * smooth spring physics, drag/wheel support, and auto-play.
 */

// Individual Card Component
const CarouselCard = ({
  src,
  title,
  index,
  total,
  smoothScroll,
  itemWidth,
  itemHeight,
  sideItemWidth,
  sideItemHeight,
  gap,
  maxRotation,
  borderRadius,
  onClick,
}) => {
  const localOffset = useTransform(smoothScroll, (v) => {
    let linearBase = index - v;
    let mapped = ((linearBase % total) + total) % total;
    if (mapped > total / 2) mapped -= total;
    return mapped;
  });

  const absOffset = useTransform(localOffset, Math.abs);

  const cardWidth = useTransform(absOffset, [0, 1], [itemWidth, sideItemWidth], { clamp: true });
  const cardHeight = useTransform(absOffset, [0, 1], [itemHeight, sideItemHeight], { clamp: true });
  const marginLeft = useTransform(cardWidth, (w) => -w / 2);
  const marginTop = useTransform(cardHeight, (h) => -h / 2);

  const x = useTransform(localOffset, (o) => {
    const a = Math.abs(o);
    const s = Math.sign(o);
    const centerToNext = itemWidth / 2 + gap + sideItemWidth / 2;
    const sideToSide = sideItemWidth + gap;
    if (a === 0) return 0;
    if (a <= 1) return s * centerToNext * a;
    return s * (centerToNext + (a - 1) * sideToSide * 0.85);
  });

  const z = useTransform(absOffset, (a) => -a * 200);
  const rotateY = useTransform(localOffset, (o) =>
    Math.sign(o) * Math.min(Math.abs(o) * 35, maxRotation)
  );
  const zIndex = useTransform(absOffset, (a) => 1000 - Math.round(a * 10));
  const visibilityOpacity = useTransform(absOffset, [0, 5, 7], [1, 1, 0]);
  const scale = useTransform(absOffset, [0, 1, 3], [1, 0.92, 0.85], { clamp: true });

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft,
        marginTop,
        width: cardWidth,
        height: cardHeight,
        rotateY,
        x,
        z,
        zIndex,
        scale,
        transformStyle: 'preserve-3d',
      }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          opacity: visibilityOpacity,
          overflow: 'hidden',
        }}
        className="shadow-2xl"
      >
        <img
          src={src}
          alt={title || `Event ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Subtle gradient overlay at bottom */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ borderRadius }}
        />
      </motion.div>
    </motion.div>
  );
};

const DepthBlurCarousel = ({
  images = [],
  onImageClick,
  // Layout
  itemWidth = 520,
  itemHeight = 340,
  sideItemWidth = 340,
  sideItemHeight = 310,
  gap = 50,
  // Effects
  maxRotation = 65,
  perspective = 500,
  scrollDamping = 80,
  // Styling
  borderRadius = 16,
  // Edge Blur
  blurSpread = 22,
  blurStrength = 20,
  // Auto-play
  autoPlay = true,
  autoPlayInterval = 3000,
}) => {
  const scrollTarget = useRef(0);
  const rawScroll = useMotionValue(0);
  const snapTimeout = useRef(null);
  const autoPlayTimer = useRef(null);
  const isDragging = useRef(false);

  const smoothScroll = useSpring(rawScroll, {
    stiffness: 180,
    damping: scrollDamping,
    mass: 1,
    restDelta: 0.001,
  });

  // Build items pool (need enough for infinite looping illusion)
  const renderItems = React.useMemo(() => {
    if (!images || images.length === 0) return [];
    const items = [];
    while (items.length < Math.max(18, images.length * 3)) {
      items.push(...images);
    }
    return items;
  }, [images]);

  const totalItems = renderItems.length;

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || images.length <= 1) return;
    clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      if (!isDragging.current) {
        scrollTarget.current += 1;
        rawScroll.set(scrollTarget.current);
      }
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, images.length, rawScroll]);

  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(autoPlayTimer.current);
  }, [startAutoPlay]);

  // Wheel handler
  const handleWheel = useCallback(
    (e) => {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY * 0.8;
      scrollTarget.current += delta * 0.004;
      rawScroll.set(scrollTarget.current);

      clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        scrollTarget.current = Math.round(scrollTarget.current);
        rawScroll.set(scrollTarget.current);
      }, 150);

      // Restart auto-play after interaction
      startAutoPlay();
    },
    [rawScroll, startAutoPlay]
  );

  // Drag handlers
  const handlePan = useCallback(
    (_, info) => {
      isDragging.current = true;
      const delta = -info.delta.x * 0.005;
      scrollTarget.current += delta;
      rawScroll.set(scrollTarget.current);
    },
    [rawScroll]
  );

  const handlePanEnd = useCallback(
    (_, info) => {
      isDragging.current = false;
      scrollTarget.current += -info.velocity.x * 0.0015;
      scrollTarget.current = Math.round(scrollTarget.current);
      rawScroll.set(scrollTarget.current);
      startAutoPlay();
    },
    [rawScroll, startAutoPlay]
  );

  if (images.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: Math.max(perspective, 1),
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Invisible drag/scroll capture layer */}
      <motion.div
        onWheel={handleWheel}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9999,
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
      />

      {/* 3D Cards container */}
      <div
        style={{
          position: 'relative',
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {renderItems.map((item, i) => (
          <CarouselCard
            key={`card-${i}`}
            src={item.src}
            title={item.title}
            index={i}
            total={totalItems}
            smoothScroll={smoothScroll}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            sideItemWidth={sideItemWidth}
            sideItemHeight={sideItemHeight}
            gap={gap}
            maxRotation={maxRotation}
            borderRadius={borderRadius}
            onClick={() => onImageClick && onImageClick(item, i % images.length)}
          />
        ))}
      </div>

      {/* Left edge blur */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${blurSpread}%`,
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          maskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />

      {/* Right edge blur */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: `${blurSpread}%`,
          backdropFilter: `blur(${blurStrength}px)`,
          WebkitBackdropFilter: `blur(${blurStrength}px)`,
          maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
      />
    </div>
  );
};

export default DepthBlurCarousel;
