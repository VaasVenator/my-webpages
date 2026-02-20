const clockElement = document.getElementById("clock");
const dateElement = document.getElementById("date");
const timezoneElement = document.getElementById("timezone");
const formatToggleButton = document.getElementById("format-toggle");

let is24HourFormat = false;
let timerId;

function getTimeFormatter() {
    return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !is24HourFormat
    });
}

function getDateFormatter() {
    return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
    });
}

function getTimezoneLabel(now) {
    const parts = new Intl.DateTimeFormat(undefined, {
        timeZoneName: "short"
    }).formatToParts(now);

    const timezonePart = parts.find((part) => part.type === "timeZoneName");
    return timezonePart ? timezonePart.value : "Local time";
}

function renderClock() {
    if (!clockElement || !dateElement || !timezoneElement) {
        return;
    }

    const now = new Date();
    clockElement.textContent = getTimeFormatter().format(now);
    dateElement.textContent = getDateFormatter().format(now);
    timezoneElement.textContent = `Timezone: ${getTimezoneLabel(now)}`;
}

function scheduleTick() {
    renderClock();

    const millisecondsUntilNextSecond = 1000 - new Date().getMilliseconds();
    timerId = window.setTimeout(scheduleTick, millisecondsUntilNextSecond);
}

function toggleFormat() {
    is24HourFormat = !is24HourFormat;

    if (formatToggleButton) {
        formatToggleButton.setAttribute("aria-pressed", String(is24HourFormat));
        formatToggleButton.textContent = is24HourFormat
            ? "Use 12-hour format"
            : "Use 24-hour format";
    }

    renderClock();
}

if (formatToggleButton) {
    formatToggleButton.addEventListener("click", toggleFormat);
}

window.addEventListener("beforeunload", () => {
    if (timerId) {
        window.clearTimeout(timerId);
    }
});

scheduleTick();
