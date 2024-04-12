import {Link, useSearchParams} from "react-router-dom";
import {IFilm} from "@/pages/Film";
import {ChangeEvent, MouseEvent, useCallback, useEffect, useState} from "react";
import useDebounce from "@/helpers/useDebounce";
import {useQuery} from '@tanstack/react-query'
import {Search} from "@/modules/Search";
import {Pagination} from "@/modules/Pagination";
import styles from './Films.module.scss';

interface IData {
    docs: IFilm[]
    page: number;
    pages: number;
}

export enum LimitOptions {
    Ten = '10',
    Twenty = '20',
    Fifty = '50',
}

function fetchFilms(query:string, page: number, limit:LimitOptions | string): Promise<IData> {
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

    /* limit */
    const [limit, setLimit] = useState(searchParams.has('limit') ? searchParams.get('limit') : LimitOptions.Ten);

    const handleChangeLimit = useCallback((newLimit: LimitOptions) => (e: MouseEvent) => {
        setLimit(newLimit)
        setSearchParams((prev) => {
            const newUrl = new URLSearchParams();

            prev.forEach((value, key) => {
                newUrl.set(key, value)
            })

            newUrl.set('limit', newLimit.toString())

            return newUrl
        })
    }, [])
    /* end limit*/

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, string>(
        {
            queryKey: ['films', debouncedValue, pageFromUrl, limit],
            queryFn: () => fetchFilms(
                debouncedValue,
                pageFromUrl > 0 ? pageFromUrl : 1,
                limit
            )
        }
    );

    const handleChange = useCallback(
        (e:ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []
    );

    return (
        <section>
            <h1 className={styles.title}>Искать фильмы!</h1>

            <div className={styles.filtersGroup}>
                <Search value={value} handleChange={handleChange} />

                <select>
                    <option selected={limit === LimitOptions.Ten} onClick={handleChangeLimit(LimitOptions.Ten)}>
                        {LimitOptions.Ten}
                    </option>
                    <option selected={limit === LimitOptions.Twenty} onClick={handleChangeLimit(LimitOptions.Twenty)}>
                        {LimitOptions.Twenty}
                    </option>
                    <option selected={limit === LimitOptions.Fifty} onClick={handleChangeLimit(LimitOptions.Fifty)}>
                        {LimitOptions.Fifty}
                    </option>
                </select>
            </div>

            {isLoading && <div className={styles.content}>Loading...</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <>
                            <div className={styles.content}>
                                {data.docs.map(film => (
                                    <Link to={`/films/${film.id}`} key={film.id}>
                                        <div>
                                            <strong>{film.name}</strong>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <Pagination total={data.pages} current={data.page} handleClick={handlePageClick} className={styles.content}/>
                        </>
                    ) : (
                        <div className={styles.content}>Ничего не найдено</div>
                    )}
                </>
            )}
        </section>
    )
}