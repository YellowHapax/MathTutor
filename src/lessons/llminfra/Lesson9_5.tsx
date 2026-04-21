import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import TropicalViz from '../../viz/2d/TropicalViz';

export default function Lesson9_5() {
  return (
    <LessonShell lessonId="llminfra-9-5">
      <div className="space-y-6">
        <P>
          A ReLU network is piecewise-linear. Input space is carved into polyhedral cells, and
          on each cell the network is an affine function; the cells are glued along
          codimension-one breakpoints where some neuron switches on or off. This is algebraic
          geometry over the <em>tropical semiring</em>{' '}
          <InlineMath math="(\mathbb{R} \cup \{-\infty\}, \max, +)" /> — and it gives the
          sharpest known bounds on how expressive a ReLU network can be as a function of depth
          and width.
        </P>

        <Def title="Tropical semiring">
          Addition is max, multiplication is ordinary addition:
          <BlockMath math="a \oplus b = \max(a, b), \qquad a \otimes b = a + b." />
          A tropical polynomial <InlineMath math="f(x) = \max_i (a_i \cdot x + b_i)" /> is a
          max of affine functions — i.e., a convex piecewise-linear function. Tropical geometry
          studies the zero-set and Newton polytopes of such polynomials.
        </Def>

        <Thm
          title="ReLU networks are tropical rational maps"
          proof={
            <>
              <InlineMath math="\max(0, x) = \max(0, x)" /> is tropical addition of{' '}
              <InlineMath math="0" /> and <InlineMath math="x" />; linear layers are tropical
              multiplication by a matrix of constants; subtractions (via negative weights)
              introduce tropical division. Composing yields rational expressions in the tropical
              algebra (Zhang, Naitzat, Lim, 2018).
            </>
          }
        >
          A ReLU feedforward net is a <em>tropical rational function</em>: a ratio (in the
          tropical sense) of two tropical polynomials. The output is piecewise-linear in the
          input, with number of linear pieces bounded by the product of tropical polynomials'
          number of "monomials."
        </Thm>

        <div className="py-2"><TropicalViz /></div>

        <Def title="Linear-region count">
          Let <InlineMath math="R_L(n_0, n_1, \ldots, n_L)" /> be the maximum number of linear
          regions of a depth-<InlineMath math="L" /> ReLU net with layer widths{' '}
          <InlineMath math="n_\ell" />. Montúfar et al. (2014) proved
          <BlockMath math="R_L \le \prod_{\ell=1}^L \sum_{j=0}^{n_0} \binom{n_\ell}{j} \le \binom{n}{n_0}^L" />
          for <InlineMath math="n_0 \le n_\ell = n" />. Depth gives exponential gain; width gives
          polynomial gain. This is the theoretical justification for "deep matters."
        </Def>

        <Thm title="Expressivity via region counting">
          A function <InlineMath math="g" /> that requires <InlineMath math="R" /> linear regions
          to represent cannot be approximated to accuracy <InlineMath math="\varepsilon" /> by a
          ReLU net with fewer than <InlineMath math="\Omega(R)" /> regions. Since depth grows
          regions exponentially faster than width, shallow networks need exponentially many
          parameters to match deep ones — the "depth vs. width" trade-off is a tropical
          combinatorics result.
        </Thm>

        <Practice>
          <strong>ReLU-only MLPs</strong> are exactly tropical rational. <strong>GELU /
          SwiGLU</strong> activations break strict piecewise-linearity but are well-approximated
          by tropical rationals; their region counts are an upper bound on effective expressivity.
          <strong>Pruning</strong> (lottery ticket, structured sparsity) can be analyzed by
          counting which linear regions get collapsed when weights are zeroed.{' '}
          <strong>Mixture of Experts</strong> is itself a tropical piecewise construction at the
          architecture level: the routed expert is a <InlineMath math="\max" /> over expert
          logits, combined with that expert's forward pass. <strong>Neural architecture
          search</strong> via region count (Hanin & Rolnick, 2019) — a training-free proxy for
          expressivity — is grounded in this tropical framework.
        </Practice>
      </div>
    </LessonShell>
  );
}
