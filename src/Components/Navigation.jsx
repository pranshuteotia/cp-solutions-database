import React, { Component } from 'react';
import { Form, FormControl, Nav, Navbar } from 'react-bootstrap';
import '../css/Navigation.css'

class Navigation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			files: [],
			display_results: [],
			query: ''
		}

		this.keyHandler = this.keyHandler.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.loadFile = this.loadFile.bind(this);
	}

	componentDidMount() {
		fetch("/test")
				.then(res => res.json())
				.then(res => {
					let files = [];

					for(let file of res.files) {
						files.push(file.split('.')[0]);
					}

					this.setState({
						files
					})
				})
				.catch(err => err);
	}

	onSubmit(event) {
		event.preventDefault();
	}

	keyHandler(event) {
		let query = event.target.value;
		let display_results = [];
		
		if(query.length !== 0 && event.key !== "Enter") {
			for(let file of this.state.files) {
				if(file.includes(query)) {
					display_results.push(file);
				}
			}
		}
		this.setState({
			query,
			display_results
		})
	}

	loadFile(event) {
		let filename = event.target.dataset.name;
		let url = `/get_file?filename=${filename}`
		fetch(url)
			.then(res => res.json())
			.then(res => {
				this.props.get_data(res);
			})
			.catch(err => err);
	}

	render() {
		return(
			<Navbar bg="light" expand="lg" className="flex-column">
				<Navbar.Brand href="#home">CP Solutions Database</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="align-items-start">

					<Nav className="flex-column">
						<Nav.Link href="#">About</Nav.Link>

						<Form onSubmit={this.onSubmit}>
							<FormControl type="text" placeholder="Search" onKeyUp={this.keyHandler}/>
							{this.state.files.length !== 0 && (
								<ul className="results">
									{this.state.display_results.map( (file, i) => {
										let start_idx = file.indexOf(this.state.query);
										let end_idx = start_idx + this.state.query.length;

										let first = file.substring(0, start_idx);
										let mid = <span data-name={file} className="highlight">{file.substring(start_idx, end_idx)}</span>;
										let last = file.substring(end_idx);

										return <li data-name={file} key={i} onClick={this.loadFile}>{first}{mid}{last}</li>
									})}
								</ul>
							)}
						</Form>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default Navigation;