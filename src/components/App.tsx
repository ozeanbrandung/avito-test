import {useState} from "react";
import Films from "@/pages/Films/Films";
import {IFilm} from "@/pages/Film/Film";
import useDebounce from "@/helpers/useDebounce";
import {useQuery} from "@tanstack/react-query";

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

export const App = () => {
    const [value, setValue] = useState('');

    const debouncedValue = useDebounce(value, 1000);

    //@ts-ignore
    const {data, isSuccess, isLoading, error} = useQuery<IData, string>(
        {
            queryKey: ['films', debouncedValue],
            queryFn: () => fetchFilms(debouncedValue)
        }
    );

    console.log(isSuccess, error)

    return (
        <section>
            <input
                type='search'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            {isLoading && <div>Loading...</div>}

            {isSuccess && data && (
                <Films data={(data as IData).docs}/>
            )}
        </section>
    )
}