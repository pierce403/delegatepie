console.log("oh hi");

function refresh()
{
  console.log("neat");
}

$.getJSON('http://cors.io/?u=http://www.realclearpolitics.com/json/ap_results/2016_primaries/superdelegates.json',
function(data)
{
  console.log(data.delegates.sanders);
  console.log(data.delegates.clinton);
  console.log("The current hash rate is "+window.hash_rate_ph+" ph/s")
  refresh();
});
