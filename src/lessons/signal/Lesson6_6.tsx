import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import SpectralGraphViz from '../../viz/2d/SpectralGraphViz';

export default function Lesson6_6() {
  return (
    <LessonShell lessonId="signal-6-6">
      <div className="space-y-6">
        <P>
          The spectrum of a graph's Laplacian compresses vast amounts of structural information into
          a sorted list of numbers. Connectivity, clusterability, diameter, and random-walk mixing
          all read directly off the eigenvalues.
        </P>

        <Def title="Graph Laplacian">
          For an undirected graph <InlineMath math="G = (V, E)" /> with adjacency{' '}
          <InlineMath math="A" /> and degree matrix{' '}
          <InlineMath math="D = \mathrm{diag}(\deg(v_i))" />:
          <BlockMath math="L = D - A, \qquad L_{\text{sym}} = I - D^{-1/2} A D^{-1/2}." />
          Both are PSD; <InlineMath math="L" /> has kernel containing{' '}
          <InlineMath math="\mathbf{1}" />.
        </Def>

        <Thm
          title="Algebraic Connectivity (Fiedler)"
          proof={
            <>
              <InlineMath math="L" /> is PSD so eigenvalues are non-negative. Multiplicity of 0
              equals the number of connected components (the kernel is spanned by indicator functions
              of components). So <InlineMath math="\lambda_1 > 0 \iff G \text{ connected}" />.
            </>
          }
        >
          <InlineMath math="0 = \lambda_0 \le \lambda_1 \le \dots \le \lambda_{n-1}" />. The
          multiplicity of 0 equals the number of connected components. The second eigenvalue{' '}
          <InlineMath math="\lambda_1" /> — the <strong>Fiedler value</strong> — measures algebraic
          connectivity.
        </Thm>

        <div className="py-2"><SpectralGraphViz /></div>

        <Thm title="Cheeger Inequality">
          Let <InlineMath math="h(G) = \min_{S} \frac{|\partial S|}{\min(|S|, |V \setminus S|)}" />{' '}
          be the Cheeger constant. Then
          <BlockMath math="\frac{\lambda_1}{2} \le h(G) \le \sqrt{2\lambda_1}." />
          Good spectral gap <InlineMath math="\iff" /> no sparse cut <InlineMath math="\iff" /> fast
          mixing random walks.
        </Thm>

        <P>
          The Fiedler vector (the eigenvector of <InlineMath math="\lambda_1" />) gives the optimal
          relaxation of the min-cut: sort nodes by Fiedler-value and cut to separate clusters. This
          is <em>spectral clustering</em>.
        </P>

        <Practice>
          Graph transformers use Laplacian eigenvectors as positional encodings for non-sequential
          data (molecules, proteins, knowledge graphs). GraphGPS, Exphormer, and TokenGT all compute
          the first <InlineMath math="k" /> Laplacian eigenvectors per graph and prepend them as
          position features — the direct analog of RoPE for graphs. Expander graph construction for
          sparse mixture-of-experts routing relies on maintaining large spectral gap.
        </Practice>
      </div>
    </LessonShell>
  );
}
