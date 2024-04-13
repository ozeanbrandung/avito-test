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

const DEFAULT_PAGE = '1';
const DEFAULT_LIMIT = LimitOptions.Ten

function fetchFilms(query:string, page: string, limit:LimitOptions | string): Promise<IData> {
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

    const [searchParams, setSearchParams] = useSearchParams();

    /* search */
    const [query, setQuery] = useState(searchParams.has('query') ? searchParams.get('query') : '');

    const debouncedQuery = useDebounce(query, 1000);

    /* value for input that is not debounced */
    const handleChangeQuery = useCallback(
        (e:ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []
    );
    /* end search  */

    //manage url on query change
    useEffect(() => {
        if (!isInit) {
            setSearchParams((prev) => {
                const newUrl = new URLSearchParams();

                //reset page at url
                if (prev.has('page')) {
                    newUrl.set('page', DEFAULT_PAGE);
                }

                //preserve limit at url
                if (prev.has('limit')) {
                    newUrl.set('limit', prev.get('limit'))
                }

                //set new query at url
                if (debouncedQuery) {
                    newUrl.set('query', debouncedQuery);
                }

                return newUrl;
            })
        } else {
            setIsInit(false)
        }
    }, [debouncedQuery])

    //set url initially
    useEffect(() => {
        setSearchParams(prev => {
            const newUrl = new URLSearchParams();

            //see if url contains page - preserve, otherwise set default
            newUrl.set('page', prev.has('page') ? prev.get('page') : DEFAULT_PAGE);

            //see if url contains limit - preserve, otherwise set default
            newUrl.set('limit', prev.has('limit') ? prev.get('limit') : DEFAULT_LIMIT);

            //preserve query - don't need to set default
            if (prev.has('query')) {
                newUrl.set('query', prev.get('query'));
            }
            return newUrl;
        })
    }, [])

    /* pagination */
    const handlePageClick = useCallback((pageNum: number) => () => {
        //update page at url
        setSearchParams(prev => {
            const newUrl = new URLSearchParams();
            //set page
            newUrl.set('page', pageNum.toString());
            //preserve limit
            newUrl.set('limit', prev.get('limit'));
            //preserve query
            if (prev.has('query')) {
                newUrl.set('query', prev.get('query'));
            }
            return newUrl;
        })
    }, [searchParams.get('limit'), searchParams.get('query')])
    /* end pagination */

    /* limit */
    const handleChangeLimit = useCallback((newLimit: LimitOptions) => (e: MouseEvent) => {
        //update limit at url and reset page at url
        setSearchParams(prev => {
            const newUrl = new URLSearchParams();
            //reset page
            newUrl.set('page', DEFAULT_PAGE);
            //new limit
            newUrl.set('limit', newLimit);
            //preserve query
            if (prev.has('query')) {
                newUrl.set('query', prev.get('query'));
            }
            return newUrl;
        })
    }, [searchParams.get('query')])
    /* end limit*/

    //@ts-ignore
    const {data, isLoading, isSuccess, error} = useQuery<IData, Error>(
        {
            queryKey: ['films', debouncedQuery, searchParams.get('page'), searchParams.get('limit')],
            queryFn: () => fetchFilms(
                debouncedQuery,
                searchParams.get('page'),
                searchParams.get('limit')
            )
        }
    );

    return (
        <section>
            <h1 className={styles.title}>Искать фильмы!</h1>

            <div className={styles.filtersGroup}>
                <Search value={query} handleChange={handleChangeQuery} />

                <select>
                    <option selected={searchParams.get('limit') === LimitOptions.Ten} onClick={handleChangeLimit(LimitOptions.Ten)}>
                        {LimitOptions.Ten}
                    </option>
                    <option selected={searchParams.get('limit') === LimitOptions.Twenty} onClick={handleChangeLimit(LimitOptions.Twenty)}>
                        {LimitOptions.Twenty}
                    </option>
                    <option selected={searchParams.get('limit') === LimitOptions.Fifty} onClick={handleChangeLimit(LimitOptions.Fifty)}>
                        {LimitOptions.Fifty}
                    </option>
                </select>
            </div>

            {isLoading && <div className={styles.content}>Loading...</div>}

            {error && <div className={styles.content}>{error.message}</div>}

            {isSuccess && data && (
                <>
                    {data.docs?.length > 0 ? (
                        <>
                            <div className={styles.content}>
                                {data.docs.map(film => (
                                    <Link to={`/films/${film.id}`} key={film.id}>
                                        <div>
                                            <strong>{film.name} ({film.year})</strong>
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