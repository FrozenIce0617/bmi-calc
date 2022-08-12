import { PlayerInfo } from 'components/App/types';

export type BmiInfo = {
	date: string;
	weight: number;
	height: number;
};

export type Props = {
	info: PlayerInfo;
	change: (val: BmiInfo) => void;
};
