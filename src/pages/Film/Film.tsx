export interface IFilm {
    id: number;
    year: number;
    name: string;
    ageRating: number;
    countries: {name: string}[]
}

//interface IProps extends IFilm {}

export default function Film (/*props: IProps*/) {
    //const {id, name, year, ageRating, countries} = props;
    return (
        <article>
            Film
            {/*<h2>{name}</h2>*/}
            {/*<div><strong>{year}</strong></div>*/}
        </article>
    )
}