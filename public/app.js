/**
* @jsx React.DOM
*/

var delta_t = function() {
	return new Date - window._top;
}

var current_day_of_week = function() {
	return ({
		0: 'Sunday',
		1: 'Monday',
		2: 'Tuesday',
		3: 'Wednesday',
		4: 'Thursday',
		5: 'Friday',
		6: 'Saturday'
	})[(new Date()).getDay()];
}

var flatten_bars = function(bars) {
	var output = [];
	bars.forEach(function(bar) {
		bar.happy_hours.forEach(function(happy_hour) {
			var o = {bar: bar, happy_hour: happy_hour};
			output.push(o);
		});
	});
	return output;
}

var get_happy_hours_by_day = function(all_happy_hours, day_of_week) {
	var result_happy_hours = [];
	all_happy_hours.forEach(function(item) {
		if (item.happy_hour.day_of_week == day_of_week) {
			result_happy_hours.push(item);
		}
	});	
	return result_happy_hours;
}

var human_time = function(time_string) {
	var time_pieces = time_string.split(":");
	var hours = parseInt(time_pieces[0], 10)
	var minutes = time_pieces[1];
	if (hours > 12) {
		return (hours-12) + ":" + minutes + " p.m."
	} else if (hours == 12) {
		return "12:" + time + "p.m."
	} else if (hours < 12) {
		return hours + ":" + minutes + " a.m."		
	} else {
		return "can't parse time"
	}
}

var HappyHourList = React.createClass({
	getInitialState: function() {
    	return {data: [], today: [], all_happy_hours: [], day_of_week: current_day_of_week() };
  	},
	componentWillMount: function(data) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'GET',
			success: function(data) { 
				console.log("parsing data.json", delta_t());	
				var all_happy_hours = flatten_bars(data);					
				var today = get_happy_hours_by_day(all_happy_hours, current_day_of_week());
				this.setState({data: data, today: today, all_happy_hours: all_happy_hours});
			}.bind(this),
			error: function(xhr, status, err) { 
				console.error("data.json", status, err.toString()) 
			}.bind(this)
		});
	},
	render: function() {
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
		return (
			<li>
				<h3>{this.props.data.bar.name}</h3>
				<p>{human_time(this.props.data.happy_hour.start_time)} - {human_time(this.props.data.happy_hour.end_time)}</p>
				<p><i>{this.props.data.happy_hour.notes}</i></p>				
			</li>
		)
	}
});

React.renderComponent(
	<HappyHourList url={"/data.json"} />, document.getElementById('container')
);	