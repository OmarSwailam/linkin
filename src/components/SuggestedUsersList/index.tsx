import { useState } from "react"
import { useSuggestedFriends } from "../../hooks/useUser"
import UserCard from "../UserCard"
import Pagination from "../Pagination"
import "./suggestedUsersList.css"
import UserCardSkeleton from "../UserCard/UserCardSkeleton"


export default function SuggestedUsersList() {
    const [page, setPage] = useState(1)
    const pageSize = 8

    const {
        data,
        isLoading
    } = useSuggestedFriends(page, pageSize)

    const totalPages = Math.ceil((data?.total || 0) / pageSize)

    return (
        <div className="suggested-users-list">
            <h3>People you may know</h3>

            <ul className="suggested-users-list-items">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => <UserCardSkeleton key={i} />)
                    : data?.results.map(user => <UserCard key={user.uuid} user={user} showFollowButton={true} />)
                }
            </ul>

            {data && totalPages > 1 && (
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={data.total}
                    onPageChange={setPage}
                />
            )}

        </div>
    )
}
