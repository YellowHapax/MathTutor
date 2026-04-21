import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import PowerLawViz from '../../viz/2d/PowerLawViz';

export default function Lesson8_2() {
  return (
    <LessonShell lessonId="scaling-8-2">
      <div className="space-y-6">
        <P>
          The Central Limit Theorem is a seductive story: add enough independent things, get a
          Gaussian. But it assumes finite variance. Drop that assumption — admit that some
          events are hundreds or thousands of times larger than typical — and the limiting
          distributions change entirely. In finance, earthquakes, token frequencies, and the
          magnitudes of perturbations on a living mind, the variance is infinite. You need
          power laws and Lévy-stable distributions instead of bells.
        </P>

        <Def title="Power-law tail">
          A distribution with density <InlineMath math="p(x) \sim C x^{-\alpha}" /> as{' '}
          <InlineMath math="x \to \infty" /> has <em>tail exponent</em>{' '}
          <InlineMath math="\alpha" />. The <InlineMath math="k" />-th moment{' '}
          <InlineMath math="\mathbb{E}[X^k]" /> is finite iff{' '}
          <InlineMath math="\alpha > k + 1" />. Variance diverges for{' '}
          <InlineMath math="\alpha \le 3" />; mean diverges for{' '}
          <InlineMath math="\alpha \le 2" /> (one-sided support).
        </Def>

        <Thm
          title="Generalized CLT (Gnedenko–Kolmogorov)"
          proof={
            <>
              Fourier-transform the sum's characteristic function and expand. For finite variance
              only the second moment survives the rescaling, giving a Gaussian characteristic
              function. For infinite variance but a regularly-varying tail of index{' '}
              <InlineMath math="\alpha \in (0, 2)" />, the dominant term is
              <InlineMath math="|t|^\alpha" /> — the characteristic function of an{' '}
              <InlineMath math="\alpha" />-stable law.
            </>
          }
        >
          If <InlineMath math="X_i" /> are i.i.d. with a tail of exponent{' '}
          <InlineMath math="\alpha \in (0, 2]" />, then for some normalization constants{' '}
          <InlineMath math="a_n, b_n" />,
          <BlockMath math="\frac{X_1 + \cdots + X_n - b_n}{a_n} \xrightarrow{d} S_\alpha," />
          where <InlineMath math="S_\alpha" /> is <InlineMath math="\alpha" />-stable. Only{' '}
          <InlineMath math="\alpha = 2" /> gives the Gaussian; for{' '}
          <InlineMath math="\alpha < 2" /> the limit is heavy-tailed and self-similar.
        </Thm>

        <div className="py-2"><PowerLawViz /></div>

        <Def title="Zipf's law and Pareto principle">
          For token frequencies in natural language,{' '}
          <InlineMath math="f(r) \propto r^{-s}" /> with <InlineMath math="s \approx 1" />:
          the <InlineMath math="r" />-th most common word appears with frequency inversely
          proportional to its rank. This is Zipf; the continuous analogue is Pareto.
        </Def>

        <Thm title="Criticality produces power laws">
          Near a second-order phase transition, correlations become scale-free: the correlation
          function <InlineMath math="C(r) \sim r^{-(d - 2 + \eta)}" />. Power laws are the
          fingerprint of a system tuned to (or self-organized at) a critical point. This is why
          neural-network scaling laws look like critical exponents.
        </Thm>

        <Practice>
          The <strong>Kaplan and Chinchilla scaling laws</strong>{' '}
          <InlineMath math="L(N, D) = E + A N^{-\alpha} + B D^{-\beta}" /> are power laws in the
          literal sense. <strong>Token-frequency Zipf</strong> is why LLM embedding layers are
          dominated by a long tail of rare tokens — BPE helps, but does not eliminate, this.
          <strong>Gradient noise scale</strong> (McCandlish et al., 2018) is the ratio of
          per-sample gradient variance to gradient mean-squared; in finite batches it follows a
          power-law curve whose exponent determines the compute-optimal batch size. Modern
          training is power-law engineering.
        </Practice>
      </div>
    </LessonShell>
  );
}
