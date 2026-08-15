import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {

    const { register } = useAuth();
    const nav = useNavigate();

    const [f, setF] = useState({
        name: '',
        email: '',
        address: '',
        password: ''
    });

    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const submit = async e => {

        e.preventDefault();

        setErr('');
        setLoading(true);

        try {

            await register(f);

            nav('/');

        } catch (x) {

            setErr(x.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div style={styles.page}>

            {/* Background decoration */}
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


                {/* Header */}
                <div style={styles.header}>

                    <div style={styles.iconCircle}>
                        +
                    </div>

                    <h1 style={styles.title}>
                        Create your account
                    </h1>

                    <p style={styles.subtitle}>
                        Join ExpenseFlow and take control of your
                        personal finances.
                    </p>

                </div>


                {/* Error */}
                {err && (
                    <div style={styles.error}>

                        <span style={styles.errorIcon}>
                            !
                        </span>

                        <span>
                            {err}
                        </span>

                    </div>
                )}


                {/* Form */}
                <form onSubmit={submit}>

                    {/* Full name */}
                    <label style={styles.label}>

                        Full name

                        <div style={styles.inputWrapper}>

                            <span style={styles.inputIcon}>
                                ◉
                            </span>

                            <input
                                type="text"
                                required
                                autoComplete="name"
                                placeholder="Enter your full name"
                                value={f.name}
                                onChange={e =>
                                    setF({
                                        ...f,
                                        name: e.target.value
                                    })
                                }
                                style={styles.input}
                            />

                        </div>

                    </label>


                    {/* Email */}
                    <label style={styles.label}>

                        Email address

                        <div style={styles.inputWrapper}>

                            <span style={styles.inputIcon}>
                                @
                            </span>

                            <input
                                type="email"
                                required
                                autoComplete="email"
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


                    {/* Address */}
                    <label style={styles.label}>

                        Address

                        <div style={styles.inputWrapper}>

                            <span style={styles.inputIcon}>
                                ⌖
                            </span>

                            <input
                                type="text"
                                required
                                autoComplete="street-address"
                                placeholder="Enter your address"
                                value={f.address}
                                onChange={e =>
                                    setF({
                                        ...f,
                                        address: e.target.value
                                    })
                                }
                                style={styles.input}
                            />

                        </div>

                    </label>


                    {/* Password */}
                    <label style={styles.label}>

                        Password

                        <div style={styles.inputWrapper}>

                            <span style={styles.inputIcon}>
                                ●
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                minLength="8"
                                required
                                autoComplete="new-password"
                                placeholder="Create a secure password"
                                value={f.password}
                                onChange={e =>
                                    setF({
                                        ...f,
                                        password: e.target.value
                                    })
                                }
                                style={styles.input}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                style={styles.showButton}
                            >
                                {showPassword
                                    ? 'Hide'
                                    : 'Show'}
                            </button>

                        </div>

                    </label>


                    {/* Password requirement */}
                    <div style={styles.passwordHint}>

                        <span
                            style={
                                f.password.length >= 8
                                    ? styles.checkActive
                                    : styles.check
                            }
                        >
                            ✓
                        </span>

                        At least 8 characters

                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading
                                ? styles.buttonDisabled
                                : {})
                        }}
                    >

                        {loading ? (
                            <>
                                <span
                                    style={styles.spinner}
                                ></span>

                                Creating account...
                            </>
                        ) : (
                            <>
                                Create account

                                <span
                                    style={styles.arrow}
                                >
                                    →
                                </span>
                            </>
                        )}

                    </button>

                </form>


                {/* Login */}
                <div style={styles.footer}>

                    <span style={styles.footerText}>
                        Already have an account?
                    </span>

                    <Link
                        to="/login"
                        style={styles.loginLink}
                    >
                        Sign in
                    </Link>

                </div>


                {/* Security */}
                <div style={styles.security}>

                    <span>
                        🔒
                    </span>

                    <span>
                        Your personal information is securely protected.
                    </span>

                </div>

            </div>

        </div>
    );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

    page: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '35px 20px',
        boxSizing: 'border-box',
        background:
            'linear-gradient(135deg, #f5f7ff 0%, #eef2ff 45%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },


    /* Background glow */

    glowOne: {
        position: 'absolute',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background:
            'rgba(99, 102, 241, 0.10)',
        filter: 'blur(75px)',
        top: '-180px',
        right: '-120px'
    },

    glowTwo: {
        position: 'absolute',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background:
            'rgba(59, 130, 246, 0.08)',
        filter: 'blur(75px)',
        bottom: '-160px',
        left: '-120px'
    },


    /* Main card */

    card: {
        width: '100%',
        maxWidth: '520px',
        padding: '38px 42px',
        boxSizing: 'border-box',
        background:
            'rgba(255, 255, 255, 0.97)',
        border:
            '1px solid rgba(226, 232, 240, 0.9)',
        borderRadius: '28px',
        boxShadow:
            '0 30px 80px rgba(15, 23, 42, 0.12), 0 8px 25px rgba(15, 23, 42, 0.05)',
        position: 'relative',
        zIndex: 2
    },


    /* Brand */

    brandWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '30px'
    },

    brand: {
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
            'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        fontWeight: '800',
        fontSize: '16px',
        boxShadow:
            '0 8px 20px rgba(79, 70, 229, 0.28)'
    },

    brandText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },


    /* Header */

    header: {
        marginBottom: '25px'
    },

    iconCircle: {
        width: '56px',
        height: '56px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eef2ff',
        color: '#4f46e5',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '18px'
    },

    title: {
        margin: '0 0 9px',
        fontSize: '30px',
        lineHeight: '1.2',
        fontWeight: '800',
        letterSpacing: '-0.7px',
        color: '#111827'
    },

    subtitle: {
        margin: 0,
        color: '#64748b',
        fontSize: '14px',
        lineHeight: '1.65'
    },


    /* Error */

    error: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '13px 15px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#b91c1c',
        fontSize: '13px',
        lineHeight: '1.5'
    },

    errorIcon: {
        width: '20px',
        height: '20px',
        minWidth: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee2e2',
        fontWeight: '800'
    },


    /* Labels */

    label: {
        display: 'block',
        marginBottom: '17px',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '700'
    },


    /* Input */

    inputWrapper: {
        width: '100%',
        height: '51px',
        display: 'flex',
        alignItems: 'center',
        marginTop: '8px',
        border: '1px solid #dbe2ea',
        borderRadius: '13px',
        background: '#fff',
        boxSizing: 'border-box',
        overflow: 'hidden'
    },

    inputIcon: {
        width: '44px',
        minWidth: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6366f1',
        fontSize: '15px',
        fontWeight: '800'
    },

    input: {
        flex: 1,
        minWidth: 0,
        height: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        padding: '0 12px 0 0',
        color: '#111827',
        fontSize: '14px',
        boxSizing: 'border-box'
    },

    showButton: {
        border: 'none',
        background: 'transparent',
        color: '#4f46e5',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        padding: '0 14px'
    },


    /* Password requirement */

    passwordHint: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        marginTop: '-7px',
        marginBottom: '18px',
        color: '#64748b',
        fontSize: '12px'
    },

    check: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f5f9',
        color: '#94a3b8',
        fontSize: '11px',
        fontWeight: '800'
    },

    checkActive: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#dcfce7',
        color: '#16a34a',
        fontSize: '11px',
        fontWeight: '800'
    },


    /* Submit */

    button: {
        width: '100%',
        height: '54px',
        border: 'none',
        borderRadius: '13px',
        background:
            'linear-gradient(135deg, #4f46e5, #6366f1)',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow:
            '0 10px 25px rgba(79, 70, 229, 0.22)',
        marginTop: '5px'
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
        borderRadius: '50%',
        border:
            '2px solid rgba(255,255,255,0.4)',
        borderTop:
            '2px solid #ffffff',
        display: 'inline-block'
    },


    /* Footer */

    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '25px',
        paddingTop: '23px',
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


    /* Security */

    security: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        marginTop: '18px',
        color: '#94a3b8',
        fontSize: '11px',
        textAlign: 'center'
    }

};