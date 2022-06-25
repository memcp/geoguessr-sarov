import places from "./places.js"

var output = document.querySelector('.output');
var image = document.querySelector('img.place');
var map;
var guessCoordinates;
var guessMarker;
var previousPlaceIndex = null;
var scores = 0;


// Инициализирует карту при старте/рестарте игры
var initializeMap = () => {
  var options = { zoomControl: false, doubleClickZoom: false, minZoom: 14 };
  var sarovCenter = [54.925, 43.325];
  var zoomLevel = 14;
  map = L.map('map', options).setView(sarovCenter, zoomLevel);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map);
};

// Проверяет что расстояние находится в диапазоне [min, max)
const inRange = (min, max, distance) => {
  return distance >= min && distance <= max;
};

// Считает количество очков в зависимости от того как близко маркер к загаданной
// точке на карте, если больше 400 метров, то очки не начисляются
var calculateScore = (distance) => {
  var ranges = [
    { min: 0, max: 15, scores: 100 },
    { min: 15, max: 60, scores: 50 },
    { min: 60, max: 200, scores: 25 },
    { min: 200, max: 300, scores: 10 },
    { min: 300, max: 400, scores: 5 },
  ];

  for (var range of ranges) {
    if (inRange(range.min, range.max, distance)) {
      return range.scores;
    }
  }

  return 0;
};

var getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + min));
};

// Получает случайную точку на карте из списка мест
var randomCoordinates = () => {
  var placeIndex;
  placeIndex = getRandomInt(0, places.length);

  while (previousPlaceIndex === placeIndex) {
      placeIndex = getRandomInt(0, places.length);
  }
  previousPlaceIndex = placeIndex;
  return places[placeIndex];
};

// Загадывает новую случайную точку и помещает её на карту
var makeGuess = () => {
  guessCoordinates = randomCoordinates();
  image.src = guessCoordinates.href;
  // guessMarker = new L.circleMarker(guessCoordinates).addTo(map);
}

initializeMap();
var marker = L.marker([54.921, 43.348], { draggable: true }).addTo(map);
makeGuess();

marker.on('moveend', () => {
  var currentPlace = marker.getLatLng();
  var distance = map.distance(currentPlace, guessCoordinates);
  // console.log(currentPlace);
  scores += calculateScore(distance);
  output.innerHTML = 'Очки:' + scores;
  // map.removeLayer(guessMarker);
  setTimeout(() => {
    makeGuess();
  }, 200);
});