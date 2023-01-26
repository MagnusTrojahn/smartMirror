//Initializing variables 
//video
let video;

//handtracking
let handPose;
let hands;
let fingerPressed = false;
let threshold;
let pointA;
let pointB;

//News
let newsStory;
let newsIndex=1;
let newsSize;
let storyRead=false;

//Pictures
let newspaper;
let sun;
let rightarrow;
let leftarrow;

//Loads weather API.
function preload() {
  // The URL for the JSON data (replace "imperial" with "metric" for celsius)
  let url= "https://api.openweathermap.org/data/2.5/weather?q=New%20York&units=imperial&APPID=e812164ca05ed9e0344b89ebe273c141";
  json = loadJSON(url);
}

//Calculates distance between two fingers/points
//Returns true if distance is below threshold
//The two points correspond to pointerfinger and thumb tips
function isFingerPressed(fingerA, fingerB) {
  if(fingerA && fingerB){
    let distance = dist(fingerA[0],fingerA[1],fingerA[2],fingerB[0],fingerB[1],fingerB[2]);
    if(distance < threshold) {
      return true;
    }
  }
  return false;
}
//Gets position of fingers 
function getFingerPosition(){
  if(pointA){
      return [pointA[0], pointA[1]];
  }else{
      return [0,100000];
  }
}
//Draws the weather button
function drawWeatherButton() {
  let buttonX = 50;
  let buttonY = 40;
  let buttonWidth = 100;
  let buttonHeight = 100;
  
  let fingerPosition = getFingerPosition();
  let fingerPointX = fingerPosition[0];
  let fingerPointY = fingerPosition[1];
  // pointA and pointB contains the coordinates of the points in a 3d space
  
  //Varaible that returns true if fingers are within bounds of the button 
  //And if pointer finger and thumb are connected
  let buttonIsPressed =
    fingerPointX > buttonX &&
    fingerPointX < buttonX + buttonWidth &&
    fingerPointY > buttonY &&
    fingerPointY < buttonY + buttonHeight &&
    isFingerPressed(pointA, pointB);

  //Calls the weatherforecast draw function if the button is pressed, else just displays button
  if (buttonIsPressed) {
    print("button pressed");
    stroke(0)
    fill (0,255, 0 ,50);
    drawWeatherInfo();
  } else {
    stroke(0)
    fill(255,50);
  }
  //Draws rectancle for button
  rect(buttonX, buttonY, buttonWidth, buttonHeight,20);
  fill(0);
  //Draws image of sun to represent weather 
  push();
  translate(width,0);
  scale(-1,1);
  tint(255,127);
  image(sun, 480, 35, 115, 115);
  pop();
}
//draws news button
function drawNewsButton() {
  let buttonX = 50;
  let buttonY = 150;
  let buttonWidth = 100;
  let buttonHeight = 100;
  
  let fingerPosition = getFingerPosition();
  let fingerPointX = fingerPosition[0];
  let fingerPointY = fingerPosition[1];

  //Varaible that returns true if fingers are within bounds of the button 
  //And if pointer finger and thumb are connected
  let buttonIsPressed =
    fingerPointX > buttonX &&
    fingerPointX < buttonX + buttonWidth &&
    fingerPointY > buttonY &&
    fingerPointY < buttonY + buttonHeight &&
    isFingerPressed(pointA, pointB);

  //Calls drawNews function and changes storyRead variable to true. This is so that next and previous buttons only increment the index once per press (rather than for every frame)
  if (buttonIsPressed) {
    print("button pressed");
    drawNews();
    storyRead = true;
    stroke(0)
    fill (0,255, 0 ,50);
  } else {
    stroke(0)
    fill(255,50);
  }
  //draws rectancle and newspaper image
  rect(buttonX, buttonY, buttonWidth, buttonHeight,20);
  push();
  translate(width,0);
  scale(-1,1);
  fill(0);
  tint(255,127);
  image(newspaper, 465, 135, 150, 150);
  pop();
  
}
//next news button
function drawNextNewsButton() {
  let buttonX = 50;
  let buttonY = 265;
  let buttonWidth = 50;
  let buttonHeight = 50;
  
  let fingerPosition = getFingerPosition();
  let fingerPointX = fingerPosition[0];
  let fingerPointY = fingerPosition[1];

  //Works like previous buttons
  let buttonIsPressed =
    fingerPointX > buttonX &&
    fingerPointX < buttonX + buttonWidth &&
    fingerPointY > buttonY &&
    fingerPointY < buttonY + buttonHeight &&
    isFingerPressed(pointA, pointB);

  
  if (buttonIsPressed ) {
    print("button pressed");
    //Conditional statement, increments the newsIndex variable by one if there are more news to read, and if you have already seen the currently selected news story
    //newsSize-1 because the JSON of news is emtpy at highest index
    if (newsSize-1>newsIndex && storyRead ==true){
        newsIndex=newsIndex+1;
        storyRead=false;
    }
    print(newsIndex);
    stroke(0)
    fill (0,255, 0 ,50);
  } else {
    stroke(0)
    fill(255,50);
  }
  //draws rectancle and arrow
  rect(buttonX, buttonY, buttonWidth, buttonHeight,15);
   push();
  translate(width,0);
  scale(-1,1);
  fill(0);
  tint(255,127);
  image(rightarrow, 545,270,40,40);
  pop();
}
function drawPreviousNewsButton() {
  let buttonX = 100;
  let buttonY = 265;
  let buttonWidth = 50;
  let buttonHeight = 50;
  
  let fingerPosition = getFingerPosition();
  let fingerPointX = fingerPosition[0];
  let fingerPointY = fingerPosition[1];

  // Works like previous buttons
  let buttonIsPressed =
    fingerPointX > buttonX &&
    fingerPointX < buttonX + buttonWidth &&
    fingerPointY > buttonY &&
    fingerPointY < buttonY + buttonHeight &&
    isFingerPressed(pointA, pointB);

  if (buttonIsPressed ) {
    print("button pressed");
    //Conditional statement, de-increments newsIndex by one if you have read the currently selected story.
    //newsIndex >1 because index 0 is empty.
    if (newsIndex >1 && storyRead == true){
        newsIndex=newsIndex-1;
      storyRead=false;
       }
    
    print(newsIndex);
    stroke(0)
    fill (0,255, 0 ,50);
  } else {
    stroke(0)
    fill(255,50);
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight,15);
   push();
  translate(width,0);
  scale(-1,1);
  fill(0);
  tint(255,127);
  image(leftarrow, 495,270,40,40);
  pop();
}
//Handtracking - sets handpose
function modelReady() {
  console.log("hand pose loaded");
  handpose.on("predict", gotPose);
}

function gotPose(results) {
  hands = results;
}

function setup() {
    //WeatherAPI
  // Get the temperature
  temperature = json.main.temp;
  // gets the forecast description.
  weather = json.weather[0].description;
  
  //NewsAPI connecting
  const options = {
	method: 'GET',
	headers: {
		'X-BingApis-SDK': 'true',
		'X-RapidAPI-Key': '3f925595d0msh959e10482b5350cp10e63djsn4dd6f389750e',
		'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
	}
}
  //Gets an JSON of newsstories, with headlines and bodytext
function getNews(){
    fetch('https://bing-news-search1.p.rapidapi.com/news/search?q=%3CREQUIRED%3E&freshness=Day&textFormat=Raw&safeSearch=Off', options)
      .then(response => response.json())
      .then(response => responseHandler(response))
      .catch(err => console.error(err));
  }
  //calls function
  getNews();
  //creates canvas
  createCanvas(640, 480);
  //Sets up video
  video = createCapture(VIDEO);
  video.hide();
  //Handtracking setup
  handpose = ml5.handpose(video, modelReady);
  //loads images
  newspaper = loadImage("Images/newspaper.png");
  sun = loadImage("Images/sun.png");
  rightarrow=loadImage("Images/rightarrow.png");
  leftarrow=loadImage("Images/leftarrow.png");
}
//function to set newsStory to be JSON of stories, news size to be the size of the JSON.
function responseHandler(response){
  newsSize = response.value.length;
  newsStory = response;
}

function drawHand(hand) {
//decides that thumb and pointer are pointA & pointB, meaning these fingers determine if isFingerIsPressed returns true
  pointA = hand.landmarks[4];
  pointB = hand.landmarks[8];
}
//draws clock
function drawClock(){
  fill(255);
  se = second()
  mi = minute()
  h = hour()
  d = day()
  m = month()
  y = year()
  textSize(30)
  text(h + ':' + mi + ':' + se, 20, 40)
  textSize(15)
  text(m + '.' + d + '.' + y, 25, 65)
  stroke(0);
  strokeWeight(15);
}

function draw() {
  background(255);
  //flips video
  translate(width,0);
  scale(-1, 1);
  if (video) {
    push();
    image(video, 0, 0);
    pop()
  }
  //calls draw functions
  drawWeatherButton();
  drawNewsButton();
  drawNextNewsButton();
  drawPreviousNewsButton();
  
   //Flips clock
  push();
  translate(width,0);
  scale(-1, 1);
  drawClock();
  pop();
  //determainse threshold
  threshold = 35;
  //draws hands if they are detected
  if (hands && hands.length > 0) {
    let hand = hands[0];
    drawHand(hand);
    drawKeypoints(hand);    
  }
  fill(255,0,129);

}
 
//draws keypoint of the detected hand 
function drawKeypoints(hand) {
  
  for (let j = 0; j < hand.landmarks.length; j += 1) {
    const keypoint = hand.landmarks[j];
    fill(255, 204, 0);
    stroke(255, 150, 0);
    ellipse(keypoint[0], keypoint[1], 10, 10);
    fill(0);
  }
}

function drawNews(){
 //Flip
  push();

  translate(width,0);
  scale(-1, 1);
  fill(255,50);
  //Determaines size of headline and body for newsstory
  namelenght=textWidth(newsStory.value[newsIndex].name+20);
 bodylenght=textWidth(newsStory.value[newsIndex].description)/3+20;
  //Rectangels are fit to size of text
  rect(10,350,namelenght,35,10);
  rect(10,400,bodylenght,70,10);
  // Displays newstory headline and body
  fill(255);
  stroke(0);
  text(newsStory.value[newsIndex].name,15,355,namelenght,35);
  text(newsStory.value[newsIndex].description,15,405,bodylenght,70);
  pop(); 
}


function drawWeatherInfo() {
  //Flip
  push();
  translate(width,0);
  scale(-1, 1);
  fill(255,50);
  // Display area for weatherinfo
  rect(10,350,150,20,15);
  rect(10,380,150,20,15);
  rect(10,410,150,20,15);
  
  fill(255);
  stroke(0);
  text("City: Roskilde, Denmark", 15, 365);
  //Ferenheit conversion
  text("Current temperature: " + round( 5/9 * (temperature-32))+" c.", 15, 395);
  text("Forecast: " + weather, 15, 425);
  
  pop();
}