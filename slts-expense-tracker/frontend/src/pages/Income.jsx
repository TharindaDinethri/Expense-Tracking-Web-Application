import { useEffect, useState } from 'react';
import {
    Plus,
    WalletCards,
    Pencil,
    Trash2,
    X,
    CalendarDays,
    FileText,
    TrendingUp
} from 'lucide-react';

import { api } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';

const blank = {
    source: '',
    amount: '',
    receivedDate: new Date().toISOString().slice(0, 10),
    note: ''
};

export default function Income() {

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(blank);
    const [edit, setEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /* ================= LOAD INCOME ================= */

    const load = async () => {

        try {

            setLoading(true);
            setErr('');

            const data = await api('/incomes');

            setItems(data);

        } catch (x) {

            setErr(
                x.message ||
                'Unable to load your income records.'
            );

        } finally {

            setLoading(false);

        }
    };

    // IMPORTANT:
    // Do not use useEffect(load, [])
    useEffect(() => {
        load();
    }, []);


    /* ================= OPEN ADD ================= */

    const openAdd = () => {

        setForm({
            ...blank,
            receivedDate:
                new Date().toISOString().slice(0, 10)
        });

        setEdit(null);
        setErr('');
        setOpen(true);
    };


    /* ================= OPEN EDIT ================= */

    const openEdit = (income) => {

        setEdit(income.id);

        setForm({
            source: income.source || '',
            amount: income.amount ?? '',
            receivedDate:
                income.receivedDate ||
                new Date().toISOString().slice(0, 10),
            note: income.note || ''
        });

        setErr('');
        setOpen(true);
    };


    /* ================= CLOSE MODAL ================= */

    const closeModal = () => {

        if (saving) return;

        setOpen(false);
        setEdit(null);
        setForm(blank);
    };


    /* ================= SAVE ================= */

    const save = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setErr('');

            if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) {
                setErr('Amount can have a maximum of 2 decimal places.');
                return;
            }

            const body = {
                ...form,
                amount: Number(form.amount)
            };

            if (edit) {

                await api('/incomes/' + edit, {
                    method: 'PUT',
                    body
                });

            } else {

                await api('/incomes', {
                    method: 'POST',
                    body
                });

            }

            setOpen(false);
            setEdit(null);
            setForm(blank);

            await load();

        } catch (x) {

            setErr(
                x.message ||
                'Something went wrong while saving the income.'
            );

        } finally {

            setSaving(false);

        }
    };


    /* ================= DELETE ================= */

    const remove = async (id) => {

        if (
            !confirm(
                'Are you sure you want to delete this income record?'
            )
        ) {
            return;
        }

        try {

            setErr('');

            await api('/incomes/' + id, {
                method: 'DELETE'
            });

            await load();

        } catch (x) {

            setErr(
                x.message ||
                'Unable to delete this income record.'
            );
        }
    };


    /* ================= CALCULATIONS ================= */

    const totalIncome = items.reduce(
        (sum, item) =>
            sum + Number(item.amount || 0),
        0
    );


    /* ================= UI ================= */

    return (
        <section className="income-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '28px',
                    flexWrap: 'wrap'
                }}
            >

                <div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '7px'
                        }}
                    >

                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background:
                                    'rgba(16, 185, 129, 0.10)',
                                color: '#10b981'
                            }}
                        >
                            <TrendingUp size={19} />
                        </div>

                        <p className="eyebrow">
                            Transactions
                        </p>

                    </div>

                    <h1
                        style={{
                            marginBottom: '6px'
                        }}
                    >
                        Income
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: '#718096',
                            fontSize: '14px'
                        }}
                    >
                        Manage and keep track of your earnings.
                    </p>

                </div>


                <button
                    className="primary"
                    onClick={openAdd}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 18px'
                    }}
                >
                    <Plus size={18} />
                    Add income
                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {err && (

                <div
                    className="error"
                    style={{
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >

                    <span>
                        {err}
                    </span>

                    <button
                        type="button"
                        onClick={() => setErr('')}
                        style={{
                            marginLeft: 'auto',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={17} />
                    </button>

                </div>

            )}


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}
            >

                {/* TOTAL INCOME */}

                <div
                    className="panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}
                >

                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'rgba(16, 185, 129, 0.10)',
                            color: '#10b981'
                        }}
                    >
                        <WalletCards size={21} />
                    </div>

                    <div>

                        <span
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#718096',
                                marginBottom: '4px'
                            }}
                        >
                            Total income
                        </span>

                        <strong
                            style={{
                                fontSize: '21px'
                            }}
                        >
                            Rs. {money(totalIncome)}
                        </strong>

                    </div>

                </div>


                {/* RECORD COUNT */}

                <div
                    className="panel"
                    style={{
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}
                >

                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background:
                                'rgba(99, 102, 241, 0.10)',
                            color: '#6366f1'
                        }}
                    >
                        <TrendingUp size={21} />
                    </div>

                    <div>

                        <span
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                color: '#718096',
                                marginBottom: '4px'
                            }}
                        >
                            Income records
                        </span>

                        <strong
                            style={{
                                fontSize: '21px'
                            }}
                        >
                            {items.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
                INCOME HISTORY
            ================================================== */}

            <div
                className="panel"
                style={{
                    overflow: 'hidden'
                }}
            >

                <div
                    className="panel-head"
                    style={{
                        paddingBottom: '18px'
                    }}
                >

                    <div>

                        <h3
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <WalletCards size={18} />
                            Income history
                        </h3>

                        <p>
                            Your recorded income and earnings
                        </p>

                    </div>
                   
                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div
                        style={{
                            padding: '55px 20px',
                            textAlign: 'center',
                            color: '#718096'
                        }}
                    >
                        Loading your income records...
                    </div>

                ) : items.length === 0 ? (

                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div
                        style={{
                            padding: '60px 20px',
                            textAlign: 'center'
                        }}
                    >

                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                margin: '0 auto 15px',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f5f7fb',
                                color: '#94a3b8'
                            }}
                        >
                            <WalletCards size={27} />
                        </div>

                        <h3
                            style={{
                                marginBottom: '7px'
                            }}
                        >
                            No income recorded yet
                        </h3>

                        <p
                            style={{
                                color: '#718096',
                                marginBottom: '20px'
                            }}
                        >
                            Start adding your income sources
                            to keep your finances organized.
                        </p>

                        <button
                            className="primary"
                            onClick={openAdd}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '7px'
                            }}
                        >
                            <Plus size={17} />
                            Add your first income
                        </button>

                    </div>

                ) : (

                    /* ==================================================
                       TABLE
                    ================================================== */

                    <TransactionTable
                        items={items}
                        type="income"
                        onEdit={openEdit}
                        onDelete={remove}
                    />

                )}

            </div>


            {/* ==================================================
                ADD / EDIT MODAL
            ================================================== */}

            {open && (

                <Modal
                    title={
                        edit
                            ? 'Edit income'
                            : 'Add new income'
                    }
                    onClose={closeModal}
                >

                    <form
                        onSubmit={save}
                        className="form-grid"
                    >

                        {/* SOURCE */}

                        <label>

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <WalletCards size={14} />
                                Income source
                            </span>

                            <input
                                required
                                maxLength="100"
                                placeholder="e.g. Monthly salary"
                                value={form.source}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        source:
                                            e.target.value
                                    })
                                }
                            />

                        </label>


                        {/* AMOUNT */}

                        <label>

                            <span>
                                Amount
                            </span>

                            <div
                                style={{
                                    position: 'relative'
                                }}
                            >

                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform:
                                            'translateY(-50%)',
                                        color: '#718096',
                                        fontSize: '14px'
                                    }}
                                >
                                    Rs.
                                </span>

                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Allow only numbers with maximum 2 decimal places
                                        if (/^\d*(\.\d{0,2})?$/.test(value)) {
                                            setForm({
                                                ...form,
                                                amount: value
                                            });
                                        }
                                    }}
                                    
                                    style={{
                                        paddingLeft: '38px'
                                    }}
                                />

                            </div>

                        </label>


                        {/* RECEIVED DATE */}

                        <label>

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <CalendarDays size={14} />
                                Received date
                            </span>

                            <input
                                type="date"
                                required
                                value={
                                    form.receivedDate
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        receivedDate:
                                            e.target.value
                                    })
                                }
                            />

                        </label>


                        {/* NOTE */}

                        <label className="span2">

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <FileText size={14} />
                                Note
                            </span>

                            <textarea
                                maxLength="500"
                                rows="4"
                                placeholder="Add an optional note..."
                                value={form.note}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        note:
                                            e.target.value
                                    })
                                }
                            />

                            <small
                                style={{
                                    color: '#98a2b3',
                                    textAlign: 'right',
                                    display: 'block',
                                    marginTop: '4px'
                                }}
                            >
                                {form.note.length}/500
                            </small>

                        </label>


                        {/* ACTION BUTTONS */}

                        <div
                            className="span2"
                            style={{
                                display: 'flex',
                                justifyContent:
                                    'flex-end',
                                gap: '10px',
                                marginTop: '5px'
                            }}
                        >

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                style={{
                                    padding:
                                        '11px 17px',
                                    border:
                                        '1px solid #e2e8f0',
                                    borderRadius: '9px',
                                    background: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary"
                                disabled={saving}
                                style={{
                                    minWidth: '145px'
                                }}
                            >

                                {saving
                                    ? 'Saving...'
                                    : edit
                                        ? 'Update income'
                                        : 'Save income'
                                }

                            </button>

                        </div>

                    </form>

                </Modal>

            )}

        </section>
    );
}


/* ============================================================
   HELPER
============================================================ */

function money(value) {

    return Number(value || 0).toLocaleString(
        'en-LK',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}