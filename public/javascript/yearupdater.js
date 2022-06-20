var _initial = '2020-09-09T00:00:00.000Z';
var fromTime = new Date(_initial);

var totalSeconds = 115100000

const interval = setInterval(() => {
    var toTime = new Date();
    var differenceTravel = toTime.getTime() - fromTime.getTime();
    var seconds = differenceTravel / 1000;
    document.getElementById("year-dec").innerText = (4*seconds/totalSeconds).toString().substring(0, 10);
}, 1)
