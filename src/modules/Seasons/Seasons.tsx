import {Pagination} from "@/modules/Pagination";
import {useQuery} from "@tanstack/react-query";
import {useCallback, useState} from "react";

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
    const {data, isLoading, isSuccess, error} = useQuery<IData, string>(
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
        <div>
            {isLoading && <div>Loading...</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <div>
                            <div>
                                {data.docs.map(season => (
                                    <div>
                                        <p>{season.number}</p>
                                        <p>{season.name}</p>
                                        <p>{season.description}</p>
                                        <div>
                                            {season.episodes.map(item => (
                                                <span>{item.number} - {item.name}</span>
                                            ))}
                                        </div>
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
                        <div>Нет информации о сезонах</div>
                    )}
                </>
            )}
        </div>
    )
}