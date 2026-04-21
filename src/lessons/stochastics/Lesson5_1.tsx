import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import FiltrationViz from '../../viz/2d/FiltrationViz';

export default function Lesson5_1() {
  return (
    <LessonShell lessonId="stochastics-5-1">
      <div className="space-y-6">
        <P>
          Randomness is not a single object. It is <em>indexed</em>. At every moment in time you
          possess different information — and the mathematical object that records "what you could
          possibly know at time <InlineMath math="t" />" is a <strong>σ-algebra</strong>. A family of
          these growing with <InlineMath math="t" /> is called a <strong>filtration</strong>.
        </P>

        <Def title="σ-algebra">
          A σ-algebra <InlineMath math="\mathcal{F}" /> on a set <InlineMath math="\Omega" /> is a
          collection of subsets closed under complement and countable union, containing{' '}
          <InlineMath math="\emptyset" />. Events in <InlineMath math="\mathcal{F}" /> are the
          <em> measurable</em> ones — the questions you can ask.
        </Def>

        <Def title="Filtration">
          A filtration <InlineMath math="(\mathcal{F}_t)_{t \ge 0}" /> on{' '}
          <InlineMath math="(\Omega, \mathcal{F}, \mathbb{P})" /> is a family with{' '}
          <InlineMath math="\mathcal{F}_s \subseteq \mathcal{F}_t \subseteq \mathcal{F}" /> whenever{' '}
          <InlineMath math="s \le t" />. A stochastic process{' '}
          <InlineMath math="X_t" /> is <strong>adapted</strong> to{' '}
          <InlineMath math="(\mathcal{F}_t)" /> if each <InlineMath math="X_t" /> is{' '}
          <InlineMath math="\mathcal{F}_t" />-measurable: its value at time{' '}
          <InlineMath math="t" /> is a known function of the past.
        </Def>

        <P>
          The natural filtration of a process <InlineMath math="X" /> is{' '}
          <InlineMath math="\mathcal{F}_t^X = \sigma(X_s : s \le t)" /> — the smallest σ-algebra
          making all earlier values measurable. It is the minimum information needed to track{' '}
          <InlineMath math="X" />.
        </P>

        <div className="py-2"><FiltrationViz /></div>

        <Thm
          title="Doob–Dynkin Lemma"
          proof={
            <>
              Follows from the fact that <InlineMath math="Y" /> is <InlineMath math="\mathcal{F}_t^X" />-measurable iff
              the preimage of every Borel set is in <InlineMath math="\sigma(X_{\le t})" />, and any such preimage
              is expressible in terms of <InlineMath math="X_s" /> for <InlineMath math="s \le t" /> by a
              countable approximation argument.
            </>
          }
        >
          If <InlineMath math="Y" /> is <InlineMath math="\mathcal{F}_t^X" />-measurable, then there
          exists a measurable <InlineMath math="g" /> such that{' '}
          <InlineMath math="Y = g(X_s : s \le t)" />. "Knowable at time{' '}
          <InlineMath math="t" />" literally means "a function of the history up to{' '}
          <InlineMath math="t" />."
        </Thm>

        <P>
          Conditional expectation is the projection tool associated with filtrations:{' '}
          <InlineMath math="\mathbb{E}[X \mid \mathcal{F}_t]" /> is the best{' '}
          <InlineMath math="\mathcal{F}_t" />-measurable predictor of <InlineMath math="X" />{' '}
          in <InlineMath math="L^2" />. This single operator powers nearly all of stochastic
          filtering.
        </P>

        <BlockMath math="\mathbb{E}[X \mid \mathcal{F}_t] = \text{argmin}_{Y \in L^2(\mathcal{F}_t)} \; \mathbb{E}[(X - Y)^2]" />

        <Practice>
          Causal masking in a decoder transformer is a discrete filtration:{' '}
          <InlineMath math="\mathcal{F}_t = \sigma(x_1, \dots, x_t)" />. The attention mask{' '}
          <InlineMath math="M_{ij} = -\infty \text{ if } j > i" /> enforces{' '}
          <InlineMath math="\mathcal{F}_i" />-measurability of the output at position{' '}
          <InlineMath math="i" />. An autoregressive LLM is a stochastic process adapted to its own
          generation filtration.
        </Practice>
      </div>
    </LessonShell>
  );
}
