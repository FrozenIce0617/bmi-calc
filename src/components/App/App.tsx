import React, { useCallback, useMemo, useState, useEffect } from 'react';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import BmiForm from '../BmiForm/BmiForm';
import Info from '../Info/Info';
import Bar from '../Bar/Bar';
import { getData, storeData } from '../../helpers/localStorage';

import { DataType, PlayerInfo } from './types';
import { BmiInfo } from 'components/BmiForm/type';

const App = () => {
	const initialState = () => getData('data') || [];
	const [state, setState] = useState(initialState);
	const [data, setData] = useState<DataType>({});
	const [playerInfo, setPlayerInfo] = useState<PlayerInfo[]>([]);
	const [totalResult, setTotalResult] = useState(0);
	const [activePlayer, setActivePlayer] = useState(0);

	const names = useMemo(
		() =>
			playerInfo.map((item, index) => ({
				name: `${item.firstname} ${item.lastname}`,
				index,
			})),
		[playerInfo]
	);

	const getPlayers = useCallback(async () => {
		try {
			const options = {
				method: 'GET',
				url: 'https://api-nba-v1.p.rapidapi.com/players',
				params: { team: '1', season: '2021' },
				headers: {
					'X-RapidAPI-Key':
						'hmxEdPCXdYmsh3xRj9ZF8siywe6Yp1Qxvd4jsno00BIOdpU8eh',
					'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
				},
			};
			const { data } = await axios.request(options);
			const { response, results } = data;

			setTotalResult(results);
			setPlayerInfo(response);

			console.log('DATA - ', data);
		} catch (err) {
			console.log('ERR - ', err);
		}
	}, []);

	useEffect(() => {
		getPlayers();
	}, [getPlayers]);

	useEffect(() => {
		storeData('data', state);
		const date = state.map((obj: any) => obj.date);
		const bmi = state.map((obj: any) => obj.bmi);
		let newData = { date, bmi };
		setData(newData);
	}, [state]);

	const handleChange = (val: BmiInfo) => {
		let heightInM = val.height / 100;
		const bmiVal = (val.weight / (heightInM * heightInM)).toFixed(2);
		const idVal = uuidv4();

		let newVal = [
			...state,
			{
				...val,
				bmi: bmiVal,
				id: idVal,
			},
		];

		let len = newVal.length;
		if (len > 7) newVal = newVal.slice(1, len);
		setState(newVal);
	};

	const handleDelete = (id: any) => {
		storeData('lastState', state);
		let newState = state.filter((i: any) => {
			return i.id !== id;
		});
		setState(newState);
	};

	const handleUndo = () => {
		setState(getData('lastState'));
	};

	return (
		<div className="container">
			<div className="row center">
				<h1 className="white-text"> BMI Tracker </h1>
			</div>
			<div className="row">
				<div className="col m12 s12">
					<div className="row">
						<div className="col m12 s12">
							<select
								className="select"
								placeholder="Select Player"
								value={activePlayer.toString()}
								onChange={(
									e: React.ChangeEvent<HTMLSelectElement>
								) =>
									setActivePlayer(
										parseInt(e.target.value, 10)
									)
								}
							>
								{names.map((item, index) => (
									<option value={item.index}>
										{item.name}
									</option>
								))}
							</select>
						</div>
					</div>
					{activePlayer && totalResult > activePlayer && (
						<BmiForm
							info={playerInfo[activePlayer]}
							change={handleChange}
						/>
					)}
					<Bar labelData={data.date} bmiData={data.bmi} />
					<div>
						<div className="row center">
							<h4 className="white-text">7 Day Data</h4>
						</div>
						<div className="data-container row">
							{state.length > 0 ? (
								<>
									{state.map((info: any) => (
										<Info
											key={info.id}
											id={info.id}
											weight={info.weight}
											height={info.height}
											date={info.date}
											bmi={info.bmi}
											deleteCard={handleDelete}
										/>
									))}
								</>
							) : (
								<div className="center white-text">
									No log found
								</div>
							)}
						</div>
					</div>
					{getData('lastState') !== null ? (
						<div className="center">
							<button
								className="calculate-btn"
								onClick={handleUndo}
							>
								Undo
							</button>
						</div>
					) : (
						''
					)}
				</div>
			</div>
		</div>
	);
};

export default App;
