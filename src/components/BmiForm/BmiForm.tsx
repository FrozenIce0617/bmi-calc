import React from 'react';

import { Props } from './type';
import '../App/App.css';

const BmiForm = ({ info, change }: Props) => {
	const height = parseFloat(info.height.meters) * 100;
	const weight = parseFloat(info.weight.kilograms);

	const handleSubmit = () => {
		const date = new Date().toLocaleString().split(',')[0];
		change({
			date,
			weight,
			height,
		});
	};

	return (
		<>
			<div className="row">
				<div className="col m6 s12">
					<label htmlFor="weight">Weight (in kg)</label>
					<input
						id="weight"
						name="weight"
						type="number"
						min="1"
						max="999"
						placeholder="50"
						value={parseFloat(info.weight.kilograms)}
						disabled
					/>
				</div>

				<div className="col m6 s12">
					<label htmlFor="height">Height (in cm)</label>
					<input
						id="height"
						name="height"
						type="number"
						min="1"
						max="999"
						placeholder="176"
						value={height}
						disabled
					/>
				</div>
			</div>
			<div className="center">
				<button
					id="bmi-btn"
					className="calculate-btn"
					type="button"
					onClick={handleSubmit}
				>
					Calculate BMI
				</button>
			</div>
		</>
	);
};

export default BmiForm;
