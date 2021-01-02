import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import '../css/Display.css';

class Display extends Component {
	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		let response = JSON.stringify(this.props.response);

		let str = '';
		if(response !== '{}') {
			this.props.response.Code.map((line, i) => {
				return str += line + "\n";
			});
		}

		return(
			<div className="display">
				{response === '{}' && 
					<div className="placeholder-container">
						<h1 className="placeholder">Search for a problem.</h1>
						<h2 className="placeholder">The solution will appear here.</h2>
						<h3 className="placeholder">&lt;\&gt;</h3>
					</div>
				}

				{response !== '{}' && <p className="author">Solution by: {this.props.response.Author}</p>}
				
				{response !== '{}' && <h1>{this.props.response.Name}</h1>}
				
				{response !== '{}' && <p className="problem-link"><a href={`${this.props.response.Problem_Link}`} rel="noopener noreferrer" target="_blank">{this.props.response.Problem_Link}</a></p>}

				{response !== '{}' && <h2>Code</h2>}

				{response !== '{}' && 
					<SyntaxHighlighter
						language={this.props.response.Language}
						showLineNumbers={true}
					>
						{str}
					</SyntaxHighlighter>
				}

				{response !== '{}' && <hr/>}

				{response !== '{}' && <h2>Explanation</h2>}

				{response !== '{}' && 
					<div className="explanation">{this.props.response.Explanation.map((line, i) => {
						return <span className="block" key={i}>{line}</span>
					})}</div>
				}
			</div>
		);
	}
}

export default Display;