import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import GaussianProcessViz from '../../viz/2d/GaussianProcessViz';

export default function Lesson6_5() {
  return (
    <LessonShell lessonId="signal-6-5">
      <div className="space-y-6">
        <P>
          A Gaussian Process is a distribution over functions — the limit of a Bayesian linear
          regression with ever-more-features. It is both a principled uncertainty quantifier and
          (remarkably) an exact description of infinitely-wide neural networks.
        </P>

        <Def title="Gaussian Process">
          A collection of random variables <InlineMath math="\{f(x) : x \in \mathcal{X}\}" /> is a
          Gaussian Process with mean <InlineMath math="m" /> and covariance kernel{' '}
          <InlineMath math="k" /> if every finite subcollection{' '}
          <InlineMath math="(f(x_1), \dots, f(x_n))" /> is jointly Gaussian with mean{' '}
          <InlineMath math="[m(x_i)]" /> and covariance <InlineMath math="[k(x_i, x_j)]" />.
        </Def>

        <Thm
          title="GP Regression Posterior"
          proof={
            <>
              Condition the joint Gaussian over <InlineMath math="(f(x_*), y)" /> on{' '}
              <InlineMath math="y" /> using the standard formula for conditional Gaussians.
            </>
          }
        >
          For observations <InlineMath math="y = f(X) + \varepsilon" /> with{' '}
          <InlineMath math="\varepsilon \sim \mathcal{N}(0, \sigma^2 I)" /> and a zero-mean GP prior,
          the posterior at a test point <InlineMath math="x_*" /> is Gaussian with
          <BlockMath math="\mu(x_*) = k(x_*, X)\,[K(X,X) + \sigma^2 I]^{-1} y," />
          <BlockMath math="\sigma^2(x_*) = k(x_*, x_*) - k(x_*, X)\,[K(X,X) + \sigma^2 I]^{-1}\,k(X, x_*)." />
        </Thm>

        <div className="py-2"><GaussianProcessViz /></div>

        <P>
          The posterior mean is exactly the regularized kernel regressor from the Representer
          Theorem. The posterior variance quantifies epistemic uncertainty: large where data is
          sparse, small near observations. This is genuine Bayesian uncertainty, not a calibration
          heuristic.
        </P>

        <Thm title="Neal (1994) / Lee et al. (2018) — The NN-GP Correspondence">
          A single-hidden-layer neural network with iid weight prior,{' '}
          <InlineMath math="\mathcal{N}(0, \sigma_w^2 / H)" /> weights and width{' '}
          <InlineMath math="H \to \infty" />, induces a GP prior on the function{' '}
          <InlineMath math="x \mapsto f(x)" /> with kernel
          <BlockMath math="k(x, x') = \sigma_w^2\, \mathbb{E}_{w \sim \mathcal{N}(0, I)} [\phi(w^\top x)\,\phi(w^\top x')] + \sigma_b^2." />
          For ReLU, this has a closed form (Cho &amp; Saul arc-cosine kernel). Deep versions give
          recursive compositions of these kernels.
        </Thm>

        <Practice>
          Under gradient flow, an infinite-width network trained with MSE loss moves as if it were
          doing exact GP posterior inference with the Neural Tangent Kernel (Track 8 Lesson 6).
          This is why large networks are so stable: they are approximately kernel machines.
          Finite-width deviations from NTK-GP behavior <em>are</em> where feature learning happens —
          the entire μP / Tensor Programs line of research quantifies this gap.
        </Practice>
      </div>
    </LessonShell>
  );
}
