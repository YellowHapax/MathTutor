import React from 'react';

export interface Lesson {
  id: string;          // e.g. "topology-1-1"
  track: string;       // e.g. "topology"
  trackLabel: string;
  index: number;       // 1, 2, 3 within track
  title: string;
  description: string;
  coreIdea: string;    // one sentence for tutor prompt
  mbdBridge: string;   // one sentence for tutor prompt
  component: React.LazyExoticComponent<any>;
}

export const LESSONS: Lesson[] = [
  {
    id: 'topology-1-1',
    track: 'topology',
    trackLabel: 'Topology & Geometry',
    index: 1,
    title: 'Spaces & Neighborhoods',
    description: 'What it means to be "close" without coordinates',
    coreIdea: 'A space can be defined entirely by which points are considered close to each other (neighborhoods), without needing a grid or distances.',
    mbdBridge: 'The MBD state space B(t) lives on a manifold. Neighborhoods define what states are "reachable" from a given baseline without a discontinuous leap.',
    component: React.lazy(() => import('../lessons/topology/Lesson1_1')),
  },
  {
    id: 'topology-1-2',
    track: 'topology',
    trackLabel: 'Topology & Geometry',
    index: 2,
    title: 'Continuity Without Numbers',
    description: 'Deformation, homeomorphism, the coffee-cup/donut',
    coreIdea: 'Continuous transformations stretch and bend space without tearing or gluing.',
    mbdBridge: 'As the baseline B(t) adapts, the cognitive "shape" of the world continuously deforms. Tearing would mean trauma or discontinuous identity shifts.',
    component: React.lazy(() => import('../lessons/topology/Lesson1_2')),
  },
  {
    id: 'topology-1-3',
    track: 'topology',
    trackLabel: 'Topology & Geometry',
    index: 3,
    title: 'Manifolds & Tangent Spaces',
    description: 'Why local flatness enables global curvature',
    coreIdea: 'Curved spaces look flat if you zoom in enough, allowing us to use linear algebra locally.',
    mbdBridge: 'The update rule B(t+1) = B(t) + Î»(I âˆ’ B(t)) operates in the tangent space of the current baseline. Every baseline provides a local flat perspective on a globally complex reality.',
    component: React.lazy(() => import('../lessons/topology/Lesson1_3')),
  },
  {
    id: 'linearalgebra-2-1',
    track: 'linearalgebra',
    trackLabel: 'Linear Algebra',
    index: 1,
    title: 'Vectors as Arrows in Space',
    description: 'Geometric intuition before coordinates',
    coreIdea: 'Vectors represent movements or forces in space, independent of any arbitrary coordinate system we impose on them.',
    mbdBridge: 'The term (I - B(t)) is the fundamental variation vector: the exact direction and magnitude needed to pull the baseline toward the ideal/input.',
    component: React.lazy(() => import('../lessons/linearalgebra/Lesson2_1')),
  },
  {
    id: 'linearalgebra-2-2',
    track: 'linearalgebra',
    trackLabel: 'Linear Algebra',
    index: 2,
    title: 'Eigenvectors: The Skeleton',
    description: 'What a transformation "wants to do"',
    coreIdea: 'An eigenvector is a direction that is only stretched, not rotated, by a transformation. They reveal the "grain" of the space.',
    mbdBridge: 'In a multi-dimensional MBD framework, the eigenvectors of the coupling matrix K determine which combinations of baselines attract each other strongest.',
    component: React.lazy(() => import('../lessons/linearalgebra/Lesson2_2')),
  },
  {
    id: 'linearalgebra-2-3',
    track: 'linearalgebra',
    trackLabel: 'Linear Algebra',
    index: 3,
    title: 'The Gradient as a Covector',
    description: 'Why âˆ‡f points uphill and lives in dual space',
    coreIdea: 'The gradient isn\'t just an arrow; it\'s a set of contour lines waiting to measure the steepness of any passing vector.',
    mbdBridge: 'The update rule B(t+1) = B(t) + Î»(I âˆ’ B(t)) is gradient descent on the quadratic error landscape between expectation and reality.',
    component: React.lazy(() => import('../lessons/linearalgebra/Lesson2_3')),
  },
  {
    id: 'probability-3-1',
    track: 'probability',
    trackLabel: 'Probability & Information',
    index: 1,
    title: 'Probability as Geometry',
    description: 'Distributions as points on a simplex',
    coreIdea: 'A set of probabilities must sum to 1, constraining them to a flat geometric surface called a simplex.',
    mbdBridge: 'A probabilistic baseline B(t) represents a distribution over expected states. MBD dynamics move this distribution across the simplex.',
    component: React.lazy(() => import('../lessons/probability/Lesson3_1')),
  },
  {
    id: 'probability-3-2',
    track: 'probability',
    trackLabel: 'Probability & Information',
    index: 2,
    title: 'Entropy & Information',
    description: 'Uncertainty as a measure of spread',
    coreIdea: 'Entropy measures how spread out a distribution is. High entropy means fewer assumptions and more surprise.',
    mbdBridge: 'A narrow, low-entropy baseline is rigid and "surprised" by many inputs. A high-entropy baseline is flexible but holds little specific expectation.',
    component: React.lazy(() => import('../lessons/probability/Lesson3_2')),
  },
  {
    id: 'probability-3-3',
    track: 'probability',
    trackLabel: 'Probability & Information',
    index: 3,
    title: 'Bayes as Update on a Prior',
    description: 'Belief revision as vector operation',
    coreIdea: 'Bayes theorem multiplies what you believed before by what you just saw to get what you should believe now.',
    mbdBridge: 'MBD perturbation events are Bayesian evidence. The new baseline B(t+1) is the posterior, continuously revising the prior B(t) weighted by the evidence I.',
    component: React.lazy(() => import('../lessons/probability/Lesson3_3')),
  },
  {
    id: 'calculus-4-1',
    track: 'calculus',
    trackLabel: 'Calculus of Variation',
    index: 1,
    title: 'Derivatives as Linear Approximation',
    description: 'The best linear map at a point',
    coreIdea: 'A derivative replaces a wiggly, complicated curve with a straight line that traces its immediate path.',
    mbdBridge: 'When the baseline changes infinitesimally, the local change is a linear mapping from reality\'s perturbation into the baseline\'s geometry.',
    component: React.lazy(() => import('../lessons/calculus/Lesson4_1')),
  },
  {
    id: 'calculus-4-2',
    track: 'calculus',
    trackLabel: 'Calculus of Variation',
    index: 2,
    title: 'Differential Equations as Vector Fields',
    description: 'Solutions as flow lines',
    coreIdea: 'A differential equation assigns a little arrow to every point in space. Solving it means dropping a leaf and watching where the current takes it.',
    mbdBridge: 'The continuous-time formulation of MBD is the differential equation dB/dt = Î»(I(t) - B(t)), defining a flow field tracking the moving ideal.',
    component: React.lazy(() => import('../lessons/calculus/Lesson4_2')),
  },
  {
    id: 'calculus-4-3',
    track: 'calculus',
    trackLabel: 'Calculus of Variation',
    index: 3,
    title: 'The Natural Gradient',
    description: 'Why steepest descent depends on geometry',
    coreIdea: 'The direction of steepest descent changes if the underlying space is warped or curved, like running down a rocky hill.',
    mbdBridge: 'The standard gradient ignores the curvature of the baseline manifold. The Fisher-weighted natural gradient ensures MBD respects the information geometry of the mind.',
    component: React.lazy(() => import('../lessons/calculus/Lesson4_3')),
  }
];
