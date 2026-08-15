import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);

    const [f, setF] = useState({
        email: '',
        otp: '',
        newPassword: ''
    });

    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const send = async e => {
        e.preventDefault();

        setMsg('');
        setErr('');
        setLoading(true);

        try {
            await api('/auth/forgot-password', {
                method: 'POST',
                body: {
                    email: f.email
                },
                auth: false
            });

            setMsg(
                'If the email exists, an OTP has been sent. Check your email or the backend console during local development.'
            );

            setStep(2);
        } catch (x) {
            setErr(x.message);
        } finally {
            setLoading(false);
        }
    };

    const reset = async e => {
        e.preventDefault();

        setMsg('');
        setErr('');
        setLoading(true);

        try {
            await api('/auth/reset-password', {
                method: 'POST',
                body: f,
                auth: false
            });

            setMsg(
                'Your password has been reset successfully. You can now sign in with your new password.'
            );

            setStep(3);
        } catch (x) {
            setErr(x.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtp = e => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);

        setF({
            ...f,
            otp: value
        });
    };

    return (
        <div style={styles.page}>

            {/* Background decorations */}
            <div style={styles.glowOne}></div>
            <div style={styles.glowTwo}></div>

            <div style={styles.card}>

                {/* Brand */}
                <div style={styles.brandWrapper}>
                    <div style={styles.brand}>
                        EF
                    </div>

                    <div style={styles.brandText}>
                        <strong>ExpenseFlow</strong>
                        <span>Personal Finance</span>
                    </div>
                </div>

                {/* Icon */}
                <div style={styles.iconCircle}>
                    {step === 1 && '✉'}
                    {step === 2 && '✓'}
                    {step === 3 && '✓'}
                </div>

                {/* Heading */}
                <h1 style={styles.title}>
                    {step === 1 && 'Forgot your password?'}
                    {step === 2 && 'Verify your identity'}
                    {step === 3 && 'Password updated'}
                </h1>

                <p style={styles.subtitle}>
                    {step === 1 &&
                        'No worries. Enter your email address and we’ll send you a verification code.'}

                    {step === 2 &&
                        `Enter the 6-digit verification code sent to ${f.email}.`}

                    {step === 3 &&
                        'Your account is secure again. You can now continue to ExpenseFlow.'}
                </p>

                {/* Progress */}
                <div style={styles.progressWrapper}>
                    <Step number="1" active={step >= 1} current={step === 1} />
                    <div style={step >= 2 ? styles.progressLineActive : styles.progressLine}></div>
                    <Step number="2" active={step >= 2} current={step === 2} />
                    <div style={step >= 3 ? styles.progressLineActive : styles.progressLine}></div>
                    <Step number="3" active={step >= 3} current={step === 3} />
                </div>

                {/* Messages */}
                {msg && (
                    <div style={styles.success}>
                        <span style={styles.messageIcon}>✓</span>
                        <span>{msg}</span>
                    </div>
                )}

                {err && (
                    <div style={styles.error}>
                        <span style={styles.messageIcon}>!</span>
                        <span>{err}</span>
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={send}>

                        <label style={styles.label}>
                            Email address

                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>@</span>

                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={f.email}
                                    onChange={e =>
                                        setF({
                                            ...f,
                                            email: e.target.value
                                        })
                                    }
                                    style={styles.input}
                                />
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {})
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner}></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send verification code
                                    <span style={styles.arrow}>→</span>
                                </>
                            )}
                        </button>

                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={reset}>

                        <label style={styles.label}>
                            Verification code

                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>#</span>

                                <input
                                    required
                                    pattern="[0-9]{6}"
                                    inputMode="numeric"
                                    maxLength="6"
                                    placeholder="000000"
                                    value={f.otp}
                                    onChange={handleOtp}
                                    style={{
                                        ...styles.input,
                                        letterSpacing: '7px',
                                        fontWeight: '700'
                                    }}
                                />
                            </div>
                        </label>

                        <label style={styles.label}>
                            New password

                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>●</span>

                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    minLength="8"
                                    required
                                    placeholder="Enter a new password"
                                    value={f.newPassword}
                                    onChange={e =>
                                        setF({
                                            ...f,
                                            newPassword: e.target.value
                                        })
                                    }
                                    style={styles.input}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.eyeButton}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </label>

                        <div style={styles.passwordHint}>
                            <span>✓</span>
                            Password must contain at least 8 characters.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {})
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={styles.spinner}></span>
                                    Updating password...
                                </>
                            ) : (
                                <>
                                    Reset password
                                    <span style={styles.arrow}>→</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep(1);
                                setMsg('');
                                setErr('');
                            }}
                            style={styles.secondaryButton}
                        >
                            Use a different email
                        </button>

                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div>

                        <div style={styles.successLarge}>
                            <div style={styles.successIcon}>
                                ✓
                            </div>

                            <h3 style={styles.successTitle}>
                                All set!
                            </h3>

                            <p style={styles.successText}>
                                Your password has been successfully changed.
                            </p>
                        </div>

                        <Link
                            to="/login"
                            style={styles.buttonLink}
                        >
                            Continue to sign in
                            <span style={styles.arrow}>→</span>
                        </Link>

                    </div>
                )}

                {/* Footer */}
                <div style={styles.footer}>

                    <span style={styles.footerText}>
                        Remember your password?
                    </span>

                    <Link
                        to="/login"
                        style={styles.loginLink}
                    >
                        Back to sign in
                    </Link>

                </div>

                {/* Security note */}
                <div style={styles.security}>
                    <span>🔒</span>
                    <span>
                        Your account information is protected and encrypted.
                    </span>
                </div>

            </div>
        </div>
    );
}


/* -------------------------------------------------
   STEP COMPONENT
------------------------------------------------- */

function Step({ number, active, current }) {
    return (
        <div
            style={{
                ...styles.step,
                ...(active ? styles.stepActive : {}),
                ...(current ? styles.stepCurrent : {})
            }}
        >
            {active && Number(number) < 3 && current === false
                ? '✓'
                : number}
        </div>
    );
}


/* -------------------------------------------------
   STYLES
------------------------------------------------- */

const styles = {

    page: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background:
            'linear-gradient(135deg, #f5f7ff 0%, #eef2ff 45%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        boxSizing: 'border-box'
    },

    glowOne: {
        position: 'absolute',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.10)',
        filter: 'blur(70px)',
        top: '-180px',
        right: '-120px'
    },

    glowTwo: {
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.08)',
        filter: 'blur(70px)',
        bottom: '-150px',
        left: '-100px'
    },

    card: {
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255,255,255,0.96)',
        border: '1px solid rgba(226,232,240,0.9)',
        borderRadius: '28px',
        padding: '42px',
        boxSizing: 'border-box',
        boxShadow:
            '0 30px 80px rgba(15,23,42,0.12), 0 8px 25px rgba(15,23,42,0.05)',
        position: 'relative',
        zIndex: 2
    },

    brandWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '34px'
    },

    brand: {
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        fontWeight: '800',
        fontSize: '16px',
        boxShadow: '0 8px 20px rgba(79,70,229,0.28)'
    },

    brandText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },

    iconCircle: {
        width: '62px',
        height: '62px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eef2ff',
        color: '#4f46e5',
        fontSize: '25px',
        fontWeight: '700',
        marginBottom: '22px'
    },

    title: {
        margin: '0 0 10px',
        fontSize: '30px',
        lineHeight: '1.2',
        fontWeight: '800',
        color: '#111827',
        letterSpacing: '-0.7px'
    },

    subtitle: {
        margin: '0 0 28px',
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.7'
    },

    progressWrapper: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '28px'
    },

    step: {
        width: '32px',
        height: '32px',
        minWidth: '32px',
        borderRadius: '50%',
        background: '#f1f5f9',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        transition: 'all 0.2s'
    },

    stepActive: {
        background: '#e0e7ff',
        color: '#4f46e5'
    },

    stepCurrent: {
        background: '#4f46e5',
        color: '#fff',
        boxShadow: '0 5px 14px rgba(79,70,229,0.3)'
    },

    progressLine: {
        height: '3px',
        flex: 1,
        background: '#e2e8f0',
        margin: '0 8px'
    },

    progressLineActive: {
        height: '3px',
        flex: 1,
        background: '#6366f1',
        margin: '0 8px'
    },

    success: {
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        padding: '13px 15px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: '#ecfdf5',
        color: '#047857',
        border: '1px solid #a7f3d0',
        fontSize: '13px',
        lineHeight: '1.5'
    },

    error: {
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        padding: '13px 15px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: '#fef2f2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
        fontSize: '13px',
        lineHeight: '1.5'
    },

    messageIcon: {
        width: '20px',
        height: '20px',
        minWidth: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.7)',
        fontWeight: '800'
    },

    label: {
        display: 'block',
        marginBottom: '18px',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '700'
    },

    inputWrapper: {
        marginTop: '8px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #dbe2ea',
        borderRadius: '13px',
        background: '#fff',
        transition: 'all 0.2s',
        overflow: 'hidden'
    },

    inputIcon: {
        width: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6366f1',
        fontWeight: '800',
        fontSize: '16px'
    },

    input: {
        flex: 1,
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: '0 12px 0 0',
        color: '#111827',
        fontSize: '14px',
        boxSizing: 'border-box'
    },

    eyeButton: {
        border: 'none',
        background: 'transparent',
        color: '#4f46e5',
        fontWeight: '700',
        fontSize: '12px',
        cursor: 'pointer',
        padding: '0 14px'
    },

    button: {
        width: '100%',
        height: '54px',
        border: 'none',
        borderRadius: '13px',
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 10px 25px rgba(79,70,229,0.22)',
        marginTop: '8px'
    },

    buttonDisabled: {
        opacity: 0.7,
        cursor: 'not-allowed'
    },

    arrow: {
        fontSize: '19px',
        lineHeight: 1
    },

    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.4)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        display: 'inline-block'
    },

    secondaryButton: {
        width: '100%',
        marginTop: '10px',
        height: '48px',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        background: '#fff',
        color: '#475569',
        fontWeight: '600',
        cursor: 'pointer'
    },

    passwordHint: {
        fontSize: '12px',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '-7px',
        marginBottom: '18px'
    },

    successLarge: {
        textAlign: 'center',
        padding: '12px 0 25px'
    },

    successIcon: {
        width: '76px',
        height: '76px',
        borderRadius: '50%',
        background: '#ecfdf5',
        color: '#059669',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: '700',
        margin: '0 auto 18px',
        border: '8px solid #f0fdf4'
    },

    successTitle: {
        margin: '0 0 8px',
        color: '#111827',
        fontSize: '20px',
        fontWeight: '800'
    },

    successText: {
        margin: 0,
        color: '#64748b',
        fontSize: '13px',
        lineHeight: '1.6'
    },

    buttonLink: {
        height: '54px',
        width: '100%',
        borderRadius: '13px',
        background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '0 10px 25px rgba(79,70,229,0.22)',
        boxSizing: 'border-box'
    },

    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        marginTop: '28px',
        paddingTop: '24px',
        borderTop: '1px solid #eef2f7',
        fontSize: '13px'
    },

    footerText: {
        color: '#94a3b8'
    },

    loginLink: {
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: '700'
    },

    security: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        color: '#94a3b8',
        fontSize: '11px',
        textAlign: 'center'
    }
};