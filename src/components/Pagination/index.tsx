import "./pagination.css"

interface PaginationProps {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
}

export default function Pagination({
    page,
    total,
    pageSize,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize)
    if (totalPages <= 1) return null

    const getPages = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                Prev
            </button>

            {getPages().map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={p === page ? "active" : ""}
                >
                    {p}
                </button>
            ))}

            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                Next
            </button>
        </div>
    )
}
