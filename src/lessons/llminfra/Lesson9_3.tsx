import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import LayerNormViz from '../../viz/2d/LayerNormViz';

export default function Lesson9_3() {
  return (
    <LessonShell lessonId="llminfra-9-3">
      <div className="space-y-6">
        <P>
          Modern transformers have one hundred — two hundred — layers. Without residual
          connections and LayerNorm they would be untrainable; with them, they behave like
          numerical solvers for an ordinary differential equation whose vector field is learned.
          The residual stream is the state; each layer is one Euler step of continuous-depth
          dynamics; LayerNorm is a Riemannian projection onto a unit sphere before each update.
          The transformer is an ODE solver in disguise.
        </P>

        <Def title="Residual stream update">
          A transformer block with pre-norm takes
          <BlockMath math="x_{\ell + 1} = x_\ell + f_\ell\big(\mathrm{LN}(x_\ell)\big)" />
          where <InlineMath math="f_\ell" /> is attention or an MLP sub-block. Layers write into
          a shared "stream" by adding their output — never overwriting. Reading from the stream
          is done via attention's value projection.
        </Def>

        <Thm
          title="Residual networks are ODE Euler solvers"
          proof={
            <>
              Interpret depth <InlineMath math="\ell" /> as continuous time{' '}
              <InlineMath math="t" /> and <InlineMath math="f_\ell" /> as evaluations of a
              vector field <InlineMath math="F(x, t)" />. Then{' '}
              <InlineMath math="x_{\ell + 1} = x_\ell + \Delta t \cdot F(x_\ell, t_\ell)" /> is
              forward Euler with <InlineMath math="\Delta t = 1" />. Taking depth{' '}
              <InlineMath math="\to \infty" /> with re-scaling recovers the neural ODE.
            </>
          }
        >
          The residual architecture is a discretization of
          <BlockMath math="\frac{dx}{d\ell} = F(x, \ell)" />
          where <InlineMath math="F" /> is the layer's learned operator. Very deep residual nets
          are stable for the same reason A-stable ODE integrators are: the additive-update
          structure keeps errors from compounding multiplicatively.
        </Thm>

        <div className="py-2"><LayerNormViz /></div>

        <Def title="LayerNorm as sphere projection">
          <InlineMath math="\mathrm{LN}(x) = \gamma \odot \frac{x - \mu(x)}{\sigma(x)} + \beta" />.
          After subtracting the mean, the vector <InlineMath math="(x - \mu)" /> is projected to
          the unit sphere scaled by <InlineMath math="\sqrt{d}" /> (since{' '}
          <InlineMath math="\sigma^2 = \|x - \mu\|^2 / d" />). Affine parameters{' '}
          <InlineMath math="\gamma, \beta" /> re-scale and shift.
        </Def>

        <Thm title="Pre-norm vs post-norm">
          Pre-norm <InlineMath math="x + f(\mathrm{LN}(x))" /> is stable to arbitrary depth; the
          residual path is an identity and gradients flow un-normalized. Post-norm{' '}
          <InlineMath math="\mathrm{LN}(x + f(x))" /> has a normalization <em>after</em> the
          residual, breaking the identity path and requiring careful learning-rate warmup.
          Modern LLMs (GPT-2+, Llama) all use pre-norm; original Transformer (Vaswani 2017)
          used post-norm.
        </Thm>

        <Practice>
          <strong>RMSNorm</strong> (Zhang & Sennrich, 2019) drops the mean-subtraction step —
          just divides by RMS — and is used in Llama, Mistral, Qwen. It's cheaper, and the
          mean-subtraction was mostly cosmetic since downstream matmuls are mean-equivariant.
          <strong>Neural ODEs</strong> (Chen et al., 2018) take the continuous limit literally:
          replace the residual stack with an ODE solver, parameterize <InlineMath math="F" />
          {' '}as a single net, and backprop via the adjoint method.{' '}
          <strong>Time-step schedules</strong> in diffusion models and flow matching use the same
          integration-of-vector-field framework; the mathematics of transformer depth and
          diffusion denoising are structurally identical.
        </Practice>
      </div>
    </LessonShell>
  );
}
