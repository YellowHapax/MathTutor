import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import ExpFamilyViz from '../../viz/2d/ExpFamilyViz';

export default function Lesson7_4() {
  return (
    <LessonShell lessonId="infogeo-7-4">
      <div className="space-y-6">
        <P>
          Exponential families are the "flat" coordinates of information geometry. Gaussians,
          categoricals, Poissons, exponentials, Dirichlet, Wishart — a vast zoo share one unified
          algebraic form. Softmax classifiers are literally their parameterization.
        </P>

        <Def title="Exponential family">
          <BlockMath math="p(x \mid \theta) = h(x) \exp\!\big(\theta^\top T(x) - A(\theta)\big)" />
          where <InlineMath math="T(x)" /> is the sufficient statistic, <InlineMath math="\theta" />{' '}
          is the natural parameter, <InlineMath math="h" /> is a base measure, and the{' '}
          <em>log-partition</em> <InlineMath math="A(\theta) = \log \int h(x) e^{\theta^\top T(x)} dx" />{' '}
          normalizes.
        </Def>

        <Thm
          title="Log-Partition is Convex"
          proof={
            <>
              Differentiate under the integral:{' '}
              <InlineMath math="\nabla A(\theta) = \mathbb{E}_\theta[T(X)]" />,{' '}
              <InlineMath math="\nabla^2 A(\theta) = \mathrm{Cov}_\theta[T(X)] \succeq 0" />. A PSD
              Hessian means <InlineMath math="A" /> is convex; the Fisher info equals the Hessian.
            </>
          }
        >
          <InlineMath math="A(\theta)" /> is convex in <InlineMath math="\theta" />. Its gradient
          and Hessian satisfy
          <BlockMath math="\nabla A(\theta) = \mathbb{E}_\theta[T(X)] =: \eta, \quad \nabla^2 A(\theta) = \mathrm{Cov}_\theta[T(X)] = I(\theta)." />
          The Fisher information <em>is</em> the Hessian of the log-partition.
        </Thm>

        <Def title="Mean parameters (dual coordinates)">
          The Legendre dual <InlineMath math="A^*(\eta) = \sup_\theta(\eta^\top \theta - A(\theta))" />{' '}
          is convex; its domain is the convex hull of possible{' '}
          <InlineMath math="T(x)" /> values. The pair <InlineMath math="(\theta, \eta)" /> is{' '}
          <em>dually coupled</em> via <InlineMath math="\eta = \nabla A(\theta)" />,{' '}
          <InlineMath math="\theta = \nabla A^*(\eta)" />.
        </Def>

        <div className="py-2"><ExpFamilyViz /></div>

        <Thm title="KL = Bregman divergence of A">
          For two exponential-family members with natural parameters{' '}
          <InlineMath math="\theta_1, \theta_2" />:
          <BlockMath math="D(p_{\theta_1} \| p_{\theta_2}) = A(\theta_2) - A(\theta_1) - (\theta_2 - \theta_1)^\top \nabla A(\theta_1)." />
          This is the Bregman divergence of the convex function <InlineMath math="A" />.
          Cross-entropy loss is this formula for the categorical family.
        </Thm>

        <Practice>
          <strong>Softmax = natural-mean duality</strong>: logits are{' '}
          <InlineMath math="\theta" />, probabilities are{' '}
          <InlineMath math="\eta = \nabla A(\theta)" />. Cross-entropy loss is a Bregman divergence.
          Mixture-of-Experts gating IS a conditional exponential family. Contrastive learning (InfoNCE,
          SimCLR) can be derived as MLE on a conditional exp-fam with log-partition approximated via
          negative samples. Noise-contrastive estimation (NCE) escapes the partition function the
          same way.
        </Practice>
      </div>
    </LessonShell>
  );
}
