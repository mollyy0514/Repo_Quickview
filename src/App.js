/*
REFERENCE:
repoList: https://www.youtube.com/watch?v=ue-Ypk4xDJc
request: https://github.com/octokit/request.js#request
*/

import {BrowserRouter as Router, Route, Switch, Routes} from 'react-router-dom';

import Title from "./Title.js";
import Search from "./Search.js";

function App() {

	return (
		<Router>
			<div className="App">
				<Title />
				<Search />
			</div>
		</Router>
	);
}

export default App;
