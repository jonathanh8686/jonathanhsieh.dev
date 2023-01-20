var _initial = '2002-07-31T00:00:00.000Z';
var fromTime = new Date(_initial);

const interval = setInterval(() => {
    var toTime = new Date();
    var differenceTravel = toTime.getTime() - fromTime.getTime();
    var seconds = differenceTravel / 1000;
    var years = seconds / 31536000
    // var str_seconds = String.format("%-5s", seconds).replace(' ', '0')

    document.getElementById("year-dec").innerText = years.toString().substring(0, 11);
}, 1)
