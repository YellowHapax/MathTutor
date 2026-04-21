import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import DiffusionViz from '../../viz/2d/DiffusionViz';

export default function Lesson5_6() {
  return (
    <LessonShell lessonId="stochastics-5-6">
      <div className="space-y-6">
        <P>
          Anderson's 1982 theorem states something startling: every forward diffusion has an exact
          reverse diffusion, driven by the original drift <em>minus the score</em>. Run noise
          backward through it — you get signal. This is the heartbeat of generative diffusion.
        </P>

        <Thm
          title="Anderson's Reverse-Time SDE (1982)"
          proof={
            <>
              Kolmogorov's forward and backward equations can be paired so the reverse-time density
              satisfies the same PDE with flipped time, if and only if the drift is replaced by
              <InlineMath math="\mu - \sigma \sigma^\top \nabla \log p_t" />. The
              <InlineMath math="-\sigma\sigma^\top \nabla \log p_t" /> term cancels the time-reversal
              sign flip in the score-gradient entering Fokker–Planck.
            </>
          }
        >
          If <InlineMath math="dx = \mu(x,t)\,dt + \sigma(x,t)\,dW_t" /> is a forward SDE with
          time-marginal density <InlineMath math="p_t" />, then the process running backward in time
          satisfies
          <BlockMath math="dx = \big[\mu(x,t) - \sigma \sigma^\top \nabla_x \log p_t(x)\big]\,dt + \sigma(x,t)\,d\bar W_t" />
          where <InlineMath math="\bar W" /> is a reverse-time Brownian motion.
        </Thm>

        <Def title="Probability Flow ODE">
          The corresponding <em>deterministic</em> process with identical time-marginals{' '}
          <InlineMath math="p_t" /> is
          <BlockMath math="\frac{dx}{dt} = \mu(x,t) - \tfrac12 \sigma\sigma^\top \nabla_x \log p_t(x)." />
          An ODE! This is how fast samplers (DPM-Solver, DDIM, Heun) generate in 10–50 steps instead
          of 1000.
        </Def>

        <div className="py-2"><DiffusionViz /></div>

        <P>
          Song &amp; Ermon (2021) unified the picture: train a score network{' '}
          <InlineMath math="s_\theta(x,t) \approx \nabla \log p_t(x)" />, then at inference run the
          reverse SDE (stochastic) or probability flow ODE (deterministic) from pure Gaussian noise
          back to <InlineMath math="t = 0" />. The data distribution appears at the endpoint.
        </P>

        <Thm title="Variance-Preserving Schedule (DDPM)">
          Forward: <InlineMath math="dx = -\tfrac12 \beta(t) x\,dt + \sqrt{\beta(t)}\,dW_t" />,{' '}
          with <InlineMath math="\beta(t)" /> a monotone schedule. The marginal{' '}
          <InlineMath math="p_t = \mathcal{N}(x \mid \alpha_t x_0, (1-\alpha_t^2) I)" /> where{' '}
          <InlineMath math="\alpha_t = \exp(-\tfrac12 \int_0^t \beta(s) ds)" />. Reverse:
          <BlockMath math="dx = \big[-\tfrac12 \beta(t) x - \beta(t) s_\theta(x,t)\big]dt + \sqrt{\beta(t)}\,d\bar W_t." />
        </Thm>

        <Practice>
          This single pair of equations — forward noise injection, reverse score-guided denoising —
          underlies Stable Diffusion 3 (rectified flow is its OT-geodesic sibling), DALL·E 3,
          Imagen, Sora (video), AudioLDM, diffusion-LLMs. Classifier-free guidance is an <em>edit</em>
          to the reverse drift: replace <InlineMath math="s_\theta(x,t)" /> with{' '}
          <InlineMath math="s_\theta(x,t,c) + w\,[s_\theta(x,t,c) - s_\theta(x,t,\emptyset)]" /> to
          sharpen conditioning.
        </Practice>
      </div>
    </LessonShell>
  );
}
