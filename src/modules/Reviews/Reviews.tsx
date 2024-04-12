import {Pagination} from "@/modules/Pagination";
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";

//TODO: make it dynamic
interface IData {
    docs: IReview[];
    pages: number;
    page: number;
}

interface IReview {
    title: string;
    review: string;
    author: string;
    type: string;
}

function fetchReviews(page: number, id: number): Promise<IData> {
    const url = `https://api.kinopoisk.dev/v1.4/review?&page=${page}&limit=10&movieId=${id}`;

    return fetch(url, {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export const Reviews = ({movieId}: {movieId: number}) => {
    const [page, setPage] = useState(1);

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, string>(
        {
            queryKey: ['reviews', page],
            queryFn: () => fetchReviews(page, movieId)
        }
    );

    const handlePageClick = useCallback(
        (pageNum: number) => () => setPage(pageNum),
        []
    )

    return (
        <div>
            {isLoading && <div>Loading...</div>}

            {isSuccess && data && (
                <>
                {data.docs?.length > 0 ? (
                    <div>
                        <div>
                            {data.docs.map(review => (
                                    <div>
                                        <p>{review.title}</p>
                                        <p>{review.review}</p>
                                        <p>{review.author}</p>
                                        <p>{review.type}</p>
                                    </div>
                            ))}
                        </div>

                        <Pagination
                            total={data.pages}
                            current={data.page}
                            handleClick={handlePageClick}
                        />
                    </div>
                ) : (
                    <div>Нет отзывов на этот фильм</div>
                )}
                </>
            )}
        </div>
    )
}