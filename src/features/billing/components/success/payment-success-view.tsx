'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  ArrowRight,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

// ─── Flower configuration ──────────────────────────────────────
const FLOWER_COLORS = [
  { petal: '#f472b6', center: '#fce7f3' },
  { petal: '#a78bfa', center: '#ede9fe' },
  { petal: '#fbbf24', center: '#fef9c3' },
  { petal: '#60a5fa', center: '#dbeafe' },
  { petal: '#fb923c', center: '#fff7ed' },
  { petal: '#34d399', center: '#d1fae5' },
  { petal: '#f472b6', center: '#fdf2f8' },
  { petal: '#818cf8', center: '#eef2ff' }
];

type Flower = {
  id: number;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  delay: number;
  petalCount: number;
  rotation: number;
};

function generateFlowers(): Flower[] {
  const positions = [
    { x: -120, y: -100 },
    { x: 120, y: -100 },
    { x: -170, y: 20 },
    { x: 170, y: 20 },
    { x: -120, y: 120 },
    { x: 120, y: 120 },
    { x: -50, y: -160 },
    { x: 50, y: -160 },
    { x: -60, y: 150 },
    { x: 60, y: 150 },
    { x: -220, y: -60 },
    { x: 220, y: -60 },
    { x: -200, y: 100 },
    { x: 200, y: 100 },
    { x: -80, y: -200 },
    { x: 80, y: -200 },
    { x: -260, y: -140 },
    { x: 260, y: -140 },
    { x: -240, y: 140 },
    { x: 240, y: 140 }
  ];

  return positions.map((pos, i) => ({
    id: i,
    x: pos.x,
    y: pos.y,
    size: 28 + Math.random() * 24,
    colorIndex: i % FLOWER_COLORS.length,
    delay: 0.5 + i * 0.08,
    petalCount: 5 + (i % 3) * 2,
    rotation: (i * 37) % 360
  }));
}

// ─── Single Flower ──────────────────────────────────────────────
function BloomingFlower({ flower }: { flower: Flower }) {
  const color = FLOWER_COLORS[flower.colorIndex];
  const petalAngle = 360 / flower.petalCount;
  const petalWidth = flower.size * 0.35;
  const petalHeight = flower.size * 0.7;

  return (
    <motion.div
      className='absolute'
      style={{ left: '50%', top: '50%' }}
      initial={{
        x: flower.x,
        y: flower.y,
        scale: 0,
        rotate: flower.rotation,
        opacity: 0
      }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: flower.delay,
        duration: 0.6,
        type: 'spring',
        stiffness: 120,
        damping: 12
      }}
    >
      {/* Stem */}
      <motion.div
        className='absolute'
        style={{
          left: '50%',
          bottom: 0,
          width: 2,
          height: flower.size * 1.2,
          backgroundColor: '#86efac',
          transformOrigin: 'bottom center',
          borderRadius: 1
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: flower.delay + 0.1, duration: 0.4 }}
      />

      {/* Petals */}
      {Array.from({ length: flower.petalCount }).map((_, pIdx) => (
        <motion.div
          key={pIdx}
          className='absolute rounded-full'
          style={{
            left: '50%',
            top: '50%',
            width: petalWidth,
            height: petalHeight,
            marginLeft: -petalWidth / 2,
            marginTop: -petalHeight,
            backgroundColor: color.petal,
            transformOrigin: 'bottom center',
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%'
          }}
          initial={{
            rotate: `${pIdx * petalAngle}deg`,
            scaleY: 0,
            scaleX: 0.3,
            opacity: 0
          }}
          animate={{
            scaleY: 1,
            scaleX: 1,
            opacity: 1
          }}
          transition={{
            delay: flower.delay + 0.15 + pIdx * 0.04,
            duration: 0.5,
            type: 'spring',
            stiffness: 150,
            damping: 10
          }}
        />
      ))}

      {/* Center */}
      <motion.div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
        style={{
          width: flower.size * 0.3,
          height: flower.size * 0.3,
          backgroundColor: color.center,
          border: `2px solid ${color.petal}`
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: flower.delay + 0.4,
          type: 'spring',
          stiffness: 300,
          damping: 15
        }}
      />

      {/* Shimmer */}
      <motion.div
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
        style={{
          width: flower.size * 0.15,
          height: flower.size * 0.15,
          backgroundColor: 'rgba(255,255,255,0.6)'
        }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
        transition={{
          delay: flower.delay + 0.6,
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
}

// ─── Floating petals ────────────────────────────────────────────
function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 600 - 300,
      y: Math.random() * 600 - 300,
      size: 6 + Math.random() * 10,
      color: FLOWER_COLORS[i % FLOWER_COLORS.length].petal,
      delay: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      rotate: Math.random() * 360
    }));
  }, []);

  return (
    <>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className='absolute rounded-full opacity-0'
          style={{
            left: '50%',
            top: '50%',
            width: petal.size,
            height: petal.size * 0.6,
            backgroundColor: petal.color,
            borderRadius: '50% 0 50% 0'
          }}
          initial={{ x: 0, y: 0, rotate: petal.rotate, opacity: 0 }}
          animate={{
            x: petal.x,
            y: petal.y,
            opacity: [0, 0.7, 0],
            rotate: petal.rotate + 180
          }}
          transition={{
            delay: petal.delay,
            duration: petal.duration,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
    </>
  );
}

// ─── Main View ──────────────────────────────────────────────────
export const PaymentSuccessView = () => {
  const params = useParams();
  const router = useRouter();
  const [phase, setPhase] = useState<'processing' | 'success'>('processing');
  const flowers = useMemo(() => generateFlowers(), []);
  const gardenRef = useRef<HTMLDivElement>(null);
  const [gardenScale, setGardenScale] = useState(1);

  const workspaceSlug = Array.isArray(params.workspace)
    ? params.workspace[0]
    : params.workspace;

  useEffect(() => {
    const timer = setTimeout(() => setPhase('success'), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Scale the garden to fit available viewport space
  useEffect(() => {
    if (phase !== 'success') return;

    const updateScale = () => {
      if (!gardenRef.current) return;
      const parent = gardenRef.current.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      // Reserve ~180px for text + buttons + padding
      const availableHeight = parentRect.height - 140;
      const availableWidth = parentRect.width - 16;
      const scaleX = Math.min(availableWidth / 600, 1);
      const scaleY = Math.min(availableHeight / 500, 1);
      setGardenScale(Math.min(scaleX, scaleY, 1));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [phase]);

  return (
    <div className='flex h-dvh w-full items-center justify-center overflow-hidden p-3 sm:p-4'>
      <AnimatePresence mode='wait'>
        {phase === 'processing' ? (
          <motion.div
            key='processing'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col items-center gap-4 sm:gap-6'
          >
            <div className='relative size-10 sm:size-12'>
              <motion.div className='absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700' />
              <motion.div
                className='absolute inset-0 rounded-full border-4 border-t-neutral-900 dark:border-t-neutral-100'
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </div>

            <div className='text-center'>
              <h2 className='text-lg font-semibold text-neutral-900 sm:text-xl dark:text-neutral-100'>
                Processing your payment
              </h2>
              <p className='mt-1.5 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400'>
                Please wait while we confirm your subscription...
              </p>
            </div>

            <div className='h-1.5 w-48 overflow-hidden rounded-full bg-neutral-200 sm:w-64 dark:bg-neutral-700'>
              <motion.div
                className='h-full rounded-full bg-neutral-900 dark:bg-neutral-100'
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='success'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className='flex h-full w-full max-w-2xl flex-col items-center justify-center gap-2 sm:gap-4'
          >
            {/* Flowers blooming garden */}
            <div
              ref={gardenRef}
              className='relative flex shrink-0 items-center justify-center'
              style={{ width: 400, height: 300 }}
            >
              <div
                style={{
                  transform: `scale(${gardenScale})`,
                  transformOrigin: 'center center',
                  width: 600,
                  height: 500,
                  position: 'relative'
                }}
              >
                <FloatingPetals />

                {flowers.map((flower) => (
                  <BloomingFlower key={flower.id} flower={flower} />
                ))}

                {/* Center checkmark */}
                <motion.div
                  className='absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 200,
                    damping: 12
                  }}
                >
                  <div className='relative'>
                    <motion.div
                      className='size-20 rounded-full bg-green-100 sm:size-28 dark:bg-green-900/30'
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15
                      }}
                    />
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.5,
                          type: 'spring',
                          stiffness: 200,
                          damping: 12
                        }}
                      >
                        <CheckCircle className='size-12 text-green-600 sm:size-16 dark:text-green-400' />
                      </motion.div>
                    </div>

                    {/* Glow ring */}
                    <motion.div
                      className='absolute -inset-3 rounded-full border-2 border-green-300/50 sm:-inset-4 dark:border-green-500/30'
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        delay: 0.8,
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Text */}
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <h2 className='text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100'>
                Payment Successful!
              </h2>
              <p className='mt-1 text-xs text-neutral-500 sm:mt-2 sm:text-sm dark:text-neutral-400'>
                Your subscription has been activated. Welcome aboard!
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className='flex flex-col gap-2 sm:flex-row sm:gap-3'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <Button
                onClick={() => router.push(`/${workspaceSlug}/overview`)}
                size='default'
                className='sm:size-lg gap-2'
              >
                <LayoutDashboard className='size-4' />
                Go to Overview
                <ArrowRight className='size-4' />
              </Button>
              <Button
                onClick={() =>
                  router.push(`/${workspaceSlug}/settings/billing`)
                }
                variant='outline'
                size='default'
                className='sm:size-lg gap-2'
              >
                <CreditCard className='size-4' />
                Go to Billing
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
