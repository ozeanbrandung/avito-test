import {ReactNode, MouseEvent} from "react";
import styles from './Button.module.scss'

interface IProps {
    className?: string;
    children: ReactNode;
    onClick(e:MouseEvent): void;
}

export const Button = (props: IProps) => {
    const {children, onClick, className, ...rest} = props;

    return (
        <button onClick={onClick} className={`${styles.btn} ${className}`} {...rest}>
            {children}
        </button>
    )
}