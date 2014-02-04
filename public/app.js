/**
* @jsx React.DOM
*/

var delta_t = function() {
	return new Date - window._top;
}

var current_day_of_week = function() {
	var days = {
		0: 'Sunday',
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday'
	}
	return days[(new Date()).getDay()];
}

var flatten_bars = function(bars) {
	var output = [];
	bars.forEach(function(bar) {
		bar.happy_hours.forEach(function(happy_hour) {
			var o = {bar: bar, happy_hour: happy_hour};
			output.push(o);
		});
	});
	console.log('flatten_bars', output);
	return output;
}

var get_happy_hours_by_day = function(all_happy_hours, day_of_week) {
	console.log('get_happy_hours_by_day');
	var result_happy_hours = [];
	all_happy_hours.forEach(function(item) {
		if (item.happy_hour.day_of_week == day_of_week) {
			result_happy_hours.push(item);
		}
	});	
	return result_happy_hours;
}

console.log("at top of app.js at ", delta_t());
console.log("today is", current_day_of_week());



var HappyHourList = React.createClass({
	getInitialState: function() {
    	return {data: [], today: [], all_happy_hours: []};
  	},
	componentWillMount: function(data) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'GET',
			success: function(data) { 
				console.log("got data.json at", delta_t());	
				var all_happy_hours = flatten_bars(data);					
				var today = get_happy_hours_by_day(all_happy_hours, current_day_of_week());
				console.log('today', today);
				this.setState({data: data, today: today, all_happy_hours: all_happy_hours});
			}.bind(this),
			error: function(xhr, status, err) { 
				console.error("data.json", status, err.toString()) 
			}.bind(this)
		});
	},
	render: function() {
		console.log('!!!! this.state.today', this.state.today)
		var happy_hour_items_today = this.state.today.map(function(item, index) {			
			return <HappyHourItem data={item} />
		});
		var happy_hour_items_all = this.state.all_happy_hours.map(function(item, index) {			
			return <HappyHourItem data={item} />
		});	
		console.log("built <HappyHourItems> with .map at ", delta_t())
		return (<ul class="today">
					{happy_hour_items_today}
				</ul>
				);
			
	}
});      

var HappyHourItem = React.createClass({
	render: function() {
		//console.log('HappyHourItem', this.props.data, delta_t());
		return (
			<li>
				<h3>{this.props.data.bar.name}</h3>
				<p>{this.props.data.bar.phone}</p>
				<p>{this.props.data.happy_hour.day_of_week}</p>
				<p>{this.props.data.happy_hour.start_time} - {this.props.data.happy_hour.end_time}</p>
				<p><i>{this.props.data.happy_hour.notes}</i></p>
				
			</li>
		)
	}
});

React.renderComponent(
	<HappyHourList url={"/data.json"} />, document.getElementById('container')
);	