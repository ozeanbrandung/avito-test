import {memo, MouseEvent} from "react";
import styles from './Pagination.module.scss';
import {Button} from "@/ui";

interface IProps {
    className?: string;
    total: number;
    current: number;
    handleClick(pageNum: number): (e: MouseEvent) => void;
}

interface IPageBtnProps {
    pageNum: number,
    className?: string,
    handleClick(pageNum: number): (e: MouseEvent) => void
}

const PageBtn = ({pageNum, handleClick, className}: IPageBtnProps) => {
    return (
        <Button className={`${styles.pageBtn} ${className}`} onClick={handleClick(pageNum)}>
            {pageNum}
        </Button>
    )
}

export const Pagination = memo(({total, current, handleClick, className}: IProps) => {
    const isExtendedView = total > 5;

    function getExtendedView () {
        switch (current) {
            case 1:
            case 2:
                return (
                    <>
                        {new Array(current + 1).fill('').map((_, idx) => (
                            <PageBtn
                                key={idx}
                                pageNum={idx + 1}
                                handleClick={handleClick} className={current === idx + 1 ? styles.selected : ''}
                            />
                        ))}
                        <span>...</span>
                        <PageBtn pageNum={total} handleClick={handleClick} />
                    </>
                )
            case total:
            case total - 1:
                return (
                    <>
                        <PageBtn pageNum={1} handleClick={handleClick}/>
                        <span>...</span>
                        {new Array(current === total ? 2 : 3).fill('').map((_, idx) => (
                            <PageBtn
                                key={idx}
                                pageNum={current - 1 + idx}
                                handleClick={handleClick}
                                className={current - 1 + idx === current ? styles.selected : ''}
                            />
                        ))}
                    </>
                )
            default:
                return (
                    <>
                        <PageBtn pageNum={1} handleClick={handleClick}/>
                        {current !== 3 && <span>...</span>}
                        <PageBtn pageNum={current - 1} handleClick={handleClick}/>
                        <PageBtn pageNum={current} handleClick={handleClick} className={styles.selected}/>
                        <PageBtn pageNum={current + 1} handleClick={handleClick}/>
                        {current !== total - 2 && <span>...</span>}
                        <PageBtn pageNum={total} handleClick={handleClick}/>
                    </>
                )
        }
    }

    if (total === 1) {
        return null
    }

    return (
        <div className={`${styles.pagination} ${className}`}>
            {isExtendedView ? (
                <>
                    {getExtendedView()}
                </>
            ) : (
                <>
                    {new Array(total).fill('').map((_, idx) => (
                        <PageBtn key={idx} pageNum={idx + 1} handleClick={handleClick} className={current === idx + 1 ? styles.selected : ''}/>
                    ))}
                </>
            )}
        </div>
    )
});