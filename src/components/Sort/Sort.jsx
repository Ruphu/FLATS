import Container from '@shared/Container'
import Button from '@shared/Button'
import styles from './Sort.module.scss'

const criteriaLabels = {
	price: 'Цена',
	area: 'Площадь',
	rooms: 'Комнаты',
	district: 'Район',
	transport: 'Транспорт',
	infrastructure: 'Инфраструктура',
	condition: 'Состояние',
	house_type: 'Тип дома',
	floor: 'Этаж',
	balcony_loggia: 'Балкон/лоджия',
}

const Sort = ({
	mode,
	onlyMatching,
	weights,
	compareCount,
	onModeChange,
	onOnlyMatchingChange,
	onWeightChange,
}) => {
	const isRecommended = mode === 'recommended'

	return (
		<Container>
			<section className={styles.sort}>
				<div>
					<h1 className={styles.title}>
						{isRecommended ? 'Подбор квартиры TOPSIS' : 'Все квартиры'}
					</h1>
					<p className={styles.subtitle}>
						{isRecommended
							? 'Квартиры ранжируются по сохраненному профилю и весам критериев.'
							: 'Можно смотреть весь каталог или включить персональный подбор.'}
					</p>
				</div>

				<div className={styles.actions}>
					<Button
						size='lg'
						variant={isRecommended ? 'primary' : 'secondary'}
						className={styles.button}
						onClick={() => onModeChange(isRecommended ? 'all' : 'recommended')}
					>
						{isRecommended ? 'Показать все' : 'Подбор по TOPSIS'}
					</Button>
					<span className={styles.compareBadge}>В сравнении: {compareCount}</span>
				</div>
			</section>

			{isRecommended ? (
				<section className={styles.weightsPanel}>
					<label className={styles.matchToggle}>
						<input
							type='checkbox'
							checked={onlyMatching}
							onChange={event => onOnlyMatchingChange(event.target.checked)}
						/>
						<span>Только строгие совпадения с профилем</span>
					</label>

					<div className={styles.weightsGrid}>
						{Object.entries(weights).map(([criterion, value]) => (
							<label key={criterion} className={styles.weightControl}>
								<span>{criteriaLabels[criterion] ?? criterion}</span>
								<input
									type='range'
									min='0'
									max='30'
									step='1'
									value={value}
									onChange={event => onWeightChange(criterion, event.target.value)}
								/>
								<strong>{value}</strong>
							</label>
						))}
					</div>
				</section>
			) : null}
		</Container>
	)
}

export default Sort
