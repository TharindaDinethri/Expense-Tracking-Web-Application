import { useEffect, useState } from 'react';
import {
    Plus,
    Receipt,
    Pencil,
    Trash2,
    X,
    CalendarDays,
    Tag,
    FileText,
    Wallet
} from 'lucide-react';

import { api } from '../services/api';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';

const blank = {
    title: '',
    category: 'FOOD',
    amount: '',
    transactionDate: new Date().toISOString().slice(0, 10),
    note: ''
};

const categories = [
    'FOOD',
    'TRANSPORT',
    'BILLS',
    'SHOPPING',
    'ENTERTAINMENT',
    'OTHER'
];

export default function Expenses() {

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(blank);
    const [edit, setEdit] = useState(null);
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            setErr('');

            const data = await api('/expenses');
            setItems(data);

        } catch (x) {
            setErr(x.message || 'Unable to load expenses.');

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openAdd = () => {
        setForm({
            ...blank,
            transactionDate: new Date().toISOString().slice(0, 10)
        });

        setEdit(null);
        setErr('');
        setOpen(true);
    };

    const openEdit = (expense) => {

        setEdit(expense.id);

        setForm({
            title: expense.title || '',
            category: expense.category || 'FOOD',
            amount: expense.amount ?? '',
            transactionDate:
                expense.transactionDate ||
                new Date().toISOString().slice(0, 10),
            note: expense.note || ''
        });

        setErr('');
        setOpen(true);
    };

    const closeModal = () => {

        if (saving) return;

        setOpen(false);
        setEdit(null);
        setForm(blank);
    };

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

                await api('/expenses/' + edit, {
                    method: 'PUT',
                    body
                });

            } else {

                await api('/expenses', {
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
                'Something went wrong while saving the expense.'
            );

        } finally {
            setSaving(false);
        }
    };

    const remove = async (id) => {

        if (!confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {

            setErr('');

            await api('/expenses/' + id, {
                method: 'DELETE'
            });

            await load();

        } catch (x) {

            setErr(
                x.message ||
                'Unable to delete this expense.'
            );
        }
    };

    const totalExpenses = items.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
    );

    return (
        <section className="expenses-page">

            {/* ================= HEADER ================= */}

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
                                background: 'rgba(239, 68, 68, 0.10)',
                                color: '#ef4444'
                            }}
                        >
                            <Receipt size={19} />
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
                        Expenses
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: '#718096',
                            fontSize: '14px'
                        }}
                    >
                        Manage and keep track of your spending.
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
                    Add expense
                </button>

            </div>


            {/* ================= ERROR ================= */}

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
                    <span>{err}</span>

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


            {/* ================= SUMMARY ================= */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                }}
            >

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
                            background: 'rgba(239, 68, 68, 0.10)',
                            color: '#ef4444'
                        }}
                    >
                        <Wallet size={21} />
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
                            Total cost
                        </span>

                        <strong
                            style={{
                                fontSize: '21px'
                            }}
                        >
                            Rs. {money(totalExpenses)}
                        </strong>

                    </div>

                </div>


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
                            background: 'rgba(99, 102, 241, 0.10)',
                            color: '#6366f1'
                        }}
                    >
                        <Receipt size={21} />
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
                            Transactions
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


            {/* ================= TABLE ================= */}

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
                            <Receipt size={18} />
                            Expense history
                        </h3>

                        <p>
                            Your recorded expenses and transactions
                        </p>

                    </div>
                    
                </div>


                {loading ? (

                    <div
                        style={{
                            padding: '55px 20px',
                            textAlign: 'center',
                            color: '#718096'
                        }}
                    >
                        Loading your expenses...
                    </div>

                ) : items.length === 0 ? (

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
                            <Receipt size={27} />
                        </div>

                        <h3
                            style={{
                                marginBottom: '7px'
                            }}
                        >
                            No expenses yet
                        </h3>

                        <p
                            style={{
                                color: '#718096',
                                marginBottom: '20px'
                            }}
                        >
                            Start recording your expenses to see
                            them here.
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
                            Add your first expense
                        </button>

                    </div>

                ) : (

                    <TransactionTable
                        items={items}
                        type="expense"
                        onEdit={openEdit}
                        onDelete={remove}
                    />

                )}

            </div>


            {/* ================= ADD / EDIT MODAL ================= */}

            {open && (

                <Modal
                    title={
                        edit
                            ? 'Edit expense'
                            : 'Add new expense'
                    }
                    onClose={closeModal}
                >

                    <form
                        onSubmit={save}
                        className="form-grid"
                    >

                        {/* TITLE */}

                        <label>

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <FileText size={14} />
                                Expense title
                            </span>

                            <input
                                required
                                maxLength="100"
                                placeholder="e.g. Grocery shopping"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title: e.target.value
                                    })
                                }
                            />

                        </label>


                        {/* CATEGORY */}

                        <label>

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Tag size={14} />
                                Category
                            </span>

                            <select
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value
                                    })
                                }
                            >

                                {categories.map(category => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {formatCategory(category)}
                                    </option>

                                ))}

                            </select>

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


                        {/* DATE */}

                        <label>

                            <span
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <CalendarDays size={14} />
                                Transaction date
                            </span>

                            <input
                                type="date"
                                required
                                value={form.transactionDate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        transactionDate:
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
                                        note: e.target.value
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


                        {/* ACTIONS */}

                        <div
                            className="span2"
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                marginTop: '5px'
                            }}
                        >

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                style={{
                                    padding: '11px 17px',
                                    border: '1px solid #e2e8f0',
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
                                        ? 'Update expense'
                                        : 'Save expense'
                                }

                            </button>

                        </div>

                    </form>

                </Modal>
            )}

        </section>
    );
}


/* ================= HELPERS ================= */

function formatCategory(category) {

    return category
        .toLowerCase()
        .replace('_', ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}


function money(value) {

    return Number(value || 0).toLocaleString(
        'en-LK',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}