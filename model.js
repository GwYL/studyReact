function Store(nameSpace, data) {
	if (data) {
		return localStorage.setItem(nameSpace, JSON.stringify(data))
	}
	return JSON.parse(localStorage.getItem(nameSpace)) || {}
}

function Model() {
	this.sheeps = Store("sheeps");

	this.callbackList = []; // 任务队列
}

Model.prototype.clearItem = function() {
	for(var key in this.sheeps) {
		if (this.sheeps[key].completed) {
			delete this.sheeps[key];
		}
	}
	Store("sheeps", this.sheeps);
	this.inform();
}

Model.prototype.save = function(txt, id) {
	this.sheeps[id].context = txt;
	Store("sheeps", this.sheeps);
	this.inform();
}

Model.prototype.allToggle = function(checked) {
	for(var key in this.sheeps) {
		this.sheeps[key].completed = checked;
	}
	this.inform();
}

Model.prototype.addItem = function(txt) {
	//
	this.sheeps[Date.now()] = {
		id: Date.now(),
		completed: false,
		context: txt
	}

	// Store("sheeps", this.sheeps);
	this.inform();
}

Model.prototype.activeItemCount = function() {
	var count = 0;
	for (var key in this.sheeps) {
		if (!this.sheeps[key].completed) {
			count++;
		}
	}

	return count;
}

Model.prototype.destroy = function(id) {
	//
	delete this.sheeps[id];
	Store("sheeps", this.sheeps)
	this.inform();
}

Model.prototype.ItemToggle = function(checked, id) {
	//
	this.sheeps[id].completed = checked;
	this.inform();
}

Model.prototype.register = function(callback) {
	this.callbackList.push(callback);
}

Model.prototype.inform = function() {
	// 订阅、任务订阅
	Store("sheeps", this.sheeps);
	for(var i = 0, len = this.callbackList.length; i < len; i++) {
		this.callbackList[i]();
	}
}

var model = new Model();