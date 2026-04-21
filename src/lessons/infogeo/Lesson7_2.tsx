import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import FisherViz from '../../viz/2d/FisherViz';

export default function Lesson7_2() {
  return (
    <LessonShell lessonId="infogeo-7-2">
      <div className="space-y-6">
        <P>
          A metric on a statistical manifold must be invariant under reparameterization — changing
          coordinates shouldn't change what's actually measured. Čencov (1982) proved there is,
          up to scale, a <em>unique</em> such metric: the Fisher information.
        </P>

        <Def title="Fisher information metric">
          <BlockMath math="g_{ij}(\theta) = \mathbb{E}_{p_\theta}\!\Big[\,\partial_i \log p_\theta(X) \cdot \partial_j \log p_\theta(X)\,\Big]" />
          Equivalently <InlineMath math="g_{ij} = -\mathbb{E}[\partial_i \partial_j \log p_\theta]" />{' '}
          (regularity). This defines a Riemannian metric on <InlineMath math="\Theta" />.
        </Def>

        <Thm
          title="Čencov Uniqueness"
          proof={
            <>
              Any metric on the simplex that is invariant under Markov morphisms (sufficient
              statistics should not change geometry) must be a constant multiple of the Fisher
              metric. The proof uses a clever symmetric group action and the fact that the Fisher
              metric is the unique fixed point up to scale.
            </>
          }
        >
          On the simplex <InlineMath math="\Delta^{n-1}" />, the Fisher metric{' '}
          <InlineMath math="g_{ij} = \delta_{ij}/p_i" /> is the unique Riemannian metric (up to
          constant scaling) invariant under sufficient statistics.
        </Thm>

        <div className="py-2"><FisherViz /></div>

        <Thm title="Cramér–Rao Bound">
          For any unbiased estimator <InlineMath math="\hat\theta" /> of <InlineMath math="\theta" />:
          <BlockMath math="\mathrm{Cov}(\hat\theta) \succeq I(\theta)^{-1}" />
          The inverse Fisher is the fundamental lower bound on estimator variance. In the large-n
          limit, the MLE achieves it.
        </Thm>

        <P>
          Geometrically, the Fisher unit ball is the set of directions{' '}
          <InlineMath math="d\theta" /> that take you one KL-bit away from{' '}
          <InlineMath math="\theta" />:{' '}
          <InlineMath math="\mathrm{KL}(p_\theta \| p_{\theta + d\theta}) \approx \tfrac12 d\theta^\top I(\theta) d\theta" />.
          Steeper Fisher = smaller unit ball = more sensitive parameter = harder to estimate.
        </P>

        <Practice>
          Fisher information drives:{' '}
          <strong>natural gradient</strong> <InlineMath math="\tilde \nabla = F^{-1} \nabla" />{' '}
          (next lesson), <strong>Elastic Weight Consolidation</strong> for continual learning
          (penalize changes weighted by Fisher), <strong>K-FAC / Shampoo</strong> second-order
          optimizers (block-diagonal Fisher approximations), <strong>TRPO / PPO</strong> policy
          gradients (Fisher-bound KL trust regions), and <strong>Laplace approximation</strong> of
          Bayesian posteriors.
        </Practice>
      </div>
    </LessonShell>
  );
}
