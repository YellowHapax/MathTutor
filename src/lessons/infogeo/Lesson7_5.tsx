import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import WassersteinViz from '../../viz/2d/WassersteinViz';

export default function Lesson7_5() {
  return (
    <LessonShell lessonId="infogeo-7-5">
      <div className="space-y-6">
        <P>
          Fisher/KL geometry compares distributions <em>pointwise</em>: it asks how likely one
          density is under another. Optimal Transport asks a physically different question — how
          much <em>work</em> does it take to rearrange one pile of probability mass into another?
          The answer is a genuine metric, sensitive to ground geometry, finite even when supports
          are disjoint. This is the geometry diffusion models live in.
        </P>

        <Def title="Kantorovich formulation">
          For probability measures <InlineMath math="\mu, \nu" /> on a space{' '}
          <InlineMath math="\mathcal{X}" /> with cost <InlineMath math="c(x, y)" />, the optimal
          transport cost is
          <BlockMath math="\mathcal{T}_c(\mu, \nu) = \inf_{\gamma \in \Pi(\mu, \nu)} \int_{\mathcal{X} \times \mathcal{X}} c(x, y)\, d\gamma(x, y)" />
          where <InlineMath math="\Pi(\mu, \nu)" /> is the set of couplings with marginals{' '}
          <InlineMath math="\mu" /> and <InlineMath math="\nu" />. Choosing{' '}
          <InlineMath math="c(x, y) = \|x - y\|^p" /> gives the{' '}
          <em>p-Wasserstein distance</em>{' '}
          <InlineMath math="W_p(\mu, \nu) = \mathcal{T}_c^{1/p}" />.
        </Def>

        <Thm
          title="Kantorovich–Rubinstein Duality"
          proof={
            <>
              Lagrangian duality on the infinite-dimensional LP: primal feasibility{' '}
              <InlineMath math="\gamma \in \Pi(\mu, \nu)" /> dualizes to potentials{' '}
              <InlineMath math="\varphi, \psi" /> with{' '}
              <InlineMath math="\varphi(x) + \psi(y) \le c(x, y)" />. For <InlineMath math="p=1" />{' '}
              with Euclidean cost, optimal potentials satisfy{' '}
              <InlineMath math="\psi = -\varphi" /> and <InlineMath math="\varphi" /> must be
              1-Lipschitz; strong duality holds by Fenchel–Rockafellar.
            </>
          }
        >
          For <InlineMath math="p = 1" />,
          <BlockMath math="W_1(\mu, \nu) = \sup_{\|\varphi\|_{\mathrm{Lip}} \le 1} \left( \int \varphi\, d\mu - \int \varphi\, d\nu \right)." />
          The supremum is over all 1-Lipschitz test functions. This is exactly the objective
          maximized by the critic in a Wasserstein GAN.
        </Thm>

        <Def title="Monge map (when it exists)">
          If <InlineMath math="\mu" /> is absolutely continuous, Brenier's theorem guarantees a
          unique transport map <InlineMath math="T: \mathcal{X} \to \mathcal{X}" /> with{' '}
          <InlineMath math="T_\# \mu = \nu" /> that solves the quadratic OT problem; moreover{' '}
          <InlineMath math="T = \nabla \varphi" /> for a convex potential{' '}
          <InlineMath math="\varphi" />. Transport becomes a gradient field.
        </Def>

        <div className="py-2"><WassersteinViz /></div>

        <Thm title="One-dimensional OT is quantile matching">
          On <InlineMath math="\mathbb{R}" />, the optimal coupling between{' '}
          <InlineMath math="\mu" /> and <InlineMath math="\nu" /> is given by their inverse CDFs:
          <BlockMath math="W_p(\mu, \nu)^p = \int_0^1 \big| F_\mu^{-1}(u) - F_\nu^{-1}(u) \big|^p du." />
          Sort the two clouds; pair the <InlineMath math="k" />-th source with the{' '}
          <InlineMath math="k" />-th target. This is what the visualization above renders.
        </Thm>

        <Def title="Wasserstein geodesics (displacement interpolation)">
          The curve <InlineMath math="\mu_t = \big( (1-t)\,\mathrm{id} + t\,T \big)_\# \mu" /> is
          the <InlineMath math="W_2" />-geodesic from <InlineMath math="\mu" /> to{' '}
          <InlineMath math="\nu" />. Mass moves in straight lines at constant speed. This is
          exactly the "noise → data" path that flow-matching and rectified-flow models are
          trained to trace.
        </Def>

        <Practice>
          <strong>Flow matching</strong> (Stable Diffusion 3, Flux, Rectified Flow) regresses a
          velocity field <InlineMath math="v_\theta(x, t)" /> onto the{' '}
          <InlineMath math="W_2" />-geodesic from noise to data — the loss literally is
          <InlineMath math="\mathbb{E} \|v_\theta(x_t, t) - (x_1 - x_0)\|^2" />, the
          constant-speed displacement. <strong>WGAN</strong> critics estimate{' '}
          <InlineMath math="W_1" /> via the Lipschitz dual. <strong>Sliced Wasserstein</strong>{' '}
          averages 1D quantile distances over random projections — fast, and the backbone of
          several generative-model evaluations (FID's cousin, SWD).
        </Practice>
      </div>
    </LessonShell>
  );
}
