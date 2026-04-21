import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import ConcentrationViz from '../../viz/2d/ConcentrationViz';

export default function Lesson9_4() {
  return (
    <LessonShell lessonId="llminfra-9-4">
      <div className="space-y-6">
        <P>
          Intuition built in three dimensions lies to us about a thousand. In high dimensions,
          random vectors concentrate: nearly all their mass lives in a thin equatorial shell, any
          smooth function of them barely varies, and "surprise" becomes rare by default. This
          isn't a technicality — measure concentration is why neural networks are robust at all,
          why dropout regularizes, why random initialization produces near-constant outputs, and
          why LLM embeddings with thousands of dimensions can be meaningful rather than noise.
        </P>

        <Def title="Concentration of Lipschitz functions on the sphere">
          Let <InlineMath math="f : S^{n-1} \to \mathbb{R}" /> be <InlineMath math="L" />-Lipschitz.
          For <InlineMath math="X" /> uniform on <InlineMath math="S^{n-1}" />, Lévy's
          isoperimetric inequality gives
          <BlockMath math="\Pr\!\big(|f(X) - \mathbb{E} f(X)| \ge t\big) \le 2 \exp\!\left(-\frac{n t^2}{2 L^2}\right)." />
          The fluctuations of <InlineMath math="f" /> around its mean shrink exponentially in the
          dimension.
        </Def>

        <Thm
          title="Gaussian concentration"
          proof={
            <>
              Use log-Sobolev (Gross, 1975): for <InlineMath math="X \sim \mathcal{N}(0, I_n)" />
              {' '}and <InlineMath math="L" />-Lipschitz <InlineMath math="f" />,
              entropy–variance control gives subgaussian tails with variance proxy{' '}
              <InlineMath math="L^2" /> — a dimension-free statement. Lévy's bound on the sphere
              follows by projection.
            </>
          }
        >
          For <InlineMath math="X \sim \mathcal{N}(0, I_n)" /> and <InlineMath math="L" />-Lipschitz{' '}
          <InlineMath math="f" />,
          <BlockMath math="\Pr\!\big(|f(X) - \mathbb{E} f(X)| \ge t\big) \le 2 \exp\!\left(-\frac{t^2}{2 L^2}\right)." />
          Note this has NO <InlineMath math="n" /> in the denominator inside the exponent —
          Gaussian concentration is dimension-free (at fixed Lipschitz norm).
        </Thm>

        <div className="py-2"><ConcentrationViz /></div>

        <Def title="Equatorial concentration">
          On <InlineMath math="S^{n-1}" />, for any fixed unit vector{' '}
          <InlineMath math="u" />, the inner product <InlineMath math="\langle X, u \rangle" />
          {' '}has variance <InlineMath math="1/n" /> — vanishing. Almost all surface area of a
          high-dim sphere lies near any great circle. This is the "equator paradox" and is why
          random projections preserve distances (Johnson–Lindenstrauss).
        </Def>

        <Thm title="Johnson–Lindenstrauss lemma">
          For <InlineMath math="m = O(\varepsilon^{-2} \log N)" />, a random linear map{' '}
          <InlineMath math="\mathbb{R}^n \to \mathbb{R}^m" /> preserves pairwise distances among
          <InlineMath math="N" /> fixed points up to factor <InlineMath math="1 \pm \varepsilon" />{' '}
          w.h.p. The target dim depends only logarithmically on <InlineMath math="N" /> and not
          at all on the source dim <InlineMath math="n" />.
        </Thm>

        <Practice>
          <strong>Why embeddings work</strong>: meaningful geometry survives projection into a
          much smaller dimension — BERT-768 and Llama-4096 are JL-compressed faithful
          representations of many-billion-concept spaces. <strong>Dropout</strong> injects
          coordinate-wise noise on high-dim hidden states; measure concentration means the
          forward pass is robust to this. <strong>Random init</strong> of wide layers produces
          outputs concentrated near the mean — no individual weight matters until training
          breaks the symmetry. <strong>Catastrophic forgetting vs. task vectors</strong>:
          Lipschitz functions of concentrated embeddings are predictable, which is why subtask
          fine-tuning generalizes. <strong>Adversarial examples</strong> exploit the
          <em>other</em> half — directions where Lipschitzness is violated — and those
          directions exist precisely because ReLU nets are NOT uniformly Lipschitz.
        </Practice>
      </div>
    </LessonShell>
  );
}
