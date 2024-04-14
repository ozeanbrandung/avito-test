import {Pagination} from "@/modules/Pagination";
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";
import styles from './Reviews.module.scss'

//TODO: make it dynamic
interface IData {
    docs: IReview[];
    pages: number;
    page: number;
}

interface IReview {
    id:number;
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
            <h2 className={styles.h2}>Отзывы</h2>

            {isLoading && <div>Loading...</div>}

            {isSuccess && data && (
                <>
                {data.docs?.length > 0 ? (
                    <div>
                        <div className={styles.content}>
                            {data.docs.map(review => (
                                    <article
                                        key={review.id}
                                        className={`
                                            ${styles.review}
                                            ${review.type === 'Позитивный' ? styles.positive : ''}
                                            ${review.type === 'Негативный' ? styles.negative : ''}
                                            ${review.type === 'Нейтральный' ? styles.neutral : ''}
                                        `}
                                        //className={styles.review}
                                    >
                                        <div className={styles.header}>
                                            <p className={styles.title}>{review.title}</p>
                                            <p><strong>{review.type}</strong></p>
                                        </div>
                                        <p>{review.review}</p>
                                        <p className={styles.author}><em>{review.author}</em></p>
                                    </article>
                            ))}
                        </div>

                        <Pagination
                            total={data.pages}
                            current={data.page}
                            handleClick={handlePageClick}
                        />
                    </div>
                ) : (
                    <div className={styles.content}>Нет отзывов на этот фильм</div>
                )}
                </>
            )}
        </div>
    )
}