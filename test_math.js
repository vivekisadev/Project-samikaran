const N = 4;

const getCardBreakpoints = (index, N) => {
  const step = 1 / N;
  
  // Breakpoints:
  // BP0: 2 positions behind (or more)
  // BP1: 1 position behind (waiting)
  // BP2: arrives at front
  // BP3: starts leaving front
  // BP4: fully left front
  
  const bp0 = (index - 2) * step;
  const bp1 = (index - 1) * step;
  const bp2 = index * step;
  const bp3 = index * step + step * 0.6; // Hold for 60% of step
  const bp4 = (index + 1) * step;

  // We must ensure breakpoints are strictly increasing.
  // Because progress is 0 to 1, some breakpoints might be < 0 or > 1.
  // Framer Motion useTransform allows extrapolation, but it's cleaner to just provide the exact mathematical array.
  
  return [bp0, bp1, bp2, bp3, bp4];
};

for (let i = 0; i < N; i++) {
  console.log(`Card ${i} Breakpoints:`, getCardBreakpoints(i, N).map(b => b.toFixed(2)));
}
