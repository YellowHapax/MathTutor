import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import FractalViz from '../../viz/2d/FractalViz';

export default function Lesson8_1() {
  return (
    <LessonShell lessonId="scaling-8-1">
      <div className="space-y-6">
        <P>
          Integer dimension is a counting argument — a line needs one coordinate, a plane two. But
          "how many boxes of size <InlineMath math="\varepsilon" /> to cover this set" does not
          always scale like an integer power. For self-similar objects built from rescaled copies
          of themselves, the exponent — their <em>dimension</em> — is often a rational or
          irrational number between integers. This is the first hint that complexity is a
          geometric quantity, and it rules deep-learning loss surfaces.
        </P>

        <Def title="Box-counting dimension">
          Let <InlineMath math="N(\varepsilon)" /> be the minimum number of boxes of side{' '}
          <InlineMath math="\varepsilon" /> required to cover <InlineMath math="S \subset \mathbb{R}^d" />.
          The box dimension is
          <BlockMath math="\dim_{\mathrm{box}}(S) = \lim_{\varepsilon \to 0} \frac{\log N(\varepsilon)}{\log(1/\varepsilon)}." />
          When <InlineMath math="S" /> is self-similar under <InlineMath math="m" /> contractions
          each of ratio <InlineMath math="1/k" />, this reduces to{' '}
          <InlineMath math="\dim_{\mathrm{box}}(S) = \log m / \log k" />.
        </Def>

        <Thm
          title="Moran's equation"
          proof={
            <>
              For a self-similar set <InlineMath math="S = \bigcup_i f_i(S)" /> with ratios{' '}
              <InlineMath math="r_i" /> under the open-set condition, covering requires at level{' '}
              <InlineMath math="n" /> about <InlineMath math="(\sum_i r_i^s)^n" /> boxes; taking
              logs and dividing yields the Hausdorff dimension when this sum equals 1.
            </>
          }
        >
          The Hausdorff dimension <InlineMath math="s" /> of a self-similar attractor satisfies
          <BlockMath math="\sum_{i=1}^m r_i^s = 1." />
          For <InlineMath math="m" /> equal contractions of ratio <InlineMath math="r" />, this
          gives <InlineMath math="s = \log m / \log(1/r)" /> — the Cantor set has{' '}
          <InlineMath math="\log 2 / \log 3 \approx 0.631" />, the Sierpinski gasket has{' '}
          <InlineMath math="\log 3 / \log 2 \approx 1.585" />.
        </Thm>

        <div className="py-2"><FractalViz /></div>

        <Def title="Multifractal spectrum">
          When different regions of <InlineMath math="S" /> scale at different rates, one measures
          the spectrum <InlineMath math="f(\alpha)" /> of local Hölder exponents{' '}
          <InlineMath math="\alpha" />. A single <InlineMath math="\alpha" /> means monofractal; a
          band indicates turbulence, stock returns, and neural-network loss surfaces — all
          generically multifractal.
        </Def>

        <Thm title="Loss landscapes are fractal">
          Draper, Goodfellow, and others (2017–2022) showed that trained-network loss surfaces
          have <em>effective dimension</em> far below their parameter count, and exhibit
          self-similar barriers across scales. This is why mode-connectivity paths exist: the
          valleys of the loss form a fractal connected set, not isolated basins.
        </Thm>

        <Practice>
          The Kaplan–Hoffmann scaling laws{' '}
          <InlineMath math="L(N) \propto N^{-\alpha_N}" /> are fractal-dimension statements in
          disguise. They say that as you double parameters, loss decreases by a{' '}
          <em>constant ratio</em> — the hallmark of self-similarity. The exponent{' '}
          <InlineMath math="\alpha_N \approx 0.076" /> (Chinchilla) IS a Hausdorff-type dimension
          of the model family's information manifold, measured empirically. Neural scaling is
          geometry.
        </Practice>
      </div>
    </LessonShell>
  );
}
