import {Link} from "react-router-dom";
import {IFilm} from "@/pages/Film/Film";
import {Outlet} from "react-router-dom";

interface IProps {
    data: IFilm[]
}

export default function Films ({data}:IProps) {
    return (
        <section>
            <h1>Films</h1>

            <div>
                {data.length > 1 ? data.map(film => (
                    <Link to={`/films/${film.id}`} key={film.id}>
                        <div>
                            <strong>{film.name}</strong>
                        </div>
                    </Link>
                )) : <div>Ничего не найдено</div>}
            </div>

            <Outlet/>
        </section>
    )
}