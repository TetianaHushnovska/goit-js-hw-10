import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;
const timePicker = document.getElementById('datetime-picker');
let userSelectedDate=null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startBtn.disabled = true;
        }
        else {
            startBtn.disabled = false;
        }
  },
};

flatpickr(timePicker, options);

let daysDisplay = document.querySelector('[data-days]');
let hoursDisplay = document.querySelector('[data-hours]');
let minutesDisplay = document.querySelector('[data-minutes]');
let secondsDisplay = document.querySelector('[data-seconds]');

let intervalId;

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    timePicker.disabled = true;

    intervalId=setInterval(() => {
        const now = new Date();
        const timeLeft = userSelectedDate - now;
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            iziToast.success({
                title: 'Success',
                message: 'Countdown finished',
            });
            timePicker.disabled = false;
        }
        else {
            const { days, hours, minutes, seconds } = convertMs(timeLeft);
            daysDisplay.textContent = addLeadingZero(days);
            hoursDisplay.textContent = addLeadingZero(hours);
            minutesDisplay.textContent = addLeadingZero(minutes);
            secondsDisplay.textContent = addLeadingZero(seconds);
        }
    }, 1000);
})

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}