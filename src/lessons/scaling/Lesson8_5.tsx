import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import LyapunovViz from '../../viz/2d/LyapunovViz';

export default function Lesson8_5() {
  return (
    <LessonShell lessonId="scaling-8-5">
      <div className="space-y-6">
        <P>
          Two trajectories start a hair apart. In a stable system they stay close; in a chaotic
          one they peel apart exponentially. The rate of that peeling is the Lyapunov exponent,
          and it's a sharp knife: positive means chaos, zero means marginal, negative means
          dissipation to a fixed point. It decides whether a dynamical system can remember, can
          compute, or merely scrambles.
        </P>

        <Def title="Lyapunov exponent">
          For a dynamical system <InlineMath math="x_{t+1} = f(x_t)" /> (or{' '}
          <InlineMath math="\dot{x} = F(x)" />), the largest Lyapunov exponent is
          <BlockMath math="\lambda = \lim_{t \to \infty} \frac{1}{t} \log \frac{\|\delta x(t)\|}{\|\delta x(0)\|} = \lim_{t \to \infty} \frac{1}{t} \sum_{k = 0}^{t-1} \log |f'(x_k)|" />
          for a differentiable 1D map. Positive <InlineMath math="\lambda" /> means exponential
          separation; <InlineMath math="\lambda = 0" /> marks the edge of chaos.
        </Def>

        <Thm
          title="Oseledec's multiplicative ergodic theorem"
          proof={
            <>
              Apply Kingman's subadditive ergodic theorem to{' '}
              <InlineMath math="\log \|Df^t(x)\|" />. Subadditivity gives almost-sure
              convergence along an ergodic orbit, independent of the initial perturbation
              direction (for the top exponent).
            </>
          }
        >
          For almost every orbit of an ergodic measure, the limit defining{' '}
          <InlineMath math="\lambda" /> exists and is independent of <InlineMath math="x_0" />.
          For <InlineMath math="n" />-dimensional dynamics, the Lyapunov spectrum{' '}
          <InlineMath math="\lambda_1 \ge \cdots \ge \lambda_n" /> partitions{' '}
          <InlineMath math="\mathbb{R}^n" /> into invariant subspaces labelled by exponent.
        </Thm>

        <div className="py-2"><LyapunovViz /></div>

        <Def title="Kolmogorov–Sinai entropy">
          <InlineMath math="h_{\mathrm{KS}} = \sum_{\lambda_i > 0} \lambda_i" />: the rate of
          information production along typical trajectories. Positive KS entropy IS chaos IS
          sensitive-dependence-on-initial-conditions. The Kaplan–Yorke conjecture ties this to
          the attractor's fractal dimension: <InlineMath math="d_{KY} = k + \sum_{i \le k} \lambda_i / |\lambda_{k+1}|" />.
        </Def>

        <Thm title="Edge of chaos in recurrent networks">
          A recurrent net's training signal is carried by gradient magnitudes, which grow like{' '}
          <InlineMath math="\exp(\lambda T)" /> across <InlineMath math="T" /> timesteps. For the
          backprop signal to neither explode nor vanish, we need{' '}
          <InlineMath math="\lambda \approx 0" /> — the edge of chaos. LSTM/GRU gating, and
          orthogonal initialization of recurrent matrices, exist to enforce this.
        </Thm>

        <Practice>
          <strong>Signal propagation</strong> in feedforward networks (Schoenholz et al., 2017)
          uses a depth-wise Lyapunov exponent on correlations between input pairs: at criticality
          ( <InlineMath math="\lambda = 0" /> ) correlations propagate, elsewhere they collapse
          or saturate. <strong>Transformers sidestep this</strong>: residual streams skip
          nonlinearities, so the effective Jacobian at depth is a sum, not a product, and
          gradient signal survives hundreds of layers without edge-of-chaos tuning.
          <strong>Neural ODEs</strong> inherit the full Lyapunov analysis of the underlying
          vector field. <strong>SGD's implicit regularization</strong> includes a bias toward
          flat minima with small top Hessian eigenvalue — small Lyapunov, stable solutions.
        </Practice>
      </div>
    </LessonShell>
  );
}
