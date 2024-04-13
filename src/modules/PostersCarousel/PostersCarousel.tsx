import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from "react-router-dom";
import styles from './PostersCarousel.module.scss'
import {Navigation} from 'swiper/modules';
//import 'swiper/css';

export interface IPoster {
    id: number;
    name: string;
    poster: {
        url: string;
    }
}

interface IProps {
    posters: IPoster[];
}

export const PostersCarousel = ({posters}:IProps) => {
  return (
      <div>
          <h2 className={styles.title}>Похожие фильмы</h2>

          <Swiper
              className={styles.swiper}
              spaceBetween={0}
              slidesPerView={1}
              breakpoints={{
                  768: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                  },
                  1024: {
                      slidesPerView: 5,
                      spaceBetween: 50,
                  },
              }}
              modules={[Navigation]}
              loop
          >
              {posters.map(item => (
                  <SwiperSlide className={styles.slide}>
                      <Link to={`/films/${item.id}`}>
                          <div className={styles.poster}>
                              <img src={item.poster.url} alt={''}/>
                          </div>
                      </Link>
                  </SwiperSlide>
              ))}
          </Swiper>
      </div>
  )
}