import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import AttentionViz from '../../viz/2d/AttentionViz';

export default function Lesson9_1() {
  return (
    <LessonShell lessonId="llminfra-9-1">
      <div className="space-y-6">
        <P>
          Scaled dot-product attention looks like linear algebra: three projections, a matmul, a
          softmax, another matmul. Read it geometrically and it becomes something older and more
          familiar — the Nadaraya–Watson kernel estimator from 1964. Every transformer layer is
          doing kernel smoothing against a bank of learned memories; "attention" is just the
          exponentiated-inner-product kernel. Once you see this, the entire architecture rhymes
          with the math we built in Tracks 6 and 7.
        </P>

        <Def title="Scaled dot-product attention">
          Given queries <InlineMath math="Q \in \mathbb{R}^{n \times d}" />, keys{' '}
          <InlineMath math="K \in \mathbb{R}^{m \times d}" />, and values{' '}
          <InlineMath math="V \in \mathbb{R}^{m \times d_v}" />,
          <BlockMath math="\mathrm{Attn}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d}}\right) V." />
          Row <InlineMath math="i" /> of the output is a convex combination of value rows with
          weights <InlineMath math="w_{ij} \propto \exp(q_i \cdot k_j / \sqrt{d})" />.
        </Def>

        <Thm
          title="Attention is Nadaraya–Watson regression"
          proof={
            <>
              Write the kernel as{' '}
              <InlineMath math="\kappa(q, k) = \exp(q \cdot k / \sqrt{d})" />; the attention
              output for query <InlineMath math="q" /> is{' '}
              <InlineMath math="\sum_j \kappa(q, k_j) v_j / \sum_j \kappa(q, k_j)" />. This is
              exactly the classical Nadaraya–Watson kernel smoother, with the kernel chosen to
              be the exponentiated inner product rather than a Gaussian on{' '}
              <InlineMath math="\|q - k\|^2" />.
            </>
          }
        >
          Attention is a kernel regressor:
          <BlockMath math="\mathrm{Attn}(q) = \frac{\sum_j \kappa(q, k_j) v_j}{\sum_j \kappa(q, k_j)}, \qquad \kappa(q, k) = e^{q \cdot k / \sqrt{d}}." />
          On the unit sphere, <InlineMath math="q \cdot k = 1 - \tfrac{1}{2}\|q - k\|^2" />, so
          the kernel is a Gaussian-in-angle, and attention is RBF kernel smoothing.
        </Thm>

        <div className="py-2"><AttentionViz /></div>

        <Def title="Multi-head attention">
          Run <InlineMath math="h" /> attention operations in parallel with distinct{' '}
          <InlineMath math="(W_Q^{(i)}, W_K^{(i)}, W_V^{(i)})" /> projections, concatenate, and
          project: <InlineMath math="\mathrm{MHA}(X) = W_O \,[\,\mathrm{head}_1, \ldots, \mathrm{head}_h]" />.
          Each head sees a different kernel on a different linear subspace of the embedding.
          Multi-head attention is a <em>mixture of kernels</em>.
        </Def>

        <Thm title="Rank bound on attention output">
          With sequence length <InlineMath math="n" /> and head dim <InlineMath math="d" />, the
          attention weight matrix is rank ≤ <InlineMath math="d" />. Multiple heads sum rank
          contributions; this is why <InlineMath math="h \cdot d_{\mathrm{head}} \approx d_{\mathrm{model}}" /> —
          you need enough cumulative rank to represent arbitrary communication patterns.
        </Thm>

        <Practice>
          <strong>FlashAttention</strong> (Dao, 2022) computes this same kernel smoothing
          block-by-block without materializing the full <InlineMath math="n \times m" /> weight
          matrix — IO-optimal exact attention. <strong>Linear attention</strong>{' '}
          (Katharopoulos et al., Performer) replaces the softmax kernel with a factored feature
          map <InlineMath math="\phi(q) \phi(k)^\top" />, turning the Nadaraya–Watson sum into a
          running accumulator with <InlineMath math="O(n)" /> compute. <strong>Induction
          heads</strong> (Anthropic, Olsson et al.) are kernel smoothers where the key-query
          match literally implements an N-gram lookup — the cleanest interpretable kernel in
          transformer land. Understanding attention as kernel regression IS the interpretability
          lens.
        </Practice>
      </div>
    </LessonShell>
  );
}
