import {Link, useSearchParams} from "react-router-dom";
import {IFilm} from "@/pages/Film";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import useDebounce from "@/helpers/useDebounce";
import {useQuery} from '@tanstack/react-query'
import {Search} from "@/modules/Search";
import {Pagination} from "@/modules/Pagination";

interface IData {
    docs: IFilm[]
    page: number;
    pages: number;
}

function fetchFilms(query:string, page: number, limit = 10): Promise<IData> {
    let url = `https://api.kinopoisk.dev/v1.4/movie/search?page=${page}&limit=${limit}`;

    if (query) {
        url = url + '&' + new URLSearchParams({query})
    }

    return fetch(url, {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export default function Films () {
    const [isInit, setIsInit] = useState(true);

    /* */
    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = Number(searchParams.get('page'));
    /* */

    /* pagination */
    const handlePageClick = useCallback((pageNum: number) => () => {
        setSearchParams(prev => {
            const newUrl = new URLSearchParams();

            newUrl.set('page', pageNum.toString());

            prev.forEach((value, key) => {
                if (key !== 'page') {
                    newUrl.set(key, value);
                }
            })

            return newUrl;
        })
    }, [])
    /* end pagination */

    /* search */
    const [value, setValue] = useState(searchParams.has('query') ? searchParams.get('query') : '');

    const debouncedValue = useDebounce(value, 1000);

    //resets page on search value change and doesn't reset on first page load
    useEffect(() => {
        if (!isInit) {
            setSearchParams((prev) => {
                const newUrl = new URLSearchParams();

                if (prev.has('page')) {
                    newUrl.set('page', '1');
                }

                if (debouncedValue) {
                    newUrl.set('query', debouncedValue);
                }

                if (prev.has('limit')) {
                    newUrl.set('limit', prev.get('limit'))
                }

                return newUrl;
            })
        } else {
            setIsInit(false)
        }
    }, [debouncedValue])
    /* end search */

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, string>(
        {
            queryKey: ['films', debouncedValue, pageFromUrl],
            queryFn: () => fetchFilms(debouncedValue, pageFromUrl > 0 ? pageFromUrl : 1)
        }
    );

    const handleChange = useCallback(
        (e:ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []
    );

    return (
        <section>
            <h1>Films</h1>

            <Search value={value} handleChange={handleChange} />

            {isLoading && <div>Loading...</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <div>
                            <div>
                                {data.docs.map(film => (
                                    <Link to={`/films/${film.id}`} key={film.id}>
                                        <div>
                                            <strong>{film.name}</strong>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Pagination total={data.pages} current={data.page} handleClick={handlePageClick}/>
                        </div>
                    ) : (
                        <div>Ничего не найдено</div>
                    )}
                </>
            )}
        </section>
    )
}