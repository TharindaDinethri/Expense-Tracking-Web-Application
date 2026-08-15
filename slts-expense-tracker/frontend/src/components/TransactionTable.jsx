export default function TransactionTable({
    items = [],
    onEdit,
    onDelete,
    type
}) {
    const isExpense = type === 'expense';

    return (
        <div className="table-wrap">
            <table>

                <thead>
                    <tr>
                        <th>
                            {isExpense ? 'Title' : 'Source'}
                        </th>

                        {isExpense && (
                            <th>Category</th>
                        )}

                        <th>Amount</th>
                        <th>Date</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {items.length ? (

                        items.map(x => (

                            <tr key={x.id}>

                                {/* Title / Source */}
                                <td>
                                    <b>
                                        {isExpense
                                            ? x.title
                                            : x.source}
                                    </b>
                                </td>


                                {/* Category - Expenses ONLY */}
                                {isExpense && (
                                    <td>
                                        {x.category}
                                    </td>
                                )}


                                {/* Amount */}
                                <td
                                    className={
                                        isExpense
                                            ? 'minus'
                                            : 'plus'
                                    }
                                >
                                    {isExpense ? '-' : '+'}{' '}

                                    {Number(x.amount).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }
                                    )}
                                </td>


                                {/* Date */}
                                <td>
                                    {isExpense
                                        ? x.transactionDate
                                        : x.receivedDate}
                                </td>


                                {/* Note */}
                                <td>
                                    {x.note || '—'}
                                </td>


                                {/* Actions */}
                                <td className="actions">

                                    <button
                                        type="button"
                                        onClick={() => onEdit(x)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={() => onDelete(x.id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td
                                colSpan={isExpense ? 6 : 5}
                                className="empty"
                            >
                                No records yet.
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>
        </div>
    );
}