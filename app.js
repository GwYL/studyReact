var ItemBar = React.createClass({
	getInitialState: function() {
		return {
			editText: this.props.item.context
		}
	},
	componentDidUpdate: function() {
		//
		console.log("组件更新!");
		var dom = this.refs.editInput;
		dom.focus();
		dom.setSelectionRange(dom.value.length, dom.value.length); // 操作光标位置
	},
	render: function() {
		return (
			<li className={classNames({completed: this.props.item.completed, editing: this.props.editAble})}>
				<div className="view">
					<input type="checkbox" onChange={this.checkStatus} checked={this.props.item.completed} className="toggle" />
					<label onDoubleClick={this.edit}>{this.props.item.context}</label>
					<button className="destroy" onClick={this.delete}></button>
				</div>
				<input onBlur={this.save} className="edit" value={this.state.editText} ref="editInput" onChange={this.change} />
			</li>
		)
	},
	save: function() {
		//
		model.save(this.state.editText, this.props.item.id);
		this.props.onSave();
	},
	edit: function() {
		//
		this.setState({
			editText: this.props.item.context
		})
		this.props.onEdit(this.props.item.id)
	},
	change: function(event) {
		//
		this.setState({
			editText: event.target.value
		})
	},
	checkStatus: function(event) {
		var checked = event.target.checked;
		model.ItemToggle(checked, this.props.item.id);
	},
	delete: function() {
		model.destroy(this.props.item.id)
	}
})

var FooterBar = React.createClass({

	render: function() {
		var count = model.activeItemCount();
		var dis = 10 + "px",
			type = "relative";

		return (
			<footer id="footer">
				<span id="todo-count" style={{position: type, right: dis}}>未选<storng>{count}</storng>头</span>
				<ul id="filters">
					<li><a className={classNames({selected: this.props.curStatus === "#/all"})} href="#/all">所有羊</a></li>
					<li><a className={classNames({selected: this.props.curStatus === "#/active"})} href="#/active">还没被吃掉的羊</a></li>
					<li><a className={classNames({selected: this.props.curStatus === "#/completed"})} href="#/completed">已经吃到肚子里的羊</a></li>
					<button onClick={this.clear} id="clear-completed">清除所有被吃的羊</button>
				</ul>
			</footer>
		)
	},
	clear: function() {
		model.clearItem();
	}
})

var Container = React.createClass({
	getInitialState: function() {
		return {
			nowShowing: "#/all",
			editing: null
		}
	},
	componentDidMount: function() {
		//
		var hash = location.hash;
		this.setState({
			nowShowing: hash
		})

		var me = this;
		window.onhashchange = function() {

			var hash = location.hash;

			me.setState({
				nowShowing: hash
			})
		}
	},
	render: function() {

		var list = [];

		var me = this;

		var count = model.activeItemCount();

		var myModel = this.props.model;

		for (var key in myModel.sheeps) {
			if (this.state.nowShowing === "#/all") {
				list.push(myModel.sheeps[key])
			} else if (this.state.nowShowing === "#/active") {
				if (myModel.sheeps[key].completed === false) {
					list.push(myModel.sheeps[key])
				}
			} else {
				if (myModel.sheeps[key].completed === true) {
					list.push(myModel.sheeps[key])
				}
			}
		}

		var allCheck = count === 0 && count !== list.length ? true : false;

		return (
			<section id="todoapp">
				<HeaderInput></HeaderInput>
				<section id="main">
					<input type="checkbox" onChange={this.allToggle} id="toggle-all" checked={allCheck} />
					<ul id="todo-list">
						{
							list.map(function(value, index) {
								return (
									<ItemBar
									editAble={me.state.editing === value.id}
									onSave={me.save}
									onEdit={me.edit} 
									key={index} 
									item={value}>
									</ItemBar>)
							})
						}
					</ul>
				</section>
				<FooterBar curStatus={this.state.nowShowing}></FooterBar>
			</section>
		)
	},
	save: function() {
		this.setState({
			editing: null
		})
	},
	allToggle: function(event) {
		model.allToggle(event.target.checked)
	},
	edit: function(id) {
		//
		this.setState({
			editing: id
		})
	}
})

function render() {
	ReactDOM.render(
		<Container model={model}></Container>,
		document.getElementById("container")
		)
}

model.register(render);

render();