import {ChangeEvent, memo} from "react";

interface IProps {
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Search = memo(({value, handleChange}: IProps) => {
    return (
        <input
            type='search'
            value={value}
            onChange={handleChange}
        />
    )
});