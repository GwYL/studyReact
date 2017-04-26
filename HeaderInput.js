var ESC_KEY = 13;

window.HeaderInput = React.createClass({
	getInitialState: function() {
		return {
			text: ""
		}
	},
	render: function() {
		return (
			<header id="header">
				<h1>羊村之羊</h1>
				<input type="text" onKeyUp={this.submit} id="new-todo" onChange={this.edit} placeholder="请输入你想吃的羊名" value={this.state.text} autofocus="" />
			</header>
		)
	},
	submit: function(event) {
		//
		if(event.keyCode === ESC_KEY) {
			model.addItem(this.state.text);
			this.setState({
				text: ""
			})
		}
	},
	edit: function(event) {
		this.setState({
			text: event.target.value
		})
	}
})