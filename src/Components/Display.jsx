import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Latex from 'react-latex-next';
import '../css/Display.css';
import 'katex/dist/katex.min.css'

class Display extends Component {
	constructor(props) {
		super(props);

		this.state = {}
		this.renderLatex = this.renderLatex.bind(this);
		this.renderLink = this.renderLink.bind(this);
	}

	renderLatex(str) {

		let start_idx = str.indexOf("$");
		let end_idx = str.indexOf("$", start_idx+1);

		// let first_part = str.substring(0, start_idx);
		let latex_part = <Latex strict>{"$" + str.substring(start_idx, end_idx+1) + "$"}</Latex>;
		// let end_part = str.substring(end_idx+2);

		// return <span key={i} className="block">{first_part}{latex_part}{end_part}</span>;
		return [latex_part, start_idx, end_idx+2];
	}

	renderLink(str, i) {
		let symbol = "<a>";
		let start_idx = str.indexOf(symbol);
		let end_idx = str.indexOf("</a>", start_idx+1);
		let link = str.substring(start_idx+symbol.length, end_idx);
		return [<a href={link}>{link}</a>, start_idx, end_idx+4];
	}

	render() {
		let response = JSON.stringify(this.props.response);

		let codeStr = '';
		if(response !== '{}') {
			this.props.response.Code.map((line, i) => {
				return codeStr += line + "\n";
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
						{codeStr}
					</SyntaxHighlighter>
				}

				{response !== '{}' && <hr/>}

				{response !== '{}' && <h2>Explanation</h2>}

				{response !== '{}' && 
					<div className="explanation">{this.props.response.Explanation.map((line, i) => {
						let elem = null;
						let link = '';
						let latex_i = -1, latex_j = -1, link_i = -1, link_j = -1;
						let latex = ''
						if(line.includes("$")) {
							[latex, latex_i, latex_j] = this.renderLatex(line, i);
						}
						if(line.includes("<a>")) {
							[link, link_i, link_j] = this.renderLink(line);
						}

						if(latex_i >= 0 && link_i < 0) {
							let f = line.substring(0, latex_i);
							let l = line.substring(latex_j);
							elem = <span key={i} className="block">{f}{latex}{l}</span>
						} else if(latex_i < 0 && link_i >= 0) {
							let f = line.substring(0, link_i);
							let l = line.substring(link_j);
							elem = <span key={i} className="block">{f}{link}{l}</span>
						
						} else if(latex_i >=0 && link_i >= 0) {

							if(latex_i < link_i) {
								let f = line.substring(0, latex_i);
								let m = line.substring(latex_j, link_i);
								let l = line.substring(link_j);
								elem = <span key={i} className="block">{f}{latex}{m}{link}{l}</span>
							} else {
								let f = line.substring(0, link_i);
								let m = line.substring(link_j, latex_i);
								let l = line.substring(latex_j);
								elem = <span key={i} className="block">{f}{link}{m}{latex}{l}</span>
							}
							
						} else {

							 elem = <span key={i} className="block">{line}</span>;
						}

						return elem;

					})}</div>
				}
			</div>
		);
	}
}

export default Display;