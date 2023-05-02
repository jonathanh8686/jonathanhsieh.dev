var _initial = '2023-04-25T16:50:00.000Z';
var end = new Date(_initial);

const interval = setInterval(() => {
    var curr = new Date();
    var differenceTravel = end.getTime() - curr.getTime();

    var seconds = differenceTravel/1000;
    var minutes = seconds/60;
    var hours = minutes/60;
    var days = hours/24;

    document.getElementById("timer").innerText = `${Math.floor(days)} ${Math.floor(hours%24)} ${Math.floor(minutes%60)} ${Math.floor(seconds%60)}`;

}, 1000)
