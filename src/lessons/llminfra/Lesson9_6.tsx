import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import ScalingLawViz from '../../viz/2d/ScalingLawViz';

export default function Lesson9_6() {
  return (
    <LessonShell lessonId="llminfra-9-6">
      <div className="space-y-6">
        <P>
          Kaplan (2020) and Hoffmann et al. (Chinchilla, 2022) empirically measured a
          three-variable power law in parameters <InlineMath math="N" />, data{' '}
          <InlineMath math="D" />, and compute <InlineMath math="C" />. The fits are eerily
          clean and span seven orders of magnitude. They are power laws with non-trivial
          exponents — the same mathematical form that shows up at second-order phase transitions
          in physics. We are doing statistical mechanics whether we like it or not, and LLM
          training sits near a critical point.
        </P>

        <Def title="Chinchilla scaling law">
          Language-model loss as a function of parameter count <InlineMath math="N" /> and
          training tokens <InlineMath math="D" />:
          <BlockMath math="L(N, D) = E + \frac{A}{N^{\alpha_N}} + \frac{B}{D^{\alpha_D}}." />
          Fit yields <InlineMath math="\alpha_N \approx 0.34" />,{' '}
          <InlineMath math="\alpha_D \approx 0.28" />,{' '}
          <InlineMath math="E \approx 1.69" /> bits (the "irreducible" entropy of natural
          language). Compute-optimal training scales <InlineMath math="N \sim D" />: the famous
          "20 tokens per parameter" rule.
        </Def>

        <Thm
          title="Compute-optimal allocation"
          proof={
            <>
              Under the constraint <InlineMath math="C = 6 N D" /> (FLOPs for a transformer
              forward+backward pass), Lagrange-minimize{' '}
              <InlineMath math="A N^{-\alpha_N} + B D^{-\alpha_D}" />. The FOC yields
              <InlineMath math="N^* \propto C^{a}" />, <InlineMath math="D^* \propto C^{b}" />
              {' '}with <InlineMath math="a = \alpha_D / (\alpha_N + \alpha_D)" />.
            </>
          }
        >
          Minimizing <InlineMath math="L" /> subject to a compute budget{' '}
          <InlineMath math="C \approx 6 N D" /> yields
          <BlockMath math="N^* \propto C^{\alpha_D / (\alpha_N + \alpha_D)}, \qquad D^* \propto C^{\alpha_N / (\alpha_N + \alpha_D)}." />
          With Chinchilla's exponents, <InlineMath math="N^*" /> and <InlineMath math="D^*" />
          {' '}each scale roughly as <InlineMath math="C^{1/2}" /> — data and params grow
          together, not one before the other.
        </Thm>

        <div className="py-2"><ScalingLawViz /></div>

        <Def title="Critical-phenomena analogy">
          Near a second-order phase transition, the correlation length diverges and
          observables follow power laws in the distance to criticality:{' '}
          <InlineMath math="\xi \sim |T - T_c|^{-\nu}" />,{' '}
          <InlineMath math="C \sim |T - T_c|^{-\alpha}" />. The Chinchilla exponents play the
          same role. Neural scaling laws are consistent with the hypothesis that large-scale
          learning sits at the <em>edge of a data-manifold phase transition</em>.
        </Def>

        <Thm title="Emergence as criticality">
          Specific capabilities (arithmetic, few-shot reasoning, instruction following) appear
          abruptly at threshold compute. Wei et al. (2022), later reinterpreted by Schaeffer et
          al. (2023), argued some emergence is an artifact of metric choice; but scaling laws
          predict that any nonlinear benchmark on a linearly-improving log-likelihood produces
          phase-transition-like curves. This is critical-phenomena universality applied to
          benchmark metrics.
        </Thm>

        <Practice>
          <strong>Chinchilla-optimal training</strong> (<InlineMath math="\sim 20" />{' '}
          tokens/parameter) is now industry standard; GPT-3 was wildly under-trained by this
          criterion. <strong>MoE scaling laws</strong> (Clark et al., 2022) have distinct
          exponents because active parameters and total parameters decouple.{' '}
          <strong>Multimodal and reasoning-fine-tuned models</strong> show broken scaling —
          power laws with a knee, indicating a regime change at the transition between
          imitation and reasoning (Anthropic, OpenAI observations around GPT-4 / Claude 3).
          <strong>Inference-time compute scaling</strong> (o1, Claude with extended thinking) is
          a <em>second</em> power law on top of the pretraining one: loss decreases as a power
          of serial tokens generated at test time. The frontier is learning to navigate
          multiple crossing power laws at once.
        </Practice>
      </div>
    </LessonShell>
  );
}
