export const motionTokens = {
  duration: {
    fast: 0.18,
    normal: 0.35,
    slow: 0.6
  },
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],
  distance: {
    small: 8,
    medium: 16,
    large: 24
  },
  stagger: 0.08
};

export type RevealDirection = "up" | "left" | "right";

export function scrollReveal(
  direction: RevealDirection,
  prefersReducedMotion: boolean | null,
  delay = 0
) {
  const offset = prefersReducedMotion ? 0 : motionTokens.distance.medium;
  const axis = direction === "up" ? "y" : "x";
  const signedOffset = direction === "left" ? -offset : offset;

  return {
    initial: {
      opacity: 0,
      [axis]: direction === "up" ? offset : signedOffset
    },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: {
      duration: prefersReducedMotion
        ? motionTokens.duration.fast
        : motionTokens.duration.normal,
      delay: prefersReducedMotion ? 0 : delay,
      ease: motionTokens.easing
    }
  };
}
