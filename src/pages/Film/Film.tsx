import {Link, useParams} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';

export interface IFilm {
    id: number;
    year: number;
    name: string;
    ageRating: number;
    countries: {name: string}[]
}

function fetchFilm(id: string) {
    return fetch(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
        headers: {
            'X-API-KEY': process.env.TOKEN
        }
    }).then((response) => response.json())
}

export default function Film () {
    const {filmId} = useParams();

    //@ts-ignore
    const {data, isSuccess, isLoading, error} = useQuery<IFilm, string>(
        {
            queryKey: ['film', filmId],
            queryFn: () => fetchFilm(filmId)
        }
    );

    return (
        <article>
            {isLoading && <div>Loading...</div>}
            {isSuccess && data && (
                <>
                    <Link to={'/films'}>К поиску</Link>
                    <h1>{data.name}</h1>

                    <div>
                        Год: <strong>{data.year}</strong>
                    </div>

                    <div>Возрастной рейтинг: <em>{`${data.ageRating}+`}</em></div>

                    <div>Страны: {data.countries.map((item, idx) => <div key={idx}>{item.name}</div>)}</div>
                </>
            )}
        </article>
    )
}