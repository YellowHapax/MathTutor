import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import SinkhornViz from '../../viz/2d/SinkhornViz';

export default function Lesson7_6() {
  return (
    <LessonShell lessonId="infogeo-7-6">
      <div className="space-y-6">
        <P>
          Exact optimal transport is a linear program with <InlineMath math="n^2" /> variables
          and two <InlineMath math="n" />-dimensional marginal constraints — beautiful, but
          <InlineMath math="O(n^3 \log n)" /> and non-differentiable at the optimum. In 2013
          Cuturi showed that one small change — a pinch of entropy — turns the problem into
          matrix scaling: a parallel, GPU-friendly iteration that converges linearly and makes
          the OT cost smoothly differentiable in the inputs. Sinkhorn is how OT became a layer.
        </P>

        <Def title="Entropy-regularized transport">
          For a cost matrix <InlineMath math="C \in \mathbb{R}^{n \times m}" /> and marginals{' '}
          <InlineMath math="a \in \Delta^n, b \in \Delta^m" />,
          <BlockMath math="\mathcal{T}_\varepsilon(a, b) = \min_{P \in \Pi(a, b)} \langle P, C \rangle - \varepsilon H(P)" />
          where <InlineMath math="H(P) = -\sum_{ij} P_{ij} (\log P_{ij} - 1)" /> is the Shannon
          entropy of the plan. As <InlineMath math="\varepsilon \downarrow 0" /> the classical
          OT solution is recovered; as <InlineMath math="\varepsilon \uparrow \infty" /> the
          optimum is the independent coupling <InlineMath math="a b^\top" />.
        </Def>

        <Thm
          title="Sinkhorn's theorem (matrix scaling form)"
          proof={
            <>
              First-order conditions of the regularized Lagrangian give{' '}
              <InlineMath math="P_{ij} = u_i K_{ij} v_j" /> with{' '}
              <InlineMath math="K = e^{-C/\varepsilon}" />. Enforcing marginals yields two
              fixed-point equations; alternating projection in KL geometry is Sinkhorn–Knopp,
              which contracts in the Hilbert projective metric (Franklin–Lorenz, 1989).
              Convergence is linear with rate depending on{' '}
              <InlineMath math="\min_{ij} K_{ij}" />.
            </>
          }
        >
          The unique minimizer has the form
          <BlockMath math="P^\star = \mathrm{diag}(u)\, K\, \mathrm{diag}(v), \qquad K_{ij} = e^{-C_{ij}/\varepsilon}," />
          where scaling vectors <InlineMath math="u, v" /> are found by alternating the updates
          <BlockMath math="u \leftarrow a \oslash (K v), \qquad v \leftarrow b \oslash (K^\top u)." />
          Each half-step is an <InlineMath math="O(nm)" /> matrix-vector product — embarrassingly
          parallel, fully differentiable.
        </Thm>

        <div className="py-2"><SinkhornViz /></div>

        <Def title="Sinkhorn divergence">
          The regularized cost <InlineMath math="\mathcal{T}_\varepsilon(a, b)" /> is biased: it
          is not zero when <InlineMath math="a = b" />. The debiased{' '}
          <em>Sinkhorn divergence</em>{' '}
          <BlockMath math="S_\varepsilon(a, b) = \mathcal{T}_\varepsilon(a, b) - \tfrac{1}{2}\mathcal{T}_\varepsilon(a, a) - \tfrac{1}{2}\mathcal{T}_\varepsilon(b, b)" />
          interpolates between OT (<InlineMath math="\varepsilon \to 0" />) and Maximum Mean
          Discrepancy (<InlineMath math="\varepsilon \to \infty" />), and is positive, convex,
          and metrizes weak convergence.
        </Def>

        <Thm title="Softmax is 1D Sinkhorn">
          With a single row marginal and uniform column marginal, one Sinkhorn half-iteration is
          exactly <InlineMath math="\mathrm{softmax}(-C / \varepsilon)" />. Temperature IS the
          regularization parameter; attention is one Sinkhorn sweep.
        </Thm>

        <Practice>
          <strong>Sinkhorn attention</strong> (Niculae, Martins, 2018; Sinkformers, 2021)
          replaces softmax with <InlineMath math="k" /> Sinkhorn iterations to enforce both row
          and column normalization — doubly-stochastic attention that is provably closer to a
          transport plan. <strong>Optimal-transport tokenization</strong> and MoE routing (Shi
          et al., S-BASE) use Sinkhorn to balance load across experts without auxiliary losses.
          <strong>Diffusion model evaluation</strong> uses Sinkhorn divergence as an FID
          alternative on small-sample regimes where the Fréchet assumption fails. Finally, every
          modern OT library — POT, Geomloss, OTT-JAX — ships log-domain stabilized Sinkhorn as
          its default solver.
        </Practice>
      </div>
    </LessonShell>
  );
}
