import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import RoPEViz from '../../viz/2d/RoPEViz';

export default function Lesson6_3() {
  return (
    <LessonShell lessonId="signal-6-3">
      <div className="space-y-6">
        <P>
          Classical position embeddings add a fixed vector to each token. RoPE (Su et al. 2021) does
          something geometrically more elegant: it <em>rotates</em> queries and keys in 2D planes
          by position-dependent angles, so that their inner product depends only on relative
          distance. The rest of the transformer sees a translation-equivariant attention.
        </P>

        <Def title="Rotary Position Embedding">
          Split the query/key dimension into pairs{' '}
          <InlineMath math="(x_{2i}, x_{2i+1})" />, treat each as a complex number, and rotate by{' '}
          <InlineMath math="m \theta_i" /> where{' '}
          <InlineMath math="\theta_i = 10000^{-2i/d}" />:
          <BlockMath math="\tilde q_i(m) = R_{m\theta_i}\, q_i, \qquad \tilde k_i(n) = R_{n\theta_i}\, k_i." />
        </Def>

        <Thm
          title="Relative-Position Property"
          proof={
            <>
              Rotations in a plane compose additively in angle:{' '}
              <InlineMath math="R_a^\top R_b = R_{b-a}" />. Hence
              <InlineMath math="\langle R_{m\theta} q, R_{n\theta} k \rangle = q^\top R_{m\theta}^\top R_{n\theta} k = q^\top R_{(n-m)\theta} k" />.
            </>
          }
        >
          The rotated inner product satisfies
          <BlockMath math="\langle \tilde q(m), \tilde k(n) \rangle = q^\top R_{(n-m)\theta} k, " />
          depending on <InlineMath math="m, n" /> <strong>only through</strong>{' '}
          <InlineMath math="n - m" />. Attention is translation-equivariant in position.
        </Thm>

        <div className="py-2"><RoPEViz /></div>

        <P>
          Each 2D pair contributes a different frequency{' '}
          <InlineMath math="\theta_i" />. Small indices <InlineMath math="i" /> rotate slowly
          (encoding coarse position); large indices rotate quickly (fine position). The ensemble is
          a set of Fourier features — the same structure as sinusoidal PE, but multiplicative.
        </P>

        <Thm title="Long-Context Extrapolation (YaRN, NTK-aware scaling)">
          Naively extending RoPE beyond training length degrades rapidly because high-frequency
          pairs wrap around. NTK-aware scaling rescales frequencies{' '}
          <InlineMath math="\theta_i \mapsto \theta_i / s^{2i/d}" /> so the <em>wavelength</em>{' '}
          schedule stretches smoothly. YaRN interpolates between linear position scaling (low freq)
          and no scaling (high freq) based on wavelength crossings.
        </Thm>

        <Practice>
          RoPE is the dominant position encoding in modern open-weight LLMs: Llama 2/3, Mistral,
          Qwen, DeepSeek. Context-window extension from 4k to 128k almost always relies on NTK-aware
          or YaRN rescaling of the RoPE frequencies. The fact that position appears{' '}
          <em>multiplicatively inside the attention kernel</em> — not additively before it — is what
          makes this extrapolation tractable.
        </Practice>
      </div>
    </LessonShell>
  );
}
