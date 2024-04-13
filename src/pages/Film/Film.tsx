import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from '@tanstack/react-query';
import {Reviews} from "@/modules/Reviews";
import {Actors} from "@/modules/Actors";
import {Seasons} from "@/modules/Seasons";
import styles from "./Film.module.scss";
import {Button} from "@/ui";
import {IPoster, PostersCarousel} from "@/modules/PostersCarousel/PostersCarousel";

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
    poster: {
        url: string;
    }
    similarMovies: IPoster[]
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

    const handleClickBack = () => {
        if (history.length > 0) {
            history.back();
        } else {
            history.pushState(undefined, undefined, "/films");
        }
    }

    const backBtnTitle = history.length > 0 ? 'Назад' : 'К поиску';

    return (
        <section>
            {isLoading && <div className={styles.content}>Loading...</div>}

            {error && <div className={styles.content}>{error.message}</div>}

            {isSuccess && data && (
                <>
                    <Button onClick={handleClickBack}>{backBtnTitle}</Button>

                    <article className={styles.article}>
                        <h1 className={styles.title}>{data.name}</h1>

                        <div className={styles.description}>
                            <div className={styles.right}>
                                <p className={`${styles.block} ${styles.text}`}>
                                    {data.description}
                                </p>

                                <p className={styles.block}>
                                    Год: <strong>{data.year}</strong>
                                </p>

                                {data.ageRating && (
                                    <p className={styles.block}>Возрастной рейтинг: <em>{`${data.ageRating}+`}</em></p>
                                )}

                                <p className={`${styles.block} ${styles.countries}`}>
                                    Страны: {data.countries.map((item, idx) =>
                                        <span key={idx}>{item.name}</span>
                                    )}
                                </p>

                                <div className={styles.ratingBlock}>
                                    <span>KP: {data.rating.kp}</span>
                                    <span>IMDB: {data.rating.imdb}</span>
                                </div>
                            </div>

                            <div className={styles.img}>
                                <img src={data.poster.url} alt=""/>
                            </div>
                        </div>
                    </article>

                    <Actors movieId={data.id} />

                    <PostersCarousel posters={data.similarMovies} />

                    {data.seasonsInfo.length > 0 && (
                        <Seasons movieId={data.id} />
                    )}

                    <Reviews movieId={data.id} />
                </>
            )}
        </section>
    )
}