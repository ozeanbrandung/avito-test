import {memo} from "react";
import {useSearchParams} from "react-router-dom";
import styles from './Pagination.module.scss';

interface IProps {
    total: number;
    current: number;
}

const PageBtn = ({pageNum}: {pageNum: number}) => {
    const [_, setSearchParams] = useSearchParams();

    const handleClick = () => {
        setSearchParams(prev => {
            const newUrl = new URLSearchParams();

            newUrl.set('page', pageNum.toString());

            prev.forEach((value, key) => {
                if (key !== 'page') {
                    newUrl.set(key, value);
                }
            })

            return newUrl;
        })
    }

    return (
        <button className={styles.pageBtn} onClick={handleClick}>
            {pageNum}
        </button>
    )
}

export const Pagination = memo(({total, current}: IProps) => {
    const isExtendedView = total > 5;

    function getExtendedView () {
        switch (current) {
            case 1:
            case 2:
                return (
                    <>
                        {new Array(current + 1).fill('').map((_, idx) => (
                            <PageBtn key={idx} pageNum={idx + 1} />
                        ))}
                        <span>...</span>
                        <PageBtn pageNum={total} />
                    </>
                )
            case total:
            case total - 1:
                return (
                    <>
                        <PageBtn pageNum={1} />
                        <span>...</span>
                        {new Array(current === total ? 2 : 3).fill('').map((_, idx) => (
                            <PageBtn key={idx} pageNum={current - 1 + idx} />
                        ))}
                    </>
                )
            default:
                return (
                    <>
                        <PageBtn pageNum={1} />
                        {current !== 3 && <span>...</span>}
                        <PageBtn pageNum={current - 1} />
                        <PageBtn pageNum={current} />
                        <PageBtn pageNum={current + 1} />
                        {current !== total - 2 && <span>...</span>}
                        <PageBtn pageNum={total} />
                    </>
                )
        }
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
                        <PageBtn key={idx} pageNum={idx + 1} />
                    ))}
                </>
            )}
        </div>
    )
});