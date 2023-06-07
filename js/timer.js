let timeMin = { label: "minimum", hours: 0, minutes: 0, seconds: 15 };
let timeMax = { label: "maximum", hours: 0, minutes: 1, seconds: 0 };
let selectTimeObject = null;

function selectTimeModal(type) {
    timeObject = type == 'Minimum' ? timeMin : timeMax
    document.getElementById('selectTimeModalTitle').innerHTML = type;

    initFields(timeObject);
    $("#selectTimeModal").modal('show');
}

function initFields(timeObject) {
    document.getElementById('hours').value = timeObject.hours;
    document.getElementById('minutes').value = timeObject.minutes;
    document.getElementById('seconds').value = timeObject.seconds;
}

function saveTime() {
    if (!validInputTime()) return;

    $("#selectTimeModal").modal('hide');

    timeObject.hours = checkEmpty(document.getElementById('hours').value);
    timeObject.minutes = checkEmpty(document.getElementById('minutes').value);
    timeObject.seconds = checkEmpty(document.getElementById('seconds').value);

    document.getElementById(timeObject.label + 'Btn').innerHTML = timeText(timeObject);
    validateTime();
}

function timeText(timeObject) {
    return (formatTime(timeObject.hours, "hours")
        + formatTime(timeObject.minutes, "minutes")
        + formatTime(timeObject.seconds, "seconds")).trim();
}

function formatTime(value, label) {
    return value > 0 ? (value + ' ' + label + ' ') : '';
}

function validateTime() {
    if (isValidTime()) {
        clearComponents()
        return;
    };

    document.getElementById('startBtn').disabled = true;
    document.getElementById('maximumBtn').style.color = 'red';
}

function isValidTime() {
    var minS = calculateSecondsSummary(timeMin);
    var maxS = calculateSecondsSummary(timeMax);

    return minS > 0 && minS < maxS
}

function calculateSecondsSummary(timeObject) {
    return (timeObject.hours * 60 * 60) + (timeObject.minutes * 60) + (timeObject.seconds * 1);
}

function clearComponents() {
    document.getElementById('startBtn').disabled = false;
    document.getElementById('maximumBtn').style.color = 'black';
}

function checkEmpty(value) {
    if (value == '')
        return 0;
    return value;
}

function validInputTime() {
    var isValidHours = validTimeComponent('hours');
    var isValidMinutes = validTimeComponent('minutes');
    var isValidSeconds = validTimeComponent('seconds');

    var isValidMinTime = checkMinTime();

    return isValidHours && isValidMinutes && isValidSeconds && isValidMinTime;
}

function validTimeComponent(name) {
    var comp = document.getElementById(name);
    var val = parseInt(checkEmpty(comp.value));

    var isValid = val >= comp.min && val <= comp.max;

    if (!isValid)
        comp.style.color = 'red';
    else
        comp.style.color = 'black';

    return isValid;
}

function checkMinTime() {
    var hours = document.getElementById('hours').value;
    var minutes = document.getElementById('minutes').value;
    var seconds = document.getElementById('seconds').value;

    if (hours > 0 || minutes > 0 || seconds > 0) {
        document.getElementById('seconds').style.color = 'black';
        return true;
    }

    document.getElementById('seconds').style.color = 'red';
    return false;
}

//----------------------------------------------------------------

function start() {
    if (!isValidTime()) return;

    var secondsTime = getRandomInRange(calculateSecondsSummary(timeMin), calculateSecondsSummary(timeMax));

    var timeObj = toTimeObject(secondsTime);
    document.getElementById('timeInfo').innerHTML = showCountDown() ? timeText(timeObj) : "In progress...";

    startTimer(secondsTime);
}

function getRandomInRange(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

function toTimeObject(totalSeconds) {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours: hours, minutes: minutes, seconds: seconds };
}

var timerInterval;

function startTimer(secondsTime) {
    document.getElementById('timer').style.display = "block";
    document.getElementById('timeInfo').classList.add('text-pulse');

    if (showCountDown())
        initProgressBar(secondsTime);

    hideSettingsPanel();
    showCountDownProperties();

    timerInterval = setInterval(() => {

        secondsTime--;

        if (secondsTime <= 10 && secondsTime>0)
            playAudio('beep');

        if (showCountDown()) {
            var timeObj = toTimeObject(secondsTime);
            document.getElementById('timeInfo').innerHTML = timeText(timeObj);
            changeProgressBarValue(secondsTime);
        }

        if (secondsTime <= 0) {
            playAudio('ringTone');
            clearTimer();
        }
    }, 1000);
}

function clearTimer() {
    document.getElementById('timeInfo').innerHTML = 'TIME UP!';
    document.getElementById('timeSettings').style.display = "block";

    hideCountDownProperties();
    clearInterval(timerInterval);

    document.getElementById('timeInfo').classList.remove('text-pulse');
}

function initProgressBar(secondsTime) {
    var progressBarComp = document.getElementById("timeProgress");
    progressBarComp.min = 0;
    progressBarComp.max = secondsTime;
    progressBarComp.value = secondsTime;
    progressBarComp.style.display = "block";
}

function changeProgressBarValue(value) {
    var progressBarComp = document.getElementById("timeProgress");
    progressBarComp.value = value;
}

function hideSettingsPanel() {
    document.getElementById('timeSettings').style.display = "none";
}

function showCountDownProperties() {
    document.getElementById('cancelBtn').style.display = "block";

    if (!showCountDown())
        return;

    document.getElementById('timeProgress').style.display = "block";
}

function cancel() {
    clearTimer();
    document.getElementById('timeInfo').innerHTML = 'Countdown canceled!';

}
function hideCountDownProperties() {
    document.getElementById('timeProgress').style.display = "none";
    document.getElementById('cancelBtn').style.display = "none";
}

function showCountDown() {
    return document.getElementById('showCountDown').checked;
}

function isSoundEnabled() {
    return document.getElementById('sound').checked;
}

function playAudio(name) {
    if (!isSoundEnabled()) return;

    var audio = new Audio('audio/' + name + '.wav');
    audio.play();
}
