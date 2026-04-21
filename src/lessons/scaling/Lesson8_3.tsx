import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import WignerViz from '../../viz/2d/WignerViz';

export default function Lesson8_3() {
  return (
    <LessonShell lessonId="scaling-8-3">
      <div className="space-y-6">
        <P>
          Fill a large symmetric matrix with i.i.d. random numbers. Shake hard. Open the
          envelope: the eigenvalues do not spread uniformly, do not bunch into delta functions,
          but arrange themselves along a perfect semicircle. This is Wigner's miracle — a
          statement so robust it holds for any distribution with finite second moment. It is the
          entry point to random matrix theory and tells us what "generic" linear coupling looks
          like at scale.
        </P>

        <Def title="Wigner ensemble">
          A <em>Wigner matrix</em> is an <InlineMath math="n \times n" /> symmetric matrix{' '}
          <InlineMath math="M" /> with entries <InlineMath math="M_{ij}" /> (<InlineMath math="i \le j" />){' '}
          i.i.d. with mean 0 and variance <InlineMath math="\sigma^2 / n" />. The ensemble
          <BlockMath math="\mathrm{GOE}: M = (A + A^\top) / \sqrt{2}, \quad A_{ij} \sim \mathcal{N}(0, 1/n)" />
          is the canonical real-symmetric version (orthogonally invariant).
        </Def>

        <Thm
          title="Wigner's semicircle law"
          proof={
            <>
              Compute the <InlineMath math="k" />-th moment of the empirical spectral
              distribution as <InlineMath math="(1/n)\,\mathrm{tr}(M^k)" />. This counts closed
              walks of length <InlineMath math="k" />; by symmetry only walks that traverse each
              edge an even number of times survive in expectation — these are in bijection with
              Dyck paths, whose number is the Catalan number{' '}
              <InlineMath math="C_{k/2}" />. Catalan numbers are the moments of the semicircle.
            </>
          }
        >
          As <InlineMath math="n \to \infty" />, the empirical spectral density of a Wigner
          matrix converges weakly to
          <BlockMath math="\rho_{\mathrm{sc}}(\lambda) = \frac{1}{2\pi \sigma^2} \sqrt{4\sigma^2 - \lambda^2} \mathbf{1}_{|\lambda| \le 2\sigma}." />
          The spectrum is supported on <InlineMath math="[-2\sigma, 2\sigma]" /> with
          semicircular density — independent of the underlying entry distribution
          (universality).
        </Thm>

        <div className="py-2"><WignerViz /></div>

        <Def title="Edge eigenvalues and Tracy–Widom">
          The largest eigenvalue <InlineMath math="\lambda_{\max}" /> sits at{' '}
          <InlineMath math="2\sigma" /> with fluctuations of size{' '}
          <InlineMath math="n^{-2/3}" /> governed by the Tracy–Widom{' '}
          <InlineMath math="F_1" /> law — NOT Gaussian, NOT exponential. This is the analog of
          CLT for extreme eigenvalues and controls whether large networks are stable or
          marginally unstable.
        </Def>

        <Thm title="Spectral radius bound">
          For a Wigner matrix with subgaussian entries,{' '}
          <BlockMath math="\|M\|_{\mathrm{op}} = \lambda_{\max}(M) \le 2\sigma + o(1) \text{ w.h.p.}" />
          so its singular values are uniformly bounded. This is what keeps deep-network signal
          propagation finite at large width.
        </Thm>

        <Practice>
          <strong>Xavier/He initialization</strong>{' '}
          (<InlineMath math="W_{ij} \sim \mathcal{N}(0, 2/n)" />) is a Wigner-preserving choice:
          the forward-pass Jacobian at each layer is a random matrix whose spectral radius
          concentrates at 1, keeping the signal neither exploding nor vanishing. This is the
          <em>edge of stability</em>. <strong>Dynamical isometry</strong> (Pennington, Schoenholz,
          Ganguli, 2017) asks for matrices whose singular values are all {'≈'} 1 (not just the
          top one) — achievable with orthogonal init, not Gaussian. Modern transformers pay for
          this with LayerNorm, not initialization.
        </Practice>
      </div>
    </LessonShell>
  );
}
