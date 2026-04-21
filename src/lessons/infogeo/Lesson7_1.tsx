import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import StatManifoldViz from '../../viz/2d/StatManifoldViz';

export default function Lesson7_1() {
  return (
    <LessonShell lessonId="infogeo-7-1">
      <div className="space-y-6">
        <P>
          A parametric family <InlineMath math="\{p_\theta : \theta \in \Theta\}" /> is a geometric
          object: <InlineMath math="\Theta" /> is a manifold, each{' '}
          <InlineMath math="\theta" /> is a chart, and each distribution is a point on that
          manifold. The distance between two distributions is <em>not</em> Euclidean in{' '}
          <InlineMath math="\theta" /> — the correct metric is Fisher, and the geometry it induces
          is genuinely curved.
        </P>

        <Def title="Statistical manifold">
          A smooth manifold <InlineMath math="\mathcal{M}" /> with a bijection{' '}
          <InlineMath math="\theta \mapsto p_\theta" /> to a family of probability distributions
          on a sample space <InlineMath math="\mathcal{X}" />, such that{' '}
          <InlineMath math="\theta \mapsto \log p_\theta(x)" /> is smooth for (almost) every{' '}
          <InlineMath math="x" />.
        </Def>

        <P>
          The canonical example is the Gaussian family parameterized by{' '}
          <InlineMath math="(\mu, \sigma)" /> (or <InlineMath math="(\mu, \log \sigma)" />). The
          resulting 2-manifold is the upper half-plane equipped with the hyperbolic metric — a space
          of <em>negative curvature</em>. Two Gaussians far apart in Fisher distance may be close in{' '}
          <InlineMath math="(\mu, \sigma)" /> coordinates, and vice versa.
        </P>

        <div className="py-2"><StatManifoldViz /></div>

        <Thm
          title="Pythagorean Theorem for KL (Amari)"
          proof={
            <>
              KL = Bregman divergence of the log-partition <InlineMath math="A(\theta)" />. A KL
              analog of Pythagoras holds between dual-flat connections <InlineMath math="\nabla^{(e)}" /> and{' '}
              <InlineMath math="\nabla^{(m)}" />: if <InlineMath math="q" /> lies on the{' '}
              <InlineMath math="e" />-geodesic through <InlineMath math="p_0" /> and{' '}
              <InlineMath math="r" /> lies on the <InlineMath math="m" />-geodesic through{' '}
              <InlineMath math="q" /> meeting orthogonally, then{' '}
              <InlineMath math="D(p\|r) = D(p\|q) + D(q\|r)" />.
            </>
          }
        >
          In exponential-family statistical manifolds with dually-flat connections, orthogonal
          projection obeys a Pythagorean law for KL divergence:
          <BlockMath math="D(p \| r) = D(p \| q) + D(q \| r)" />
          when <InlineMath math="q" /> is the <em>information projection</em> of{' '}
          <InlineMath math="p" /> onto a submanifold containing <InlineMath math="r" />.
        </Thm>

        <P>
          This is the beginning of <strong>information geometry</strong>: distributions form a
          manifold, and the choice of metric/connection turns statistical problems into geometric
          ones. Variational inference, mirror descent, and natural gradient all live here.
        </P>

        <Practice>
          Every softmax output layer maps logits <InlineMath math="z \in \mathbb{R}^{|V|}" /> onto
          the probability simplex — a statistical manifold with its own Fisher geometry. The
          log-likelihood loss is a Bregman divergence on this manifold. Dropout, label smoothing,
          and temperature all edit where on this manifold training lives.
        </Practice>
      </div>
    </LessonShell>
  );
}
