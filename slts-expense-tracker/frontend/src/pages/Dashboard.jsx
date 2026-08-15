import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
    ArrowUpRight,
    ArrowDownRight,
    WalletCards,
    TrendingUp,
    TrendingDown,
    CalendarDays,
    ReceiptText,
    Sparkles
} from 'lucide-react';

export default function Dashboard() {
    const now = new Date();

    const [d, setD] = useState(null);
    const [error, setError] = useState('');

    const [month, setMonth] = useState(
        now.toISOString().slice(0, 7)
    );

    const load = async () => {
        try {
            setError('');

            const [year, m] = month.split('-');

            const data = await api(
                `/dashboard?year=${year}&month=${Number(m)}`
            );

            setD(data);
        } catch (x) {
            setError(x.message || 'Unable to load dashboard.');
        }
    };

    useEffect(() => {
        load();
    }, [month]);

    if (error) {
        return (
            <>
                <style>{dashboardStyles}</style>

                <section className="premium-dashboard">
                    <div className="dashboard-error">
                        <div className="error-icon">!</div>
                        <h2>Unable to load dashboard</h2>
                        <p>{error}</p>

                        <button
                            className="dashboard-retry"
                            onClick={load}
                        >
                            Try again
                        </button>
                    </div>
                </section>
            </>
        );
    }

    if (!d) {
        return (
            <>
                <style>{dashboardStyles}</style>

                <section className="premium-dashboard">
                    <div className="dashboard-loading">
                        <div className="loading-orb">
                            <WalletCards size={24} />
                        </div>

                        <h2>Preparing your dashboard</h2>
                        <p>Loading your latest financial overview...</p>
                    </div>
                </section>
            </>
        );
    }

    const balance = Number(d.currentBalance || 0);
    const income = Number(d.totalIncome || 0);
    const expenses = Number(d.totalExpenses || 0);

    const expensePercentage =
        income > 0
            ? Math.min((expenses / income) * 100, 100)
            : 0;

    return (
        <>
            <style>{dashboardStyles}</style>

            <section className="premium-dashboard">

                {/* HEADER */}
                <div className="dashboard-header">

                    <div>
                        <div className="dashboard-eyebrow">
                            <Sparkles size={14} />
                            Financial overview
                        </div>

                        <h1>Dashboard</h1>

                        <p>
                            Here's your financial activity at a glance.
                        </p>
                    </div>

                    <div className="month-selector">
                        <CalendarDays size={17} />

                        <input
                            type="month"
                            value={month}
                            onChange={e =>
                                setMonth(e.target.value)
                            }
                        />
                    </div>

                </div>


                {/* SUMMARY CARDS */}
                <div className="premium-cards">

                    <SummaryCard
                        title="Total income"
                        value={income}
                        icon={ArrowUpRight}
                        iconClass="income-icon"
                        cardClass="income-card"
                        subtitle="All recorded income"
                    />

                    <SummaryCard
                        title="Total expenses"
                        value={expenses}
                        icon={ArrowDownRight}
                        iconClass="expense-icon"
                        cardClass="expense-card"
                        subtitle="All recorded expenses"
                    />

                    <SummaryCard
                        title="Current balance"
                        value={balance}
                        icon={WalletCards}
                        iconClass="balance-icon"
                        cardClass="balance-card"
                        subtitle="Income - Expenses"
                    />

                </div>


                {/* MAIN GRID */}
                <div className="dashboard-grid">

                    {/* MONTHLY PERFORMANCE */}
                    <div className="premium-panel performance-panel">

                        <div className="panel-top">

                            <div>
                                <div className="panel-icon">
                                    <TrendingUp size={18} />
                                </div>

                                <div>
                                    <h3>
                                        Monthly performance
                                    </h3>

                                    <p>
                                        Financial activity for the selected month
                                    </p>
                                </div>
                            </div>

                            <span className="period-badge">
                                {formatMonth(month)}
                            </span>

                        </div>


                        <div className="performance-values">

                            <div className="performance-item">

                                <div className="performance-label">
                                    <span className="dot income-dot"></span>
                                    Income
                                </div>

                                <strong className="income-text">
                                    + {money(d.monthlyIncome)}
                                </strong>

                            </div>


                            <div className="performance-item">

                                <div className="performance-label">
                                    <span className="dot expense-dot"></span>
                                    Expenses
                                </div>

                                <strong className="expense-text">
                                    - {money(d.monthlyExpenses)}
                                </strong>

                            </div>

                        </div>


                        {/* PROGRESS */}
                        <div className="expense-progress">

                            <div className="progress-header">
                                <span>Expense ratio</span>

                                <strong>
                                    {expensePercentage.toFixed(0)}%
                                </strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-value"
                                    style={{
                                        width: `${expensePercentage}%`
                                    }}
                                />
                            </div>

                            <p>
                                {expensePercentage <= 50
                                    ? 'Your expenses are currently well below your income.'
                                    : expensePercentage <= 80
                                        ? 'Keep an eye on your spending this month.'
                                        : 'Your expenses are taking up most of your income.'}
                            </p>

                        </div>


                        {/* HIGHEST CATEGORY */}
                        <div className="category-highlight">

                            <div className="category-left">

                                <div className="category-icon">
                                    <ReceiptText size={18} />
                                </div>

                                <div>
                                    <span>
                                        Highest expense category
                                    </span>

                                    <strong>
                                        {d.highestExpenseCategory || 'No data'}
                                    </strong>
                                </div>

                            </div>

                            <strong className="category-amount">
                                {money(
                                    d.highestExpenseCategoryTotal?.total || 0
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* LATEST TRANSACTIONS */}
                    <div className="premium-panel transactions-panel">

                        <div className="panel-top">

                            <div>
                                <div className="panel-icon">
                                    <ReceiptText size={18} />
                                </div>

                                <div>
                                    <h3>
                                        Latest transactions
                                    </h3>

                                    <p>
                                        Your five most recent records
                                    </p>
                                </div>
                            </div>

                        </div>


                        <div className="transaction-list">

                            {d.latestTransactions?.length ? (

                                d.latestTransactions.map(x => (

                                    <div
                                        className="transaction-row"
                                        key={x.type + x.id}
                                    >

                                        <div
                                            className={
                                                'transaction-type ' +
                                                (
                                                    x.type === 'INCOME'
                                                        ? 'transaction-income'
                                                        : 'transaction-expense'
                                                )
                                            }
                                        >
                                            {x.type === 'INCOME'
                                                ? <ArrowUpRight size={17} />
                                                : <ArrowDownRight size={17} />
                                            }
                                        </div>


                                        <div className="transaction-info">

                                            <strong>
                                                {x.title}
                                            </strong>

                                            <span>
                                                {x.date}
                                                <span className="separator">
                                                    •
                                                </span>
                                                {x.categoryOrSource}
                                            </span>

                                        </div>


                                        <strong
                                            className={
                                                x.type === 'INCOME'
                                                    ? 'transaction-amount income-text'
                                                    : 'transaction-amount expense-text'
                                            }
                                        >
                                            {x.type === 'INCOME'
                                                ? '+'
                                                : '-'
                                            }{' '}
                                            {money(x.amount)}
                                        </strong>

                                    </div>

                                ))

                            ) : (

                                <div className="empty-transactions">

                                    <div className="empty-icon">
                                        <ReceiptText size={22} />
                                    </div>

                                    <strong>
                                        No transactions yet
                                    </strong>

                                    <span>
                                        Your latest transactions will appear here.
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* BOTTOM INSIGHT */}
                <div className="dashboard-insight">

                    <div className="insight-icon">
                        <Sparkles size={19} />
                    </div>

                    <div>
                        <strong>
                            Financial snapshot
                        </strong>

                        <p>
                            {balance >= 0
                                ? `You currently have ${money(balance)} available after recorded income and expenses.`
                                : `Your recorded expenses are currently higher than your income by ${money(Math.abs(balance))}.`
                            }
                        </p>
                    </div>

                </div>

            </section>
        </>
    );
}


/* =========================
   SUMMARY CARD
========================= */

function SummaryCard({
    title,
    value,
    icon: Icon,
    iconClass,
    cardClass,
    subtitle
}) {
    return (
        <div className={`premium-summary-card ${cardClass}`}>

            <div className="summary-card-top">

                <div className={`summary-card-icon ${iconClass}`}>
                    <Icon size={20} />
                </div>

                <span className="summary-card-label">
                    {title}
                </span>

            </div>

            <div className="summary-card-value">
                <span className="currency">Rs.</span>{' '}
                {money(value)}
            </div>

            <div className="summary-card-bottom">
                <span>{subtitle}</span>
            </div>

        </div>
    );
}


/* =========================
   HELPERS
========================= */

function money(v) {
    return Number(v || 0).toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}

function formatMonth(value) {
    const [year, month] = value.split('-');

    const date = new Date(
        Number(year),
        Number(month) - 1
    );

    return date.toLocaleDateString(
        undefined,
        {
            month: 'long',
            year: 'numeric'
        }
    );
}


/* =========================
   COMPONENT CSS
========================= */

const dashboardStyles = `

.premium-dashboard {
    width: 100%;
    max-width: 1450px;
    margin: 0 auto;
    padding: 8px 4px 40px;
    color: #172033;
}

.currency {
    font-size: 0.55em;
    font-weight: 700;
    color: #7b8494;
    vertical-align: middle;
    letter-spacing: 0;
}

/* HEADER */

.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 28px;
}

.dashboard-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .09em;
    color: #697386;
    margin-bottom: 8px;
}

.dashboard-header h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 38px);
    line-height: 1.1;
    letter-spacing: -1.2px;
    font-weight: 800;
}

.dashboard-header p {
    margin: 9px 0 0;
    color: #7b8494;
    font-size: 14px;
}

.month-selector {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 14px;
    background: #ffffff;
    border: 1px solid #e7eaf0;
    border-radius: 13px;
    box-shadow: 0 6px 20px rgba(20, 30, 55, .05);
    color: #657084;
}

.month-selector input {
    border: none;
    outline: none;
    background: transparent;
    color: #172033;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}


/* SUMMARY CARDS */

.premium-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 20px;
}

.premium-summary-card {
    position: relative;
    overflow: hidden;
    padding: 23px;
    min-height: 160px;
    border-radius: 18px;
    background: #ffffff;
    border: 1px solid #e9ecf2;
    box-shadow: 0 8px 30px rgba(20, 30, 55, .055);
}

.premium-summary-card::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 100px;
    right: -35px;
    bottom: -40px;
    border-radius: 50%;
    background: rgba(100, 110, 130, .035);
}

.summary-card-top {
    display: flex;
    align-items: center;
    gap: 11px;
}

.summary-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.income-icon {
    background: #e9f9f1;
    color: #15966a;
}

.expense-icon {
    background: #fff0f0;
    color: #dc5757;
}

.balance-icon {
    background: #eef2ff;
    color: #5968d9;
}

.summary-card-label {
    color: #6d7687;
    font-size: 13px;
    font-weight: 600;
}

.summary-card-value {
    margin-top: 18px;
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 800;
    letter-spacing: -.8px;
    color: #172033;
}

.summary-card-bottom {
    margin-top: 6px;
    color: #9aa2b0;
    font-size: 12px;
}


/* MAIN GRID */

.dashboard-grid {
    display: grid;
    grid-template-columns: 1.08fr .92fr;
    gap: 20px;
}

.premium-panel {
    background: #ffffff;
    border: 1px solid #e9ecf2;
    border-radius: 18px;
    box-shadow: 0 8px 30px rgba(20, 30, 55, .055);
    overflow: hidden;
}

.panel-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    padding: 22px 23px;
    border-bottom: 1px solid #f0f2f5;
}

.panel-top > div:first-child {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.panel-icon {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f4ff;
    color: #5968d9;
}

.panel-top h3 {
    margin: 1px 0 4px;
    font-size: 15px;
    font-weight: 750;
    color: #20283a;
}

.panel-top p {
    margin: 0;
    color: #9299a7;
    font-size: 12px;
}

.period-badge {
    padding: 7px 10px;
    border-radius: 8px;
    background: #f6f7fa;
    color: #6f7889;
    font-size: 11px;
    font-weight: 700;
}


/* PERFORMANCE */

.performance-values {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    margin: 20px 23px 0;
    background: #edf0f4;
    border: 1px solid #edf0f4;
    border-radius: 13px;
    overflow: hidden;
}

.performance-item {
    background: #fbfcfd;
    padding: 17px;
}

.performance-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #7c8594;
    font-size: 12px;
    margin-bottom: 8px;
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
}

.income-dot {
    background: #22aa79;
}

.expense-dot {
    background: #e26161;
}

.performance-item strong {
    font-size: 18px;
}

.income-text {
    color: #16966a;
}

.expense-text {
    color: #d65353;
}


/* PROGRESS */

.expense-progress {
    padding: 22px 23px;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 9px;
    color: #747e8f;
    font-size: 12px;
}

.progress-header strong {
    color: #252d3d;
}

.progress-track {
    height: 7px;
    width: 100%;
    overflow: hidden;
    border-radius: 99px;
    background: #edf0f4;
}

.progress-value {
    height: 100%;
    border-radius: inherit;
    background: #5968d9;
    transition: width .4s ease;
}

.expense-progress p {
    margin: 9px 0 0;
    color: #9aa1ae;
    font-size: 11px;
}


/* CATEGORY */

.category-highlight {
    margin: 0 23px 23px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid #edf0f4;
    border-radius: 13px;
    background: #fafbfc;
}

.category-left {
    display: flex;
    align-items: center;
    gap: 11px;
}

.category-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff1e8;
    color: #df814c;
}

.category-left span {
    display: block;
    color: #9299a7;
    font-size: 11px;
    margin-bottom: 3px;
}

.category-left strong {
    display: block;
    color: #30394a;
    font-size: 13px;
}

.category-amount {
    color: #30394a;
    font-size: 13px;
}


/* TRANSACTIONS */

.transaction-list {
    padding: 7px 12px 12px;
}

.transaction-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 10px;
    border-bottom: 1px solid #f1f3f6;
}

.transaction-row:last-child {
    border-bottom: none;
}

.transaction-type {
    width: 37px;
    height: 37px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.transaction-income {
    background: #eaf9f2;
    color: #15966a;
}

.transaction-expense {
    background: #fff0f0;
    color: #d95a5a;
}

.transaction-info {
    flex: 1;
    min-width: 0;
}

.transaction-info strong {
    display: block;
    color: #2a3344;
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.transaction-info span {
    display: block;
    margin-top: 4px;
    color: #9aa1ae;
    font-size: 11px;
}

.separator {
    display: inline !important;
    margin: 0 5px;
}

.transaction-amount {
    white-space: nowrap;
    font-size: 13px;
}


/* EMPTY */

.empty-transactions {
    min-height: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 6px;
    color: #929aaa;
}

.empty-icon {
    width: 46px;
    height: 46px;
    margin-bottom: 5px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f6f8;
    color: #8d96a6;
}

.empty-transactions strong {
    color: #505a6b;
    font-size: 13px;
}

.empty-transactions span {
    font-size: 11px;
}


/* INSIGHT */

.dashboard-insight {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-top: 20px;
    padding: 15px 18px;
    border: 1px solid #e9ecf2;
    border-radius: 15px;
    background: #ffffff;
    box-shadow: 0 6px 22px rgba(20, 30, 55, .04);
}

.insight-icon {
    width: 37px;
    height: 37px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f3ff;
    color: #5968d9;
}

.dashboard-insight strong {
    display: block;
    color: #333c4e;
    font-size: 12px;
}

.dashboard-insight p {
    margin: 3px 0 0;
    color: #9299a7;
    font-size: 11px;
}


/* LOADING */

.dashboard-loading {
    min-height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.loading-orb {
    width: 55px;
    height: 55px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f3ff;
    color: #5968d9;
    margin-bottom: 16px;
    animation: dashboardPulse 1.5s ease-in-out infinite;
}

.dashboard-loading h2 {
    margin: 0;
    color: #30394a;
    font-size: 17px;
}

.dashboard-loading p {
    margin: 7px 0 0;
    color: #9299a7;
    font-size: 12px;
}

@keyframes dashboardPulse {
    0%, 100% {
        transform: scale(1);
        opacity: .7;
    }

    50% {
        transform: scale(1.06);
        opacity: 1;
    }
}


/* ERROR */

.dashboard-error {
    min-height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.error-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: #fff0f0;
    color: #d65353;
    font-weight: 800;
    font-size: 20px;
    margin-bottom: 15px;
}

.dashboard-error h2 {
    margin: 0;
    font-size: 18px;
    color: #30394a;
}

.dashboard-error p {
    max-width: 420px;
    margin: 8px 0 18px;
    color: #9299a7;
    font-size: 12px;
}

.dashboard-retry {
    border: none;
    border-radius: 10px;
    padding: 10px 17px;
    background: #5968d9;
    color: white;
    font-weight: 700;
    cursor: pointer;
}


/* RESPONSIVE */

@media (max-width: 1000px) {

    .premium-cards {
        grid-template-columns: 1fr;
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

}

@media (max-width: 650px) {

    .premium-dashboard {
        padding: 4px 0 30px;
    }

    .dashboard-header {
        align-items: stretch;
        flex-direction: column;
    }

    .month-selector {
        width: fit-content;
    }

    .performance-values {
        grid-template-columns: 1fr;
    }

    .category-highlight {
        align-items: flex-start;
        flex-direction: column;
    }

    .category-amount {
        margin-left: 47px;
    }

    .transaction-amount {
        font-size: 12px;
    }

}

`;