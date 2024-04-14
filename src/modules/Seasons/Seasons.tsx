import {MouseEvent} from "react";
import {Pagination} from "@/modules/Pagination";
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";
import styles from './Seasons.module.scss';

//TODO: make it dynamic
interface IData {
    docs: ISeason[];
    pages: number;
    page: number;
}

interface ISeason {
    number: number;
    name: string;
    enName: string;
    description: string;
    episodes: {
        number: number;
        name: string;
        enName: string;
        description: string;
    }[]
}

function fetchSeasons(page: number, id: number): Promise<IData> {
    const url = `https://api.kinopoisk.dev/v1.4/season?&page=${page}&limit=10&movieId=${id}`;

    return fetch(url, {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export const Seasons = ({movieId}: {movieId: number}) => {
    const [page, setPage] = useState(1);

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, Error>(
        {
            queryKey: ['seasons', page],
            queryFn: () => fetchSeasons(page, movieId)
        }
    );

    const handlePageClick = useCallback(
        (pageNum: number) => () => setPage(pageNum),
        []
    )

    return (
        <div className={styles.seasons}>
            {isLoading && <div>Loading...</div>}

            {error && <div>{error.message}</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <>
                            <ul className={styles.content}>
                                {data.docs.map(season => (
                                    <li key={season.number} className={styles.season}>
                                        <p className={styles.title} onClick={(e:MouseEvent) => {
                                            (e.currentTarget as HTMLElement).classList.toggle(styles.active)
                                        }}>
                                            <strong>{season.name} ↓</strong>
                                        </p>

                                        <ul className={styles.episodes}>
                                            {season.episodes.map(item => (
                                                <li key={item.number} className={styles.episode}>
                                                    {item.number}. {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>

                            <Pagination
                                total={data.pages}
                                current={data.page}
                                handleClick={handlePageClick}
                            />
                        </>
                    ) : (
                        <div>Нет информации о сезонах</div>
                    )}
                </>
            )}
        </div>
    )
}