import React from 'react';
import { render } from 'react-dom';
import '../style/index.scss';

class Demo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="app-container">
				<span className="app-container--redux">REDUX&nbsp;</span>
				<span className="app-container--world">WORLD</span>
			</div>
		);
	}
}

render(<Demo />, document.getElementById('app'));
