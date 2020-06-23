import {
	Category,
	ChartComponent,
	ColumnSeries,
	DataLabel,
	Inject,
	Legend,
	LineSeries,
	SeriesCollectionDirective,
	SeriesDirective,
	Tooltip
} from '@syncfusion/ej2-react-charts';
import Box from "@material-ui/core/Box";
import React from "react";

const LineChart = (props) => {
	const info = props.data
	const mh_data = info.filter(el => el.testResult === "PASSED").map(item => {
		return {
			"year": new Date(item.completedDate).getFullYear(),
			"mileage": parseInt(item.odometerValue)
		}
	}).reverse()

	let initialYear = new Date(props.initialDate).getFullYear()

	let standardMileageLine = []
	let j = 0;
	for (let i = initialYear; i <= new Date().getFullYear(); i++) {
		standardMileageLine.push({
			"year": i,
			"mileage": j * 12000
		})
		++j;
	}

	const primaryxAxis = {valueType: 'Category'}
	return (
		<>
			<Box >
				<ChartComponent id="historyMileage" primaryXAxis={primaryxAxis} chartArea={{border: {width: 0}}}
				                tooltip={{enable: true}}>
					<Inject services={[ColumnSeries, DataLabel, Tooltip, Legend, LineSeries, Category]}/>
					<SeriesCollectionDirective>
						<SeriesDirective dataSource={standardMileageLine} xName='year' yName='mileage' type='Line'
						                 marker={{visible: true, width: 10, height: 10}}
						                 name='Standard Mileage Line'/>
						<SeriesDirective dataSource={mh_data} xName='year' yName='mileage' name='Car Mileage Line' type='Line'
						                 marker={{visible: true, width: 10, height: 10}}/>
					</SeriesCollectionDirective>
				</ChartComponent>
			</Box>
		</>
	)
}
export default LineChart