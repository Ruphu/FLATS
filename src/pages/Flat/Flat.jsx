import { useEffect, useState } from 'react'
import Header from '@components/Header'
import Container from '@shared/Container'
import Button from '@shared/Button'
import { getMeRequest } from '@shared/api/auth/authApi'
import useAuth from '@hooks/useAuth'
import styles from './Flat.module.scss'

const Flat = () => {
	return (
		<div className={styles.page}>
			<Header />

			<Container>
				<section className={styles.card}>
					<div className={styles.card_info}>
						<h2 className={styles.card_title}>
							1-к. квартира, 34,5 м², 15/15 эт.
						</h2>
						<p className={styles.card_description}>Санкт-Петербург, р-н Приморский, Юнтолово, Планерная ул., 87к1</p>
						<Button
							className={styles.card_addFav}
							fullWidth
							size='lg'
							type='submit'
						>
							Добавить в избранное
						</Button>
						<div className={styles.card_imgWrapper}>
							<img
								src='https://i.pinimg.com/736x/bb/91/84/bb918411c37f8caf8a610bd08b2eb097.jpg'
								alt='flat'
								className={styles.card_img}
							/>
						</div>
					</div>
					<div className={styles.card_links}>
						<p className={styles.card_price}>11 500 000 ₽</p>
						<p className={styles.card_priceMonth}>333 333 ₽ за м²₽</p>
						<Button
							className={styles.card_sendMessage}
							fullWidth
							size='lg'
							type='submit'
						>
							Написать сообщение
						</Button>
					</div>
				</section>
			</Container>
		</div>
	)
}

export default Flat
