import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import KernelViz from '../../viz/2d/KernelViz';

export default function Lesson6_4() {
  return (
    <LessonShell lessonId="signal-6-4">
      <div className="space-y-6">
        <P>
          A kernel is a similarity function that secretly admits a feature map. The Reproducing
          Kernel Hilbert Space (RKHS) is the unique Hilbert space where the kernel computes inner
          products. This abstraction underlies SVMs, Gaussian processes, and every attention head.
        </P>

        <Def title="Positive-definite kernel">
          A symmetric function <InlineMath math="k : \mathcal{X} \times \mathcal{X} \to \mathbb{R}" />{' '}
          is positive-definite if for any finite <InlineMath math="\{x_i\}" /> and{' '}
          <InlineMath math="\{c_i\}" />,{' '}
          <InlineMath math="\sum_{i,j} c_i c_j k(x_i, x_j) \ge 0" />. Equivalently, the Gram matrix{' '}
          <InlineMath math="[k(x_i, x_j)]" /> is PSD.
        </Def>

        <Thm
          title="Moore–Aronszajn"
          proof={
            <>
              Build <InlineMath math="\mathcal{H}_0 = \mathrm{span}\{k(x, \cdot) : x \in \mathcal{X}\}" />{' '}
              with inner product{' '}
              <InlineMath math="\langle k(x, \cdot), k(y, \cdot) \rangle = k(x, y)" /> extended
              bilinearly. PD ensures this is well-defined. Complete under the induced norm; the
              resulting Hilbert space has the reproducing property.
            </>
          }
        >
          For every PD kernel <InlineMath math="k" /> there exists a unique Hilbert space{' '}
          <InlineMath math="\mathcal{H}_k" /> of functions on <InlineMath math="\mathcal{X}" /> such
          that <InlineMath math="k(x, \cdot) \in \mathcal{H}_k" /> and
          <BlockMath math="f(x) = \langle f, k(x, \cdot) \rangle_{\mathcal{H}_k} \quad \forall f \in \mathcal{H}_k." />
          This is the <em>reproducing property</em>.
        </Thm>

        <div className="py-2"><KernelViz /></div>

        <Thm title="Representer Theorem (Kimeldorf–Wahba)">
          The minimizer of a regularized risk{' '}
          <InlineMath math="\hat f = \arg\min_{f \in \mathcal{H}_k} \sum_i L(y_i, f(x_i)) + \lambda \|f\|^2_{\mathcal{H}_k}" />{' '}
          has the form
          <BlockMath math="\hat f(x) = \sum_{i=1}^n \alpha_i k(x_i, x)." />
          The optimum in an infinite-dimensional space lives in an{' '}
          <InlineMath math="n" />-dimensional subspace.
        </Thm>

        <P>
          The cost of working in the feature space is quadratic in <InlineMath math="n" />: you need
          the Gram matrix. The attention mechanism is exactly this structure, with{' '}
          <InlineMath math="n" /> = context length. This is also <em>exactly</em> why quadratic
          attention is expensive and why subquadratic alternatives (linear attention, SSMs,
          Performer) exist.
        </P>

        <Practice>
          Transformer attention{' '}
          <InlineMath math="\mathrm{Attn}(Q, K, V) = \mathrm{softmax}(QK^\top/\sqrt d) V" /> is a
          kernel smoother with kernel <InlineMath math="k(q, k) = \exp(q^\top k / \sqrt d)" />,
          normalized over keys. Performer (Choromanski et al.) approximates{' '}
          <InlineMath math="\exp(q^\top k)" /> by random-feature inner products{' '}
          <InlineMath math="\phi(q)^\top \phi(k)" /> to achieve linear complexity — literally
          Moore–Aronszajn applied backward.
        </Practice>
      </div>
    </LessonShell>
  );
}
