import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import NTKViz from '../../viz/2d/NTKViz';

export default function Lesson8_6() {
  return (
    <LessonShell lessonId="scaling-8-6">
      <div className="space-y-6">
        <P>
          A neural network is a parametric function — which, for any nontrivial architecture,
          means a highly nonlinear dependence on weights. But take width to infinity with the
          right scaling, and something miraculous happens: the dynamics linearize. The network's
          evolution under gradient descent becomes equivalent to kernel regression with a fixed
          kernel, the Neural Tangent Kernel. This single observation unified the theory of deep
          learning — and revealed precisely how and when it breaks.
        </P>

        <Def title="Neural Tangent Kernel">
          For a network <InlineMath math="f_\theta(x)" /> with parameters{' '}
          <InlineMath math="\theta" />, the empirical NTK is
          <BlockMath math="\Theta_\theta(x, x') = \big\langle \nabla_\theta f_\theta(x),\, \nabla_\theta f_\theta(x') \big\rangle." />
          In the infinite-width limit with NTK parameterization,{' '}
          <InlineMath math="\Theta_\theta \to \Theta^*" /> deterministically at initialization,
          and crucially stays constant throughout training.
        </Def>

        <Thm
          title="NTK training dynamics are kernel gradient flow"
          proof={
            <>
              For MSE loss <InlineMath math="L = \frac{1}{2}\|f_\theta(X) - Y\|^2" />,
              <InlineMath math="\dot\theta = -\nabla_\theta L" /> gives
              <InlineMath math="\dot{f_\theta(X)} = -\Theta_\theta(X, X)(f_\theta(X) - Y)" /> by
              the chain rule. In the width-infinity limit <InlineMath math="\Theta_\theta" /> is
              constant, so <InlineMath math="f" /> at training points follows closed-form
              exponential convergence.
            </>
          }
        >
          Under gradient flow in the NTK regime,
          <BlockMath math="f_t(x) = f_0(x) + \Theta^*(x, X)\, \Theta^*(X, X)^{-1} \big(I - e^{-\eta \Theta^*(X, X) t}\big) (Y - f_0(X))." />
          As <InlineMath math="t \to \infty" />, the predictor is exactly the kernel-ridgeless
          regressor in the RKHS of <InlineMath math="\Theta^*" />. Training is deterministic
          once you know the kernel.
        </Thm>

        <div className="py-2"><NTKViz /></div>

        <Def title="Feature learning vs lazy regime">
          The NTK regime is "lazy": weights barely move (<InlineMath math="\|\theta_t - \theta_0\| = O(1/\sqrt{\mathrm{width}})" />).
          Features are fixed at initialization; only readouts adapt. The{' '}
          <em>feature-learning regime</em> — μP (Yang & Hu, 2021), Tensor Programs — uses a
          different scaling that keeps nontrivial weight movement in the infinite-width limit,
          recovering representation learning.
        </Def>

        <Thm title="NTK convergence rate and spectral bias">
          The convergence rate along each NTK eigendirection is{' '}
          <InlineMath math="e^{-\eta \lambda_i t}" />. Low-frequency components (large{' '}
          <InlineMath math="\lambda_i" />) are learned first; high-frequency components last.
          This is the <em>spectral bias</em> of neural networks — the reason they generalize
          before they overfit.
        </Thm>

        <Practice>
          The <strong>NTK justifies why very wide networks train stably</strong>: in the
          linearized regime, the loss surface is convex in function-space. <strong>μP
          parameterization</strong> is the production-grade correction used by GPT-4-class
          models: keep features learning as width scales, unlike the lazy NTK. Empirically,{' '}
          <em>both</em> regimes matter — early training is NTK-like, later training diverges
          into feature-learning territory. <strong>NTK-based architecture search</strong>
          (Chen et al., Zico) uses kernel alignment as a training-free proxy for final
          accuracy. Infinite width is a mathematical microscope, not a computational target.
        </Practice>
      </div>
    </LessonShell>
  );
}
