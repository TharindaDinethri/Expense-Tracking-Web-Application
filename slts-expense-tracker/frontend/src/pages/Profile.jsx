import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {

    const { user, updateUser } = useAuth();

    const fileInputRef = useRef(null);

    const [editing, setEditing] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    const [profilePicture, setProfilePicture] = useState('');

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {

        if (user) {
            setName(user.name || '');
            setAddress(user.address || '');
            setProfilePicture(user.profilePicture || '');
        }

    }, [user]);

    const initials = user?.name
        ? user.name
            .split(' ')
            .map(name => name[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : 'U';

    const handleImageChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError('');
        setMessage('');

        // Maximum 2 MB
        if (file.size > 2 * 1024 * 1024) {

            setError(
                'Profile picture must be smaller than 2 MB.'
            );

            event.target.value = '';
            return;
        }

        // Only allow image files
        if (!file.type.startsWith('image/')) {

            setError(
                'Please select a valid image file.'
            );

            event.target.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {

            setProfilePicture(
                reader.result
            );
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {

        setProfilePicture('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async (event) => {

        event.preventDefault();

        setSaving(true);
        setError('');
        setMessage('');

        try {

            const updatedUser = await api(
                '/auth/profile',
                {
                    method: 'PUT',
                    body: {
                        name,
                        address,
                        profilePicture
                    }
                }
            );

            updateUser(updatedUser);

            setMessage(
                'Profile updated successfully.'
            );

            setEditing(false);

        } catch (err) {

            setError(
                err.message || 'Failed to update profile.'
            );

        } finally {

            setSaving(false);
        }
    };

    const handleCancel = () => {

        setName(user?.name || '');
        setAddress(user?.address || '');
        setProfilePicture(
            user?.profilePicture || ''
        );

        setError('');
        setMessage('');

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setEditing(false);
    };

    return (
        <>
            <style>{`

                .profile-page {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .profile-subtitle {
                    margin-top: 6px;
                    color: #6b7280;
                    font-size: 14px;
                }

                /* Header */

                .profile-header-card {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    padding: 28px;
                    margin-bottom: 20px;
                }

                .profile-avatar-wrapper {
                    position: relative;
                    flex-shrink: 0;
                }

                .profile-avatar-large {
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    font-weight: 700;
                    background: #eef2ff;
                    color: #4f46e5;
                    overflow: hidden;
                    border: 3px solid #e0e7ff;
                }

                .profile-avatar-large img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .camera-button {
                    position: absolute;
                    right: -3px;
                    bottom: -3px;
                    width: 32px;
                    height: 32px;
                    border: 3px solid white;
                    border-radius: 50%;
                    background: #4f46e5;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }

                .profile-header-info {
                    flex: 1;
                }

                .profile-header-info h2 {
                    margin: 0 0 6px;
                    font-size: 24px;
                }

                .profile-email {
                    margin: 0 0 10px;
                    color: #6b7280;
                }

                .profile-status {
                    display: inline-block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #15803d;
                }

                /* Buttons */

                .profile-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .profile-button {
                    border: none;
                    border-radius: 10px;
                    padding: 11px 18px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s ease;
                }

                .profile-button:hover {
                    transform: translateY(-1px);
                }

                .edit-button {
                    background: #4f46e5;
                    color: white;
                }

                .save-button {
                    background: #16a34a;
                    color: white;
                }

                .cancel-button {
                    background: #f3f4f6;
                    color: #374151;
                }

                .remove-button {
                    background: #fee2e2;
                    color: #b91c1c;
                }

                .profile-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Messages */

                .profile-message {
                    padding: 12px 15px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .profile-success {
                    background: #f0fdf4;
                    color: #15803d;
                    border: 1px solid #bbf7d0;
                }

                .profile-error {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }

                /* Personal Information */

                .profile-details {
                    padding: 28px;
                    margin-bottom: 20px;
                }

                .profile-section-header {
                    margin-bottom: 24px;
                }

                .profile-section-header h2,
                .profile-security h2 {
                    margin: 4px 0 0;
                    font-size: 20px;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 18px;
                }

                .profile-info-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 18px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }

                .profile-icon {
                    width: 42px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #f3f4f6;
                    font-size: 18px;
                    flex-shrink: 0;
                }

                .profile-label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: #6b7280;
                }

                .profile-info-item p {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 500;
                    color: #111827;
                    word-break: break-word;
                }

                .account-active {
                    color: #15803d !important;
                }

                /* Edit form */

                .profile-edit-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .profile-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                }

                .profile-form-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                }

                .profile-input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 12px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 10px;
                    font-size: 14px;
                    outline: none;
                    transition: 0.2s ease;
                }

                .profile-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
                }

                .profile-input:disabled {
                    background: #f9fafb;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .profile-picture-edit {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    flex-wrap: wrap;
                }

                .profile-picture-preview {
                    width: 82px;
                    height: 82px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #eef2ff;
                    color: #4f46e5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 700;
                    border: 2px solid #e0e7ff;
                    flex-shrink: 0;
                }

                .profile-picture-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .file-input {
                    display: none;
                }

                .upload-button {
                    display: inline-block;
                    padding: 10px 15px;
                    border-radius: 9px;
                    background: #eef2ff;
                    color: #4338ca;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .upload-button:hover {
                    background: #e0e7ff;
                }

                .profile-picture-help {
                    margin: 0;
                    color: #6b7280;
                    font-size: 12px;
                }

                .edit-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 5px;
                }

                /* Security */

                .profile-security {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 28px;
                    gap: 20px;
                }

                .security-text {
                    max-width: 650px;
                    margin-top: 8px;
                    color: #6b7280;
                    line-height: 1.6;
                }

                .security-badge {
                    padding: 10px 16px;
                    border-radius: 20px;
                    background: #f0fdf4;
                    color: #15803d;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                }

                /* Responsive */

                @media (max-width: 700px) {

                    .profile-header-card {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .profile-grid {
                        grid-template-columns: 1fr;
                    }

                    .profile-security {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .edit-actions {
                        justify-content: flex-start;
                    }
                }

            `}</style>

            <section className="profile-page">

                {/* Page Header */}

                <div className="page-title">

                    <div>

                        <p className="eyebrow">
                            Account
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p className="profile-subtitle">
                            Manage and view your personal account information.
                        </p>

                    </div>

                </div>

                {/* Messages */}

                {message && (
                    <div className="profile-message profile-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="profile-message profile-error">
                        {error}
                    </div>
                )}

                {/* Profile Header */}

                <div className="panel profile-header-card">

                    <div className="profile-avatar-wrapper">

                        <div className="profile-avatar-large">

                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                />
                            ) : (
                                initials
                            )}

                        </div>

                        {editing && (
                            <button
                                type="button"
                                className="camera-button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                title="Change profile picture"
                            >
                                📷
                            </button>
                        )}

                    </div>

                    <div className="profile-header-info">

                        <h2>
                            {user?.name || 'User'}
                        </h2>

                        <p className="profile-email">
                            {user?.email || 'No email available'}
                        </p>

                        <span className="profile-status">
                            ● Active Account
                        </span>

                    </div>

                    <div className="profile-actions">

                        {!editing ? (

                            <button
                                type="button"
                                className="profile-button edit-button"
                                onClick={() => {
                                    setEditing(true);
                                    setMessage('');
                                    setError('');
                                }}
                            >
                                ✏️ Edit Profile
                            </button>

                        ) : (

                            <>
                                <button
                                    type="button"
                                    className="profile-button cancel-button"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    form="profile-edit-form"
                                    className="profile-button save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </button>
                            </>

                        )}

                    </div>

                </div>

                {/* Personal Information */}

                <div className="panel profile-details">

                    <div className="profile-section-header">

                        <p className="eyebrow">
                            Personal Information
                        </p>

                        <h2>
                            Account Details
                        </h2>

                    </div>

                    {editing ? (

                        <form
                            id="profile-edit-form"
                            className="profile-edit-form"
                            onSubmit={handleSave}
                        >

                            {/* Profile Picture */}

                            <div className="profile-form-group">

                                <label>
                                    Profile Picture
                                </label>

                                <div className="profile-picture-edit">

                                    <div className="profile-picture-preview">

                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt="Profile preview"
                                            />
                                        ) : (
                                            initials
                                        )}

                                    </div>

                                    <div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="file-input"
                                            onChange={handleImageChange}
                                        />

                                        <label
                                            className="upload-button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            📷 Choose Image
                                        </label>

                                        {profilePicture && (
                                            <button
                                                type="button"
                                                className="profile-button remove-button"
                                                style={{
                                                    marginLeft: '8px',
                                                    padding: '9px 12px'
                                                }}
                                                onClick={handleRemoveImage}
                                            >
                                                Remove
                                            </button>
                                        )}

                                        <p className="profile-picture-help">
                                            JPG, PNG, GIF or WebP. Maximum 2 MB.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Name */}

                            <div className="profile-form-group">

                                <label htmlFor="profile-name">
                                    Full Name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    className="profile-input"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    maxLength={100}
                                    required
                                />

                            </div>

                            {/* Email */}

                            <div className="profile-form-group">

                                <label htmlFor="profile-email">
                                    Email Address
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    className="profile-input"
                                    value={user?.email || ''}
                                    disabled
                                />

                            </div>

                            {/* Address */}

                            <div className="profile-form-group">

                                <label htmlFor="profile-address">
                                    Address
                                </label>

                                <input
                                    id="profile-address"
                                    type="text"
                                    className="profile-input"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                    maxLength={255}
                                    required
                                />

                            </div>

                        </form>

                    ) : (

                        <div className="profile-grid">

                            {/* Full Name */}

                            <div className="profile-info-item">

                                <div className="profile-icon">
                                    👤
                                </div>

                                <div>

                                    <span className="profile-label">
                                        Full Name
                                    </span>

                                    <p>
                                        {user?.name || 'Not provided'}
                                    </p>

                                </div>

                            </div>

                            {/* Email */}

                            <div className="profile-info-item">

                                <div className="profile-icon">
                                    ✉
                                </div>

                                <div>

                                    <span className="profile-label">
                                        Email Address
                                    </span>

                                    <p>
                                        {user?.email || 'Not provided'}
                                    </p>

                                </div>

                            </div>

                            {/* Address */}

                            <div className="profile-info-item">

                                <div className="profile-icon">
                                    📍
                                </div>

                                <div>

                                    <span className="profile-label">
                                        Address
                                    </span>

                                    <p>
                                        {user?.address || 'Not provided'}
                                    </p>

                                </div>

                            </div>

                            {/* Account Status */}

                            <div className="profile-info-item">

                                <div className="profile-icon">
                                    ✓
                                </div>

                                <div>

                                    <span className="profile-label">
                                        Account Status
                                    </span>

                                    <p className="account-active">
                                        Active
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* Security */}

                <div className="panel profile-security">

                    <div>

                        <p className="eyebrow">
                            Security
                        </p>

                        <h2>
                            Account Security
                        </h2>

                        <p className="security-text">
                            Your account is protected using secure
                            authentication. Your password is encrypted
                            and is never displayed here.
                        </p>

                    </div>

                    <div className="security-badge">
                        🔒 Secure Account
                    </div>

                </div>

            </section>
        </>
    );
}