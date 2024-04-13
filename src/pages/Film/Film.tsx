import {Link, useParams} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import {Reviews} from "@/modules/Reviews";
import {Actors} from "@/modules/Actors";
import {Seasons} from "@/modules/Seasons";
import styles from "@/pages/Films/Films.module.scss";

export interface IFilm {
    id: number;
    year: number;
    name: string;
    ageRating: number;
    countries: {name: string}[]
    description: string;
    seasonsInfo: any[];
    //type: 'tv-series' | 'movie' | 'animated-series'
    rating: {
        kp: number;
        imdb: number
    }
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
    const {data, isSuccess, isLoading, error} = useQuery<IFilm, Error>(
        {
            queryKey: ['film', filmId],
            queryFn: () => fetchFilm(filmId)
        }
    );

    return (
        <section>
            {isLoading && <div className={styles.content}>Loading...</div>}

            {error && <div className={styles.content}>{error.message}</div>}

            {isSuccess && data && (
                <>
                    <Link to={'/films'}>К поиску</Link>
                    <article>
                        <h1>{data.name}</h1>

                        <p>
                            {data.description}
                        </p>

                        <div>
                            <p>KP: {data.rating.kp}</p>
                            <p>IMDB: {data.rating.imdb}</p>
                        </div>

                        <div>
                            Год: <strong>{data.year}</strong>
                        </div>

                        <div>Возрастной рейтинг: <em>{`${data.ageRating}+`}</em></div>

                        <div>Страны: {data.countries.map((item, idx) => <div key={idx}>{item.name}</div>)}</div>
                    </article>

                    <Actors movieId={data.id} />

                    {data.seasonsInfo.length > 0 && (
                        <Seasons movieId={data.id} />
                    )}

                    <Reviews movieId={data.id} />
                </>
            )}
        </section>
    )
}