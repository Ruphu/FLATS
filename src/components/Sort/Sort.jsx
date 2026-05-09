import { useState } from 'react'
import Container from '@shared/Container'
import Button from '@shared/Button'
import styles from './Sort.module.scss'

const criteriaLabels = {
	price: 'Цена',
	area: 'Площадь',
	rooms: 'Комнаты',
	district: 'Район',
	transport: 'Метро и транспорт',
	infrastructure: 'Инфраструктура',
	condition: 'Состояние',
	house_type: 'Тип дома',
	floor: 'Этаж',
	balcony_loggia: 'Балкон/лоджия',
}

const modeTitles = {
	all: 'Все квартиры',
	recommended: 'Подбор квартиры',
	favorites: 'Избранное',
}

const Sort = ({
	mode,
	onlyMatching,
	priority,
	priorityPresets,
	weights,
	compareCount,
	onModeChange,
	onOnlyMatchingChange,
	onPriorityChange,
	onWeightChange,
}) => {
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
	const isRecommended = mode === 'recommended'

	return (
		<Container>
			<section className={styles.sort}>
				<div>
					<h1 className={styles.title}>{modeTitles[mode] ?? modeTitles.all}</h1>
					<p className={styles.subtitle}>
						{isRecommended
							? 'TOPSIS ранжирует варианты по вашему профилю и выбранным весам критериев.'
							: 'Смотрите каталог, персональный подбор или сохраненные квартиры.'}
					</p>
				</div>

				<div className={styles.actions}>
					<Button
						size='lg'
						variant={mode === 'all' ? 'primary' : 'secondary'}
						className={styles.button}
						onClick={() => onModeChange('all')}
					>
						Каталог
					</Button>
					<Button
						size='lg'
						variant={mode === 'recommended' ? 'primary' : 'secondary'}
						className={styles.button}
						onClick={() => onModeChange('recommended')}
					>
						TOPSIS
					</Button>
					<Button
						size='lg'
						variant={mode === 'favorites' ? 'primary' : 'secondary'}
						className={styles.button}
						onClick={() => onModeChange('favorites')}
					>
						Избранное
					</Button>
					<span className={styles.compareBadge}>В сравнении: {compareCount}</span>
				</div>
			</section>

			{isRecommended ? (
				<section className={styles.recommendationPanel}>
					<div className={styles.panelHeader}>
						<div>
							<h2>Приоритет подбора</h2>
							<p>Выберите, что важнее при оценке квартиры.</p>
						</div>
						<label className={styles.matchToggle}>
							<input
								type='checkbox'
								checked={onlyMatching}
								onChange={event => onOnlyMatchingChange(event.target.checked)}
							/>
							<span>Только точные совпадения с профилем</span>
						</label>
					</div>

					<div className={styles.priorityGrid}>
						{Object.entries(priorityPresets).map(([key, preset]) => (
							<button
								key={key}
								type='button'
								className={`${styles.priorityButton} ${
									priority === key ? styles.priorityButtonActive : ''
								}`}
								onClick={() => onPriorityChange(key)}
							>
								{preset.label}
							</button>
						))}
					</div>

					<div className={styles.advanced}>
						<button
							type='button'
							className={styles.advancedToggle}
							onClick={() => setIsAdvancedOpen(current => !current)}
						>
							{isAdvancedOpen ? 'Скрыть веса критериев' : 'Настроить веса вручную'}
						</button>

						{isAdvancedOpen ? (
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
						) : null}
					</div>
				</section>
			) : null}
		</Container>
	)
}

export default Sort
