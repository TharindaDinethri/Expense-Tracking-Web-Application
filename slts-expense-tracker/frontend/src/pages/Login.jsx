import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();

    const [f, setF] = useState({
        email: '',
        password: ''
    });

    const [err, setErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async e => {
        e.preventDefault();
        setErr('');
        setLoading(true);

        try {
            await login(f);
            nav('/');
        } catch (x) {
            setErr(x.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .premium-login {
                    min-height: 100vh;
                    display: flex;
                    background: #f7f8fc;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                /* =====================================================
                   LEFT SIDE
                ===================================================== */

                .premium-left {
                    width: 52%;
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;

                    background:
                        radial-gradient(
                            circle at 15% 15%,
                            rgba(99,102,241,.38),
                            transparent 28%
                        ),
                        radial-gradient(
                            circle at 85% 75%,
                            rgba(59,130,246,.30),
                            transparent 30%
                        ),
                        linear-gradient(
                            145deg,
                            #0f172a 0%,
                            #172554 48%,
                            #1e3a8a 100%
                        );

                    padding: 42px 52px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: white;
                }

                .premium-left::before {
                    content: "";
                    position: absolute;
                    width: 620px;
                    height: 620px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.08);
                    top: -280px;
                    right: -230px;
                }

                .premium-left::after {
                    content: "";
                    position: absolute;
                    width: 480px;
                    height: 480px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,.06);
                    bottom: -250px;
                    left: -200px;
                }

                /* BRAND */

                .premium-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                    z-index: 5;
                }

                .premium-logo {
                    width: 46px;
                    height: 46px;
                    border-radius: 14px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 15px;
                    font-weight: 850;

                    background:
                        linear-gradient(
                            135deg,
                            rgba(255,255,255,.22),
                            rgba(255,255,255,.08)
                        );

                    border: 1px solid rgba(255,255,255,.16);
                    box-shadow:
                        0 10px 30px rgba(0,0,0,.15);

                    backdrop-filter: blur(12px);
                }

                .premium-brand-name {
                    font-size: 18px;
                    font-weight: 750;
                    letter-spacing: -.3px;
                }

                /* HERO */

                .premium-hero {
                    max-width: 560px;
                    position: relative;
                    z-index: 5;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;

                    padding: 8px 12px;
                    border-radius: 999px;

                    background: rgba(255,255,255,.09);
                    border: 1px solid rgba(255,255,255,.12);

                    color: rgba(255,255,255,.8);
                    font-size: 11px;
                    font-weight: 650;

                    margin-bottom: 24px;

                    backdrop-filter: blur(10px);
                }

                .hero-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #86efac;
                    box-shadow: 0 0 12px rgba(134,239,172,.8);
                }

                .premium-hero h1 {
                    margin: 0;

                    font-size: clamp(
                        42px,
                        4.6vw,
                        67px
                    );

                    line-height: 1.02;
                    letter-spacing: -3.2px;
                    font-weight: 850;
                }

                .premium-hero h1 span {
                    display: block;
                    background:
                        linear-gradient(
                            90deg,
                            #bfdbfe,
                            #c4b5fd
                        );
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                }

                .premium-hero p {
                    max-width: 500px;

                    margin: 24px 0 0;

                    color: rgba(255,255,255,.65);

                    font-size: 16px;
                    line-height: 1.75;
                }

                /* =====================================================
                   FLOATING FINANCE CARDS
                ===================================================== */

                .finance-preview {
                    width: 410px;
                    height: 230px;

                    margin-top: 42px;

                    position: relative;

                    transform: rotate(-2deg);
                }

                .balance-card {
                    position: absolute;

                    width: 330px;
                    height: 185px;

                    top: 15px;
                    left: 25px;

                    padding: 24px;

                    border-radius: 22px;

                    background:
                        linear-gradient(
                            135deg,
                            rgba(255,255,255,.19),
                            rgba(255,255,255,.07)
                        );

                    border: 1px solid rgba(255,255,255,.18);

                    backdrop-filter: blur(18px);

                    box-shadow:
                        0 30px 60px rgba(0,0,0,.25);
                }

                .balance-label {
                    font-size: 11px;
                    color: rgba(255,255,255,.55);
                    margin-bottom: 9px;
                }

                .balance-value {
                    font-size: 30px;
                    font-weight: 800;
                    letter-spacing: -1px;
                }

                .balance-change {
                    margin-top: 15px;

                    display: flex;
                    align-items: center;
                    gap: 7px;

                    color: #bbf7d0;
                    font-size: 11px;
                }

                .mini-chart {
                    position: absolute;

                    width: 220px;
                    height: 115px;

                    right: -20px;
                    bottom: -5px;

                    padding: 17px;

                    border-radius: 18px;

                    background:
                        rgba(15,23,42,.75);

                    border: 1px solid rgba(255,255,255,.1);

                    backdrop-filter: blur(15px);

                    box-shadow:
                        0 25px 45px rgba(0,0,0,.25);
                }

                .chart-title {
                    color: rgba(255,255,255,.55);
                    font-size: 10px;
                    margin-bottom: 13px;
                }

                .chart-bars {
                    height: 55px;

                    display: flex;
                    align-items: flex-end;
                    gap: 7px;
                }

                .chart-bar {
                    flex: 1;
                    border-radius: 5px 5px 2px 2px;

                    background:
                        linear-gradient(
                            to top,
                            #60a5fa,
                            #a78bfa
                        );

                    opacity: .85;
                }

                .chart-bar:nth-child(1) {
                    height: 35%;
                }

                .chart-bar:nth-child(2) {
                    height: 55%;
                }

                .chart-bar:nth-child(3) {
                    height: 42%;
                }

                .chart-bar:nth-child(4) {
                    height: 75%;
                }

                .chart-bar:nth-child(5) {
                    height: 62%;
                }

                .chart-bar:nth-child(6) {
                    height: 90%;
                }

                /* FEATURES */

                .premium-features {
                    display: flex;
                    gap: 28px;
                    margin-top: 38px;
                }

                .premium-feature {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    color: rgba(255,255,255,.6);
                    font-size: 11px;
                }

                .feature-check {
                    width: 20px;
                    height: 20px;

                    border-radius: 50%;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: rgba(255,255,255,.1);
                    color: #bfdbfe;

                    font-size: 10px;
                }

                /* FOOTER */

                .premium-footer {
                    position: relative;
                    z-index: 5;

                    color: rgba(255,255,255,.35);
                    font-size: 10px;
                }

                /* =====================================================
                   RIGHT SIDE
                ===================================================== */

                .premium-right {
                    width: 48%;
                    min-height: 100vh;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 40px;
                }

                .login-container {
                    width: 100%;
                    max-width: 425px;
                }

                .mobile-brand {
                    display: none;
                }

                .login-header {
                    margin-bottom: 30px;
                }

                .login-header h2 {
                    margin: 0 0 9px;

                    color: #111827;

                    font-size: 34px;
                    line-height: 1.15;

                    font-weight: 800;

                    letter-spacing: -1.3px;
                }

                .login-header p {
                    margin: 0;

                    color: #6b7280;

                    font-size: 14px;
                    line-height: 1.6;
                }

                /* FORM */

                .premium-form {
                    display: flex;
                    flex-direction: column;
                    gap: 19px;
                }

                .premium-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .premium-label {
                    color: #374151;
                    font-size: 12px;
                    font-weight: 700;
                }

                .premium-input-wrap {
                    position: relative;
                }

                .premium-input-icon {
                    position: absolute;

                    left: 15px;
                    top: 50%;

                    transform: translateY(-50%);

                    color: #9ca3af;

                    font-size: 15px;

                    pointer-events: none;
                }

                .premium-input {
                    width: 100%;
                    height: 53px;

                    border-radius: 12px;

                    border: 1px solid #e1e5eb;

                    background: white;

                    padding:
                        0
                        46px
                        0
                        43px;

                    color: #111827;

                    outline: none;

                    font-size: 13px;

                    transition:
                        border-color .2s,
                        box-shadow .2s,
                        background .2s;
                }

                .premium-input:hover {
                    border-color: #cbd5e1;
                }

                .premium-input:focus {
                    border-color: #6366f1;

                    background: white;

                    box-shadow:
                        0 0 0 4px
                        rgba(99,102,241,.09);
                }

                .premium-input::placeholder {
                    color: #a7adb7;
                }

                .password-button {
                    position: absolute;

                    right: 9px;
                    top: 50%;

                    transform: translateY(-50%);

                    width: 35px;
                    height: 35px;

                    border: 0;
                    border-radius: 8px;

                    background: transparent;

                    color: #8b93a1;

                    cursor: pointer;

                    font-size: 14px;
                }

                .password-button:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                /* ERROR */

                .premium-error {
                    padding: 13px 14px;

                    border-radius: 11px;

                    background: #fff5f5;
                    border: 1px solid #fed7d7;

                    color: #b91c1c;

                    font-size: 12px;
                    line-height: 1.5;
                }

                /* OPTIONS */

                .login-options {
                    display: flex;
                    justify-content: flex-end;

                    margin-top: -2px;
                }

                .forgot {
                    color: #4f46e5;

                    font-size: 12px;
                    font-weight: 700;

                    text-decoration: none;
                }

                .forgot:hover {
                    text-decoration: underline;
                }

                /* BUTTON */

                .premium-button {
                    width: 100%;
                    height: 53px;

                    border: 0;
                    border-radius: 12px;

                    background:
                        linear-gradient(
                            135deg,
                            #4f46e5,
                            #2563eb
                        );

                    color: white;

                    font-size: 13px;
                    font-weight: 750;

                    cursor: pointer;

                    box-shadow:
                        0 12px 25px
                        rgba(79,70,229,.2);

                    transition:
                        transform .2s,
                        box-shadow .2s,
                        opacity .2s;
                }

                .premium-button:hover:not(:disabled) {
                    transform: translateY(-1px);

                    box-shadow:
                        0 16px 30px
                        rgba(79,70,229,.25);
                }

                .premium-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .premium-button:disabled {
                    opacity: .65;
                    cursor: not-allowed;
                }

                .button-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                }

                .loading-spinner {
                    width: 15px;
                    height: 15px;

                    border-radius: 50%;

                    border:
                        2px solid
                        rgba(255,255,255,.35);

                    border-top-color: white;

                    animation:
                        premium-spin .7s linear infinite;
                }

                @keyframes premium-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* DIVIDER */

                .premium-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    margin: 28px 0 20px;

                    color: #a1a8b3;

                    font-size: 9px;

                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .premium-divider::before,
                .premium-divider::after {
                    content: "";

                    height: 1px;

                    flex: 1;

                    background: #e7e9ee;
                }

                /* REGISTER */

                .register-card {
                    text-align: center;

                    padding: 16px;

                    border-radius: 12px;

                    background: #fafbfc;
                    border: 1px solid #eceef2;

                    color: #6b7280;

                    font-size: 12px;
                }

                .register-card a {
                    color: #4f46e5;

                    font-weight: 750;

                    text-decoration: none;

                    margin-left: 5px;
                }

                .register-card a:hover {
                    text-decoration: underline;
                }

                .secure-text {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;

                    margin-top: 20px;

                    color: #9ca3af;

                    font-size: 10px;
                }

                /* =====================================================
                   TABLET
                ===================================================== */

                @media (max-width: 1050px) {

                    .premium-left {
                        width: 50%;
                        padding: 35px;
                    }

                    .premium-right {
                        width: 50%;
                        padding: 30px;
                    }

                    .finance-preview {
                        transform: scale(.88) rotate(-2deg);
                        transform-origin: left center;
                    }

                    .premium-features {
                        flex-direction: column;
                        gap: 10px;
                    }

                }

                /* =====================================================
                   MOBILE
                ===================================================== */

                @media (max-width: 820px) {

                    .premium-left {
                        display: none;
                    }

                    .premium-right {
                        width: 100%;
                        min-height: 100vh;

                        padding:
                            30px
                            20px;

                        background:
                            radial-gradient(
                                circle at top right,
                                #e9edff,
                                transparent 35%
                            ),
                            #f7f8fc;
                    }

                    .mobile-brand {
                        display: flex;

                        align-items: center;
                        justify-content: center;

                        gap: 10px;

                        margin-bottom: 35px;
                    }

                    .mobile-logo {
                        width: 43px;
                        height: 43px;

                        border-radius: 13px;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        background:
                            linear-gradient(
                                135deg,
                                #4f46e5,
                                #2563eb
                            );

                        color: white;

                        font-size: 14px;
                        font-weight: 850;

                        box-shadow:
                            0 8px 20px
                            rgba(79,70,229,.2);
                    }

                    .mobile-name {
                        font-size: 18px;
                        font-weight: 800;
                        color: #172033;
                    }

                }

                @media (max-width: 480px) {

                    .premium-right {
                        padding: 24px 16px;
                    }

                    .login-header h2 {
                        font-size: 29px;
                    }

                    .login-container {
                        max-width: 100%;
                    }

                }

            `}</style>

            <div className="premium-login">

                {/* =====================================================
                    LEFT SECTION
                ===================================================== */}

                <section className="premium-left">

                    <div className="premium-brand">

                        <div className="premium-logo">
                            EF
                        </div>

                        <div className="premium-brand-name">
                            ExpenseFlow
                        </div>

                    </div>

                    <div className="premium-hero">


                        <h1>
                            Take control of 
                            <span>your finances.</span>
                        </h1>

                        <p>
                            A smarter way to track your expenses,
                            manage your income and keep your financial
                            goals on track.
                        </p>

                        <div className="finance-preview">

                            <div className="balance-card">

                                <div className="balance-label">
                                    CURRENT BALANCE
                                </div>

                                <div className="balance-value">
                                    Rs. 245,850
                                </div>

                                <div className="balance-change">
                                    ↑ 12.8% this month
                                </div>

                            </div>

                            <div className="mini-chart">

                                <div className="chart-title">
                                    Monthly overview
                                </div>

                                <div className="chart-bars">

                                    <span className="chart-bar"></span>
                                    <span className="chart-bar"></span>
                                    <span className="chart-bar"></span>
                                    <span className="chart-bar"></span>
                                    <span className="chart-bar"></span>
                                    <span className="chart-bar"></span>

                                </div>

                            </div>

                        </div>

                        <div className="premium-features">

                            <div className="premium-feature">
                                <span className="feature-check">
                                    ✓
                                </span>
                                Expense tracking
                            </div>

                            <div className="premium-feature">
                                <span className="feature-check">
                                    ✓
                                </span>
                                Income management
                            </div>

                            <div className="premium-feature">
                                <span className="feature-check">
                                    ✓
                                </span>
                                Financial insights
                            </div>

                        </div>

                    </div>

                    <div className="premium-footer">
                        © {new Date().getFullYear()} ExpenseFlow
                    </div>

                </section>

                {/* =====================================================
                    RIGHT SECTION
                ===================================================== */}

                <section className="premium-right">

                    <div className="login-container">

                        {/* MOBILE BRAND */}

                        <div className="mobile-brand">

                            <div className="mobile-logo">
                                EF
                            </div>

                            <div className="mobile-name">
                                ExpenseFlow
                            </div>

                        </div>

                        {/* HEADER */}

                        <div className="login-header">

                            <h2>
                                Welcome back
                            </h2>

                            <p>
                                Sign in to continue to your
                                financial dashboard.
                            </p>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={submit}
                            className="premium-form"
                        >

                            {err && (
                                <div className="premium-error">
                                    {err}
                                </div>
                            )}

                            {/* EMAIL */}

                            <div className="premium-field">

                                <label className="premium-label">
                                    Email address
                                </label>

                                <div className="premium-input-wrap">

                                    <span className="premium-input-icon">
                                        ✉
                                    </span>

                                    <input
                                        className="premium-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        autoComplete="email"
                                        value={f.email}
                                        onChange={e =>
                                            setF({
                                                ...f,
                                                email: e.target.value
                                            })
                                        }
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div className="premium-field">

                                <label className="premium-label">
                                    Password
                                </label>

                                <div className="premium-input-wrap">

                                    <span className="premium-input-icon">
                                        🔒
                                    </span>

                                    <input
                                        className="premium-input"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        value={f.password}
                                        onChange={e =>
                                            setF({
                                                ...f,
                                                password: e.target.value
                                            })
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="password-button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? '◉' : '◌'}
                                    </button>

                                </div>

                            </div>

                            {/* FORGOT PASSWORD */}

                            <div className="login-options">

                                <Link
                                    to="/forgot"
                                    className="forgot"
                                >
                                    Forgot password?
                                </Link>

                            </div>

                            {/* SIGN IN */}

                            <button
                                type="submit"
                                className="premium-button"
                                disabled={loading}
                            >

                                {loading ? (

                                    <span className="button-loading">
                                        <span className="loading-spinner"></span>
                                        Signing in...
                                    </span>

                                ) : (
                                    'Sign in to ExpenseFlow'
                                )}

                            </button>

                        </form>

                        {/* DIVIDER */}

                        <div className="premium-divider">
                            <span>New to ExpenseFlow?</span>
                        </div>

                        {/* REGISTER */}

                        <div className="register-card">

                            Create your account and start
                            managing your finances.

                            <Link to="/register">
                                Create account
                            </Link>

                        </div>

                        {/* SECURITY */}

                        <div className="secure-text">

                            <span>🔒</span>

                            <span>
                                Your connection is securely authenticated
                            </span>

                        </div>

                    </div>

                </section>

            </div>
        </>
    );
}