/**
* @jsx React.DOM
*/

var delta_t = function() {
	return new Date - window._top;
}

console.log("at top of app.js at ", delta_t());

var HappyHourList = React.createClass({
	getInitialState: function() {
    	return {data: []};
  	},
	componentWillMount: function(data) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'GET',
			success: function(data) { 
				console.log("got data.json at", delta_t())
				this.setState({data: data}) 
			}.bind(this),
			error: function(xhr, status, err) { 
				console.error("data.json", status, err.toString()) 
			}.bind(this)
		});
	},
	render: function() {
		var happy_hour_items = this.state.data.map(function(item, index) {			
			return <HappyHourItem data={item} />
		});	
		console.log("built <HappyHourItems> with .map at ", delta_t())
		return <ul>{happy_hour_items}</ul>;		
	}
});      

var HappyHourItem = React.createClass({
	render: function() {
		console.log('HappyHourItem', this.props.data, delta_t());
		return (
			<li>
				<h3>{this.props.data.name}</h3>
				<p class="address">Address: {this.props.data.address}</p>
			</li>
		)
	}
});

$(document).ready(function() {
	React.renderComponent(
		<HappyHourList url={"/data.json"} data={[]} />, document.getElementById('container')
	);	
});
