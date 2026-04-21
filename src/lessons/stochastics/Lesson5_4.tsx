import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import LangevinViz from '../../viz/2d/LangevinViz';

export default function Lesson5_4() {
  return (
    <LessonShell lessonId="stochastics-5-4">
      <div className="space-y-6">
        <P>
          Take gradient descent. Add Gaussian noise at every step. You do not get noisy
          optimization — you get a <em>sampler</em>. The Langevin SDE turns the gradient of a
          log-density into an ergodic process whose stationary distribution is that density itself.
        </P>

        <Def title="Overdamped Langevin SDE">
          <BlockMath math="dX_t = -\nabla U(X_t)\,dt + \sqrt{2\beta^{-1}}\,dW_t" />
          where <InlineMath math="U: \mathbb{R}^n \to \mathbb{R}" /> is a potential and{' '}
          <InlineMath math="\beta > 0" /> is inverse temperature.
        </Def>

        <Thm
          title="Stationary Distribution"
          proof={
            <>
              Apply the Fokker–Planck equation: the density{' '}
              <InlineMath math="\rho_t(x)" /> evolves as{' '}
              <InlineMath math="\partial_t \rho = \nabla \cdot (\rho \nabla U) + \beta^{-1} \Delta \rho" />.
              The stationary solution sets this to zero: <InlineMath math="\rho_\infty \propto e^{-\beta U}" />.
            </>
          }
        >
          Under mild conditions (e.g. <InlineMath math="U" /> confining), the unique invariant
          measure of the Langevin SDE is the <strong>Gibbs distribution</strong>{' '}
          <InlineMath math="\pi(x) \propto e^{-\beta U(x)}" />. Convergence is exponential with rate
          controlled by the log-Sobolev constant of <InlineMath math="\pi" />.
        </Thm>

        <div className="py-2"><LangevinViz /></div>

        <P>
          Two regimes collapse into this one equation. As <InlineMath math="\beta \to \infty" />, the
          noise vanishes and Langevin → gradient descent, concentrating at{' '}
          <InlineMath math="\arg\min U" />. As <InlineMath math="\beta \to 0" />, the gradient
          vanishes and Langevin → pure Brownian motion. Between them lies Bayesian sampling: the
          posterior is <InlineMath math="\pi \propto e^{-\beta U}" /> with <InlineMath math="U" /> a
          negative log-posterior.
        </P>

        <BlockMath math="\text{SGD} \approx \text{Langevin with } \beta^{-1} \propto \text{learning rate} \times \text{batch noise}" />

        <Practice>
          <strong>SGLD (Stochastic Gradient Langevin Dynamics)</strong> makes every SGD step a
          Bayesian sampler by injecting noise scaled to the step size. At finite batch size, SGD
          already is approximately Langevin, which is why large-batch training behaves differently —
          less implicit regularization from Langevin-noise exploration. Score-based diffusion
          samplers use annealed Langevin: run Langevin against ∇log p<sub>t</sub> for decreasing{' '}
          <InlineMath math="t" />.
        </Practice>
      </div>
    </LessonShell>
  );
}
