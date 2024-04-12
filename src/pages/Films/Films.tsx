import {Link} from "react-router-dom";
import {IFilm} from "@/pages/Film";
import {ChangeEvent, useCallback, useState} from "react";
import useDebounce from "@/helpers/useDebounce";
import {useQuery} from '@tanstack/react-query'
import {Search} from "@/modules/Search";

interface IData {
    docs: IFilm[]
}

function fetchFilms(query:string): Promise<IData> {
    return fetch('https://api.kinopoisk.dev/v1.4/movie/search?page=1&limit=10&' + new URLSearchParams({
        query,
    }), {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export default function Films () {
    const [value, setValue] = useState('');

    const debouncedValue = useDebounce(value, 1000);

    //@ts-ignore
    const {data, isSuccess, isLoading, error} = useQuery<IData, string>(
        {
            queryKey: ['films', debouncedValue],
            queryFn: () => fetchFilms(debouncedValue)
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
                <div>
                    {data.docs.length > 1 ? data.docs.map(film => (
                        <Link to={`/films/${film.id}`} key={film.id}>
                            <div>
                                <strong>{film.name}</strong>
                            </div>
                        </Link>
                    )) : (
                        <div>Ничего не найдено</div>
                    )}
                </div>
            )}
        </section>
    )
}