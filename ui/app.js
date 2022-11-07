let speedometer = false;
let unit = 'km/h';
let multiply = 3.6;
let oldSpeed = 0;

fetch('https://east_hud/ready', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
        show: true
    })
}).then(resp => resp.json()).then(resp => console.log(resp));

window.addEventListener('message', (event) => {
    if ((event.data.action) === 'show') {
        document.querySelector('.status').style.display = 'flex';
    } else if ((event.data.action) === 'hide' && event.data.opacity || event.data.opacity === 0) {
        document.querySelector('.status').style.opacity = event.data.opacity;
    } else if (event.data.action === 'health' && event.data.health || event.data.health === 0) {
        document.querySelector('.health .fill').style.height = event.data.health + '%';
        if (event.data.health <= 0) {
            document.querySelector('.health i').style.opacity = 0.502;
        } else {
            document.querySelector('.health i').style.opacity = 1;
        }
    } else if (event.data.action === 'armour' && event.data.armour || event.data.armour === 0) {
        document.querySelector('.armour .fill').style.height = event.data.armour + '%';
        if (event.data.armour <= 0) {
            document.querySelector('.armour i').style.opacity = 0.502;
        } else {
            document.querySelector('.armour i').style.opacity = 1;
        }
    } else if (event.data.action === 'food' && event.data.food || event.data.food === 0) {
        document.querySelector('.food .fill').style.height = event.data.food + '%';
        if (event.data.food <= 0) {
            document.querySelector('.food i').style.opacity = 0.502;
        } else {
            document.querySelector('.food i').style.opacity = 1;
        }
    } else if (event.data.action === 'water' && event.data.water || event.data.water === 0) {
        document.querySelector('.water .fill').style.height = event.data.water + '%';
        if (event.data.water <= 0) {
            document.querySelector('.water i').style.opacity = 0.502;
        } else {
            document.querySelector('.water i').style.opacity = 1;
        }
    } else if (event.data.action === 'speedometer' && event.data.speedometer) {
        if (event.data.speedometer === 'show') {
            document.querySelector('.carhud').style.display = 'flex';
            speedometer = true;
            if (!event.data.metric) {
                unit = 'mph';
                multiply = 2.236936;
            }
            document.querySelector('#unit').innerText = unit;
        } else if (event.data.speedometer === 'hide') {
            document.querySelector('.carhud').style.display = 'none';
            speedometer = false;
        }
    } else if (event.data.action === 'fuel' && speedometer && event.data.fuel || event.data.fuel === 0) {
        document.querySelector('.fuel .fill').style.height = event.data.fuel + '%';
        if (event.data.fuel <= 0) {
            document.querySelector('.fuel i').style.opacity = 0.502;
        } else {
            document.querySelector('.fuel i').style.opacity = 1;
        }
    } else if (event.data.action === 'speed' && event.data.speed && speedometer) {
        animateValue('#speed', oldSpeed, Math.round(event.data.speed * multiply), 200)
        oldSpeed = Math.round(event.data.speed * multiply);
        if (oldSpeed <= 0) {
            document.querySelector('#speed').style.opacity = 0.502;
        } else {
            document.querySelector('#speed').style.opacity = 1;
        }
    } else if (event.data.action === 'seatbelt' && speedometer) {
        if (event.data.seatbelt) {
            document.querySelector('.seatbelt i').setAttribute('class', 'fa-solid fa-user');
            document.querySelector('.seatbelt').style.backgroundColor = '#43A047'
            document.querySelector('.seatbelt i').style.opacity = 1
        } else if (!event.data.seatbelt) {
            document.querySelector('.seatbelt i').setAttribute('class', 'fa-solid fa-user-slash');
            document.querySelector('.seatbelt').style.backgroundColor = '#E53935'
            document.querySelector('.seatbelt i').style.opacity = 0.502
        }
    }
});

function animateValue(id, start, end, duration) {
    if (start === end) return;
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let obj = document.querySelector(id);
    let timer = setInterval(function () {
        current += increment;
        obj.innerText = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}