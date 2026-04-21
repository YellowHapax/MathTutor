import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import ScoreFieldViz from '../../viz/2d/ScoreFieldViz';

export default function Lesson5_5() {
  return (
    <LessonShell lessonId="stochastics-5-5">
      <div className="space-y-6">
        <P>
          The score <InlineMath math="s(x) := \nabla_x \log p(x)" /> determines a density up to a
          constant — yet it can be learned <em>without ever knowing that constant</em>. This
          miracle is the foundation of diffusion models.
        </P>

        <Def title="Score">
          For a density <InlineMath math="p" /> on <InlineMath math="\mathbb{R}^n" />, the score is
          <BlockMath math="s(x) = \nabla_x \log p(x) = \frac{\nabla p(x)}{p(x)}." />
          Note: <InlineMath math="\nabla \log(Z \cdot p) = \nabla \log p" /> — the normalizer{' '}
          <InlineMath math="Z" /> is invisible.
        </Def>

        <Thm
          title="Hyvärinen's Identity"
          proof={
            <>
              Integrate by parts on{' '}
              <InlineMath math="\mathbb{E}_p[\|s_\theta - s\|^2] = \mathbb{E}_p[\|s_\theta\|^2] - 2\mathbb{E}_p[s_\theta^\top s] + C" />.
              The cross term becomes{' '}
              <InlineMath math="-2\mathbb{E}_p[s_\theta^\top \nabla \log p] = -2\int s_\theta^\top \nabla p \, dx = 2\int (\nabla \cdot s_\theta) p \, dx" />.
            </>
          }
        >
          Under mild conditions,
          <BlockMath math="\tfrac12 \mathbb{E}_p\big[\|s_\theta(x) - \nabla \log p(x)\|^2\big] = \mathbb{E}_p\!\Big[\tfrac12 \|s_\theta(x)\|^2 + \nabla \cdot s_\theta(x)\Big] + \text{const}." />
          The right-hand side doesn't contain <InlineMath math="p" />! You can fit{' '}
          <InlineMath math="s_\theta" /> using only samples.
        </Thm>

        <div className="py-2"><ScoreFieldViz /></div>

        <Thm title="Denoising Score Matching (Vincent 2011)">
          For <InlineMath math="q_\sigma(\tilde{x} \mid x) = \mathcal{N}(x, \sigma^2 I)" />,
          <BlockMath math="\mathbb{E}_{q_\sigma}\big[\|s_\theta(\tilde{x}) - \nabla_{\tilde{x}} \log q_\sigma(\tilde{x} \mid x)\|^2\big] = \mathbb{E}\big[\|s_\theta(\tilde x) - \nabla \log p_\sigma(\tilde x)\|^2\big] + C." />
          Since <InlineMath math="\nabla_{\tilde x} \log q_\sigma(\tilde x \mid x) = -(\tilde x - x)/\sigma^2" />,
          this reduces to predicting the noise — the universal diffusion training loss.
        </Thm>

        <P>
          The practical consequence: train a neural network <InlineMath math="s_\theta" /> to map
          noisy samples to the negative noise vector that produced them. No partition function. No
          adversary. Just a regression on Gaussian noise.
        </P>

        <BlockMath math="\mathcal{L}(\theta) = \mathbb{E}_{x \sim p, \epsilon \sim \mathcal{N}(0,I)} \big[\| \sigma \cdot s_\theta(x + \sigma \epsilon) + \epsilon \|^2\big]" />

        <Practice>
          This is <em>the</em> training objective of Stable Diffusion, DALL·E, Imagen, Sora, and
          diffusion LLMs (Diffusion-LM, SSD-LM). Also powers generative chemistry (equivariant score
          networks) and protein folding diffusion (RFdiffusion). Every sample these models produce is
          an ascent along the learned score field.
        </Practice>
      </div>
    </LessonShell>
  );
}
