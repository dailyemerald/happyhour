/**
* @jsx React.DOM
*/

var delta_t = function() {
	return new Date - window._top;
}

$(document).ready(function() {
	$.getJSON('/data.json').success(function(data) {
		console.log("got data in ", delta_t());

		React.renderComponent(
          <ExampleApplication data={data} />, document.getElementById('container')
        );

	}).error(function() {
		alert("couldn't load data! please retry.");
		// TODO: LOG ERROR
	});

});

var ExampleApplication = React.createClass({
	render: function() {
		console.log(this.props.data, delta_t());

		return <p>
			{this.props.data[0].name}
		</p>;
	}
});      