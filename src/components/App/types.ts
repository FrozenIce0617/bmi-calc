export type DataType = {
	date?: any;
	bmi?: any;
};

export type PlayerInfo = {
	firstname: string;
	lastname: string;
	weight: {
		kilograms: string;
		pounds: string;
	};
	height: {
		meters: string;
	};
};
