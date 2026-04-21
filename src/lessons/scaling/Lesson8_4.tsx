import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import MarchenkoPasturViz from '../../viz/2d/MarchenkoPasturViz';

export default function Lesson8_4() {
  return (
    <LessonShell lessonId="scaling-8-4">
      <div className="space-y-6">
        <P>
          Compute the sample covariance of <InlineMath math="n" /> observations of a{' '}
          <InlineMath math="p" />-dimensional random vector with zero mean and identity
          covariance. The textbook promises you'll recover the identity — but only if{' '}
          <InlineMath math="n \gg p" />. In modern high-dimensional statistics, and in every
          layer of a wide neural network, <InlineMath math="n" /> and <InlineMath math="p" /> are
          comparable. The sample covariance's eigenvalues spread: they form the Marchenko–Pastur
          distribution, whose edges are exactly predictable in terms of{' '}
          <InlineMath math="q = p/n" />.
        </P>

        <Def title="Wishart / sample covariance ensemble">
          Let <InlineMath math="X \in \mathbb{R}^{n \times p}" /> have i.i.d. entries with mean
          0 and variance <InlineMath math="\sigma^2" />. The sample covariance is{' '}
          <InlineMath math="S = \frac{1}{n} X^\top X \in \mathbb{R}^{p \times p}" />. In the
          double-limit <InlineMath math="n, p \to \infty" /> with{' '}
          <InlineMath math="p / n \to q \in (0, 1]" />, the empirical eigenvalue distribution
          has a limit.
        </Def>

        <Thm
          title="Marchenko–Pastur law"
          proof={
            <>
              Use the Stieltjes transform{' '}
              <InlineMath math="m(z) = (1/p)\,\mathrm{tr}((S - z I)^{-1})" /> and derive its
              self-consistent equation <InlineMath math="z m^2 + (z - 1 + q) m + 1 = 0" /> via
              resolvent identities. Inverting the imaginary part recovers the density.
            </>
          }
        >
          The limiting spectral density of <InlineMath math="S" /> is
          <BlockMath math="\rho_{\mathrm{MP}}(\lambda) = \frac{\sqrt{(\lambda_+ - \lambda)(\lambda - \lambda_-)}}{2\pi \sigma^2 q \lambda}, \quad \lambda \in [\lambda_-, \lambda_+]," />
          with edges <InlineMath math="\lambda_\pm = \sigma^2 (1 \pm \sqrt{q})^2" />. At{' '}
          <InlineMath math="q = 1" /> the lower edge hits zero: the bulk touches the origin and
          <InlineMath math="S" /> is almost singular.
        </Thm>

        <div className="py-2"><MarchenkoPasturViz /></div>

        <Def title="BBP transition (spikes)">
          If the true covariance has a few large eigenvalues (spikes) above a critical threshold
          <InlineMath math="\sqrt{q}" />, they "emerge" from the MP bulk and are detectable;
          below the threshold they are buried in noise. This is the{' '}
          <em>Baik–Ben-Arous–Péché phase transition</em> and is the theoretical floor for PCA,
          spiked covariance models, and signal-detection limits in high dimensions.
        </Def>

        <Thm title="PCA cannot see below the BBP threshold">
          For a rank-1 signal of strength <InlineMath math="\theta" /> in noise, the top sample
          eigenvector has nontrivial correlation with the true direction iff{' '}
          <InlineMath math="\theta > \sqrt{q}" />. Below that, you see noise spikes indistinguishable
          from signal — no amount of cleverness in the eigendecomposition can recover it from
          second-order statistics alone.
        </Thm>

        <Practice>
          <strong>Activation covariance</strong> in deep networks at initialization follows the
          MP law with <InlineMath math="q = \text{width in} / \text{width out}" /> — Pennington
          and Worah (2017) showed Gaussian-init ReLU nets have MP-plus-spike spectra. The spikes
          are the learned directions. <strong>Neural Net compression</strong> via SVD truncation
          works because the signal sits as spikes above the MP edge; pruning below the edge is
          provably information-preserving. <strong>Dyson Brownian motion</strong> — the
          evolution of eigenvalues under gradient flow of a random matrix — is the theoretical
          scaffold for analyzing how neural-network Hessians evolve during training.
        </Practice>
      </div>
    </LessonShell>
  );
}
