import { useEffect, useRef } from 'react';

// Sahifa animatsiyasi — mount bo'lganda smooth chiqib keladi
// CSS keyframes ishlatiladi — raqamli kutubxona kerak emas
export default function AnimatedPage({ children, variant = 'default' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Dastlab yashirin holat
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = 'none';

    // Keyingi frameda animatsiya boshlaydi
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.52s cubic-bezier(0.22,1,0.36,1), transform 0.52s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0px)';
      });
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
