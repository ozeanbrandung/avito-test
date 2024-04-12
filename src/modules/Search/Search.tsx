import {ChangeEvent, memo} from "react";
import styles from './Search.module.scss';

interface IProps {
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Search = memo(({value, handleChange}: IProps) => {
    return (
        <input
            className={styles.input}
            type='search'
            value={value}
            onChange={handleChange}
        />
    )
});