import React from 'react';
import LessonShell from '../../components/LessonShell';
import { P, Def, Thm, Practice } from '../../components/LessonBody';
import { InlineMath, BlockMath } from 'react-katex';
import KalmanViz from '../../viz/2d/KalmanViz';

export default function Lesson5_2() {
  return (
    <LessonShell lessonId="stochastics-5-2">
      <div className="space-y-6">
        <P>
          Given a latent process you cannot see, and noisy observations, the Kalman filter delivers
          the exact Bayesian posterior — provided everything is linear and Gaussian. It is the
          cleanest closed-form instance of filtering theory, and the ancestor of every state-space
          model in deep learning.
        </P>

        <Def title="Linear–Gaussian state-space model">
          <BlockMath math="x_{t+1} = F x_t + w_t, \quad w_t \sim \mathcal{N}(0, Q)" />
          <BlockMath math="y_t = H x_t + v_t, \quad v_t \sim \mathcal{N}(0, R)" />
          with <InlineMath math="x_0 \sim \mathcal{N}(\mu_0, \Sigma_0)" /> and all noises
          independent across time.
        </Def>

        <Thm
          title="Kalman Recursion"
          proof={
            <>
              The posterior <InlineMath math="p(x_t \mid y_{1:t})" /> is Gaussian at every step because
              the conditional of a joint Gaussian is Gaussian. Closing the recursion requires only
              the formula <InlineMath math="\mathbb{E}[x \mid y] = \mu_x + \Sigma_{xy}\Sigma_{yy}^{-1}(y - \mu_y)" />
              and <InlineMath math="\text{Cov}(x \mid y) = \Sigma_{xx} - \Sigma_{xy}\Sigma_{yy}^{-1}\Sigma_{yx}" />.
            </>
          }
        >
          The posterior <InlineMath math="p(x_t \mid y_{1:t}) = \mathcal{N}(\hat{x}_t, P_t)" />{' '}
          where, with predict step{' '}
          <InlineMath math="\hat{x}_t^- = F\hat{x}_{t-1}, \; P_t^- = F P_{t-1} F^\top + Q" />{' '}
          and Kalman gain <InlineMath math="K_t = P_t^- H^\top (H P_t^- H^\top + R)^{-1}" />:
          <BlockMath math="\hat{x}_t = \hat{x}_t^- + K_t (y_t - H\hat{x}_t^-), \quad P_t = (I - K_t H) P_t^-." />
        </Thm>

        <div className="py-2"><KalmanViz /></div>

        <P>
          The Kalman gain is a <em>signal-to-noise ratio</em>: when observation noise{' '}
          <InlineMath math="R" /> is tiny, <InlineMath math="K_t \to H^{-1}" /> and the filter
          trusts the data; when <InlineMath math="R" /> is huge, <InlineMath math="K_t \to 0" /> and
          the filter rides its own dynamics. For scalar <InlineMath math="F=H=1" /> with{' '}
          <InlineMath math="Q, R" /> constant, the steady-state gain{' '}
          <InlineMath math="K_\infty" /> solves a quadratic: this is exactly the MBD baseline
          constant <InlineMath math="\lambda" />.
        </P>

        <BlockMath math="B(t+1) = B(t) + \lambda (I - B(t)) \iff \text{Kalman with } F=1,\,H=1,\,K_\infty = \lambda" />

        <Practice>
          Mamba and S4 extend this by making <InlineMath math="F, H" /> learned functions of input.
          The "SSM layer" is a continuous-time Kalman predict-only step at inference, with parameters
          parameterized through HiPPO matrices for long-range memory. Linear attention is similarly a
          linear dynamical system in disguise: <InlineMath math="\phi(q)^\top \sum_{s \le t} \phi(k_s) v_s^\top" />{' '}
          is a recursively updatable state.
        </Practice>
      </div>
    </LessonShell>
  );
}
