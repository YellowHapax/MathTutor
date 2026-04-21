import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import FourierViz from '../../viz/2d/FourierViz';

export default function Lesson6_2() {
  return (
    <LessonShell lessonId="signal-6-2">
      <div className="space-y-6">
        <P>
          The Fourier transform is the change of basis between time and frequency. On a Hilbert
          space, it is the unique unitary operator that diagonalizes translation. Every signal is a
          weighted sum of rotations; every rotation answers to a single frequency.
        </P>

        <Def title="Fourier transform">
          For <InlineMath math="f \in L^1(\mathbb{R})" />,
          <BlockMath math="\hat{f}(\xi) = \int_{\mathbb{R}} f(x) e^{-2\pi i \xi x}\, dx." />
          It extends uniquely to a unitary operator on <InlineMath math="L^2(\mathbb{R})" />{' '}
          (Plancherel).
        </Def>

        <Thm
          title="Plancherel Identity"
          proof={
            <>
              Polarize <InlineMath math="\|f\|_2^2 = \|\hat f\|_2^2" /> from the isometry of{' '}
              <InlineMath math="\mathcal{F}" /> on a dense subspace (Schwartz functions), then extend
              by density.
            </>
          }
        >
          <InlineMath math="\mathcal{F} : L^2(\mathbb{R}) \to L^2(\mathbb{R})" /> is unitary:
          <BlockMath math="\langle f, g \rangle = \langle \hat f, \hat g \rangle, \qquad \|f\|_2 = \|\hat f\|_2." />
        </Thm>

        <div className="py-2"><FourierViz /></div>

        <Thm title="Translation ↔ Modulation">
          If <InlineMath math="f_a(x) = f(x - a)" />, then <InlineMath math="\hat{f_a}(\xi) = e^{-2\pi i a \xi} \hat{f}(\xi)" />.
          Spatial translation becomes pointwise phase multiplication in frequency space.
        </Thm>

        <P>
          Translation invariance of a linear operator is equivalent to being diagonal in the Fourier
          basis. This is why convolution{' '}
          <InlineMath math="(f * g)(x) = \int f(y) g(x-y) dy" /> factorizes under Fourier:{' '}
          <InlineMath math="\widehat{f * g} = \hat f \cdot \hat g" />. Every translation-equivariant
          layer — convolutions, periodic signals, RoPE positions — lives here.
        </P>

        <Practice>
          Sinusoidal position embeddings <InlineMath math="\text{PE}(p, 2i) = \sin(p / 10000^{2i/d})" />{' '}
          from the original Transformer paper are explicit Fourier features: they assign each
          dimension a different frequency. RoPE (next lesson) is the <em>multiplicative</em> version,
          entangling query and key phases. Fourier features with Gaussian-random frequencies (Tancik et al.
          2020) let MLPs represent high-frequency functions — the cure for spectral bias.
        </Practice>
      </div>
    </LessonShell>
  );
}
