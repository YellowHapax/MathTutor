import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import BrownianViz from '../../viz/2d/BrownianViz';

export default function Lesson5_3() {
  return (
    <LessonShell lessonId="stochastics-5-3">
      <div className="space-y-6">
        <P>
          Brownian motion is the object that refuses to be differentiated but demands to be
          integrated. Every diffusion model's forward process is one, every SDE is written against
          one, and Itô's calculus was invented to handle them.
        </P>

        <Def title="Standard Brownian Motion">
          A process <InlineMath math="(B_t)_{t \ge 0}" /> is a standard Brownian motion if
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li><InlineMath math="B_0 = 0" /></li>
            <li>Increments are independent: <InlineMath math="B_t - B_s \perp \mathcal{F}_s" /></li>
            <li><InlineMath math="B_t - B_s \sim \mathcal{N}(0, t-s)" /></li>
            <li>Sample paths are a.s. continuous</li>
          </ol>
        </Def>

        <Thm title="Nowhere Differentiable but Has Quadratic Variation">
          Almost every Brownian path is nowhere differentiable. Nevertheless the quadratic variation
          <BlockMath math="[B]_t := \lim_{\|\pi\| \to 0} \sum_{t_i \in \pi} (B_{t_{i+1}} - B_{t_i})^2 = t" />
          (in <InlineMath math="L^2" /> and a.s. along refining partitions). Classical calculus
          fails; Itô calculus succeeds.
        </Thm>

        <div className="py-2"><BrownianViz /></div>

        <Thm
          title="Itô's Formula"
          proof={
            <>
              Taylor-expand <InlineMath math="f(B_{t+dt}) = f(B_t) + f'(B_t) dB_t + \tfrac12 f''(B_t) (dB_t)^2 + \dots" />.
              Because <InlineMath math="(dB_t)^2 = dt" /> (not negligible!), the second-order term survives
              while all higher-order terms vanish in <InlineMath math="L^2" />.
            </>
          }
        >
          For <InlineMath math="f \in C^2" /> and an Itô process <InlineMath math="dX_t = \mu_t\,dt + \sigma_t\,dB_t" />:
          <BlockMath math="df(X_t) = \Big(\mu_t f'(X_t) + \tfrac12 \sigma_t^2 f''(X_t)\Big) dt + \sigma_t f'(X_t)\,dB_t" />
          The extra <InlineMath math="\tfrac12 \sigma^2 f''" /> term is the <em>Itô correction</em>{' '}
          — the price of the non-smooth path.
        </Thm>

        <P>
          The chain rule of ordinary calculus is wrong here. If{' '}
          <InlineMath math="X_t = B_t^2" />, then{' '}
          <InlineMath math="dX_t = 2 B_t\,dB_t + dt" /> — the "<InlineMath math="+dt" />" is the ghost
          left by quadratic variation.
        </P>

        <BlockMath math="\text{MBD-SDE}: \quad dB(t) = \lambda(I - B(t))\,dt + \sigma\,dW_t" />
        <P className="text-sm italic">
          This is the <strong>Ornstein–Uhlenbeck</strong> process: a noisy MBD. The stationary
          distribution is <InlineMath math="\mathcal{N}(I, \sigma^2/(2\lambda))" /> — a mind at
          rest, rattling around its ideal.
        </P>

        <Practice>
          Every diffusion model's forward SDE is{' '}
          <InlineMath math="dx_t = -\tfrac12 \beta(t) x_t\,dt + \sqrt{\beta(t)}\,dW_t" /> — the
          variance-preserving SDE. Itô's lemma is how we compute the score ∇log p<sub>t</sub> of the
          noised distribution, which the neural network is trained to estimate.
        </Practice>
      </div>
    </LessonShell>
  );
}
