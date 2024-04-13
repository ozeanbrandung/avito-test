import {Pagination} from "@/modules/Pagination";
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";
import noPhoto from '@/assets/img/no-photo.png'
import styles from './Actors.module.scss';

//TODO: make it dynamic
interface IData {
    docs: IActor[];
    pages: number;
    page: number;
}

interface IActor {
    name: string;
    photo: string;
    age: number;
    enName: string;
}

function fetchActors(page: number, id: number): Promise<IData> {
    const url = `https://api.kinopoisk.dev/v1.4/person?&page=${page}&limit=10&notNullFields=name&sortField=movies.rating&sortType=1&movies.id=${id}&movies.enProfession=actor`;

    return fetch(url, {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export const Actors = ({movieId}: {movieId: number}) => {
    const [page, setPage] = useState(1);

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, Error>(
        {
            queryKey: ['actors', page],
            queryFn: () => fetchActors(page, movieId)
        }
    );

    const handlePageClick = useCallback(
        (pageNum: number) => () => setPage(pageNum),
        []
    )

    return (
        <div className={styles.block}>
            <h2 className={styles.title}>Актеры</h2>

            {isLoading && <div>Loading...</div>}

            {error && <div>{error.message}</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <div>
                            <div className={`${styles.actorsBlock} ${styles.content}`}>
                                {data.docs.map(actor => (
                                    <div>
                                        <div className={styles.photo}>
                                            <img src={actor.photo ? actor.photo : noPhoto} alt=""/>
                                        </div>

                                        <p>{actor.name ? actor.name : actor.enName}{actor.age && `, ${actor.age}`}</p>
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
                        <div>Нет актеров</div>
                    )}
                </>
            )}
        </div>
    )
}