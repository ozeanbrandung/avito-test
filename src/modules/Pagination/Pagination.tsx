import {memo, MouseEvent} from "react";
import styles from './Pagination.module.scss';

interface IProps {
    total: number;
    current: number;
    handleClick(pageNum: number): (e: MouseEvent) => void;
}

const PageBtn = ({pageNum, handleClick}: {pageNum: number, handleClick(pageNum: number): (e: MouseEvent) => void}) => {
    return (
        <button className={styles.pageBtn} onClick={handleClick(pageNum)}>
            {pageNum}
        </button>
    )
}

export const Pagination = memo(({total, current, handleClick}: IProps) => {
    const isExtendedView = total > 5;

    function getExtendedView () {
        switch (current) {
            case 1:
            case 2:
                return (
                    <>
                        {new Array(current + 1).fill('').map((_, idx) => (
                            <PageBtn key={idx} pageNum={idx + 1} handleClick={handleClick} />
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
                            <PageBtn key={idx} pageNum={current - 1 + idx} handleClick={handleClick}/>
                        ))}
                    </>
                )
            default:
                return (
                    <>
                        <PageBtn pageNum={1} handleClick={handleClick}/>
                        {current !== 3 && <span>...</span>}
                        <PageBtn pageNum={current - 1} handleClick={handleClick}/>
                        <PageBtn pageNum={current} handleClick={handleClick}/>
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
        <div>
            {isExtendedView ? (
                <>
                    {getExtendedView()}
                </>
            ) : (
                <>
                    {new Array(total).fill('').map((_, idx) => (
                        <PageBtn key={idx} pageNum={idx + 1} handleClick={handleClick}/>
                    ))}
                </>
            )}
        </div>
    )
});