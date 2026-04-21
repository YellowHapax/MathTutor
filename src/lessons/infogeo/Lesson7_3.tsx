import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import KLViz from '../../viz/2d/KLViz';

export default function Lesson7_3() {
  return (
    <LessonShell lessonId="infogeo-7-3">
      <div className="space-y-6">
        <P>
          KL divergence <InlineMath math="D(p \| q)" /> is asymmetric and not a true distance — yet
          it is the central object of information theory, variational inference, and RL. It is{' '}
          <em>locally</em> a Riemannian distance (Fisher) and <em>globally</em> a Bregman divergence.
          The asymmetry is the feature, not the bug.
        </P>

        <Def title="KL Divergence">
          <BlockMath math="D(p \| q) = \int p(x) \log \frac{p(x)}{q(x)} dx = \mathbb{E}_p[\log p - \log q]." />
          Non-negative (Gibbs), zero iff <InlineMath math="p = q" />, but{' '}
          <InlineMath math="D(p\|q) \ne D(q\|p)" /> and no triangle inequality.
        </Def>

        <Thm
          title="Local Equivalence to Fisher-Distance²"
          proof={
            <>
              Taylor-expand <InlineMath math="D(p_\theta \| p_{\theta + d\theta})" /> in{' '}
              <InlineMath math="d\theta" />. First-order term vanishes (score has mean 0);
              second-order term is <InlineMath math="\tfrac12 d\theta^\top I(\theta) d\theta" />.
            </>
          }
        >
          <BlockMath math="D(p_\theta \| p_{\theta + d\theta}) = \tfrac12 d\theta^\top I(\theta) d\theta + O(\|d\theta\|^3)." />
          In the infinitesimal limit, KL divergence is half the squared Fisher distance.
        </Thm>

        <div className="py-2"><KLViz /></div>

        <Thm title="Forward vs Reverse KL — Mode-Covering vs Mode-Seeking">
          Minimizing <InlineMath math="D(p \| q_\phi)" /> over <InlineMath math="\phi" /> forces{' '}
          <InlineMath math="q_\phi" /> to cover all of <InlineMath math="p" />'s support
          (<em>mean-seeking</em>, moment-matching). Minimizing <InlineMath math="D(q_\phi \| p)" />{' '}
          forces <InlineMath math="q_\phi" /> to stay inside <InlineMath math="p" />'s support
          (<em>mode-seeking</em>). The choice matters enormously.
        </Thm>

        <P>
          In variational inference the ELBO maximizes{' '}
          <InlineMath math="-D(q_\phi \| p(\cdot | x))" /> — reverse KL, hence mode-seeking. In
          maximum-likelihood training, we minimize{' '}
          <InlineMath math="D(p_{\text{data}} \| p_\theta)" /> — forward KL, hence mode-covering.
          This is why generative MLE trains cover all data, but VAEs' approximate posteriors collapse
          to single modes.
        </P>

        <Practice>
          RLHF loss is penalized KL:
          <BlockMath math="\max_\pi \mathbb{E}_\pi[r(x)] - \beta\, D(\pi \| \pi_{\text{ref}})." />
          The <InlineMath math="\beta" /> parameter is a trust-region size measured in KL — the
          policy may move a geodesic-distance of ~<InlineMath math="\sqrt{2/\beta}" /> from the
          reference. This is directly a Fisher-geometric constraint. DPO reformulates this as a
          log-likelihood problem without needing an explicit reward model.
        </Practice>
      </div>
    </LessonShell>
  );
}
