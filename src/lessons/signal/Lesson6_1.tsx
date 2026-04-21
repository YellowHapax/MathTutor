import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import HilbertViz from '../../viz/2d/HilbertViz';

export default function Lesson6_1() {
  return (
    <LessonShell lessonId="signal-6-1">
      <div className="space-y-6">
        <P>
          Finite-dimensional Euclidean geometry extends, almost verbatim, to infinite-dimensional
          function spaces — <em>provided</em> we add one axiom: completeness. The result is a
          Hilbert space, the natural habitat of Fourier analysis, kernel methods, and the attention
          operator.
        </P>

        <Def title="Hilbert space">
          A real (or complex) vector space <InlineMath math="\mathcal{H}" /> with inner product{' '}
          <InlineMath math="\langle \cdot, \cdot \rangle" /> is a Hilbert space if it is complete in
          the induced norm <InlineMath math="\|x\| = \sqrt{\langle x, x \rangle}" />: every Cauchy
          sequence converges in <InlineMath math="\mathcal{H}" />.
        </Def>

        <P>
          The canonical example is <InlineMath math="L^2(\mathbb{R}) = \{f : \int |f|^2 < \infty\}" />{' '}
          with <InlineMath math="\langle f, g \rangle = \int f \bar g" />. Here functions are{' '}
          <em>vectors</em>; the sine functions <InlineMath math="\{e^{ik\theta}\}" /> form an
          orthonormal basis on <InlineMath math="L^2(S^1)" />; and every function can be written as
          a (generalized) sum of basis elements.
        </P>

        <Thm
          title="Orthogonal Projection"
          proof={
            <>
              Uniqueness: if <InlineMath math="y_1, y_2" /> both realize the infimum, parallelogram law
              gives <InlineMath math="\|y_1 - y_2\|^2 \le 0" />. Existence: take a minimizing
              sequence; the parallelogram law shows it is Cauchy, hence converges by completeness.
              Orthogonality follows from first-order optimality: for any <InlineMath math="v \in V" />,
              <InlineMath math="t \mapsto \|x - y - tv\|^2" /> is minimized at 0, forcing{' '}
              <InlineMath math="\langle x - y, v \rangle = 0" />.
            </>
          }
        >
          Let <InlineMath math="V \subseteq \mathcal{H}" /> be a closed subspace. For every{' '}
          <InlineMath math="x \in \mathcal{H}" /> there is a unique{' '}
          <InlineMath math="y = P_V x \in V" /> with{' '}
          <InlineMath math="\|x - y\| = \inf_{v \in V} \|x - v\|" />, and{' '}
          <InlineMath math="(x - P_V x) \perp V" />.
        </Thm>

        <div className="py-2"><HilbertViz /></div>

        <Thm title="Riesz Representation">
          Every continuous linear functional <InlineMath math="\ell : \mathcal{H} \to \mathbb{R}" />{' '}
          has a unique representer <InlineMath math="r_\ell \in \mathcal{H}" /> such that{' '}
          <InlineMath math="\ell(x) = \langle x, r_\ell \rangle" />.
        </Thm>

        <Practice>
          Token embeddings live in a Hilbert space{' '}
          <InlineMath math="\mathbb{R}^d" />. Cosine similarity is the normalized inner product;
          attention is the projection operator{' '}
          <InlineMath math="P_V : \{k_1, \dots, k_n\} \mapsto \text{softmax}(QK^\top/\sqrt d) V" />{' '}
          onto the span of the value vectors, with softmax providing a soft partition of unity.
          RKHS theory (next lessons) makes the "kernel = inner product" identification precise.
        </Practice>
      </div>
    </LessonShell>
  );
}
