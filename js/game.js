// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
    princessReady = true;
};
princessImage.src = "images/princess.png";

//stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
    stoneReady = true;
};
stoneImage.src = "images/stone.png";

//monster image
var mosterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";


// Game objects
var hero = {
    speed: 256 // movement in pixels per second //velocidad
};
var princess = {};
var princessesCaught = 0;

var stone = {};

var monster = {
    speed:32
};
var monster1 = {
    speed:32
};
var monster2 = {
    speed:32
};
var monster3 = {
    speed:32
};

var heroContador = 0;

var escenario = 1;


// Handle keyboard controls
var keysDown = {}; //diccionario con teclas presionandolas, pero esta de momento vacio

addEventListener("keydown", function (e) {  //keydown cuando pulsas una tecla salta un evento, y ese evento lo capturas en una funcion y luego usas esa funcion, pero el feydown nos interesa para saber que tecla han usado
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);


function seTocan (jugador1, jugador2){
    if(jugador1.x <= (jugador2.x +32)
        && jugador2.x <= (jugador1.x +32)
        && jugador1.y <= (jugador2.y +32)
        && jugador2.y <= (jugador1.y +32)){
            return true;
    }else{
            return false;
    }    
};


// Reset the game when the player catches a princess
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    if (princessesCaught > 9){
        escenario = 2;
    };


    if (escenario == 1){
        // Throw the princess somewhere on the screen randomly
        princess.x = 32 + (Math.random() * (canvas.width - 96)); //96 para que no se coloquen en los arbustos 
        princess.y = 32 + (Math.random() * (canvas.height - 96));
        
        solape = true;
        while (solape == true){
            monster.x = 32 + (Math.random() * (canvas.width - 96));
            monster.y = 32 + (Math.random() * (canvas.height - 96));
            stone.x = 32 + (Math.random() * (canvas.width - 96));
            stone.y = 32 + (Math.random() * (canvas.height - 96));
            if(seTocan(princess,stone) && seTocan(princess,monster) && seTocan(monster,stone)){
                solape = true;

            }else{
                solape = false;
            }
        }
    }else if (escenario == 2){
        princess.x = 32 + (Math.random() * (canvas.width - 96));
        princess.y = 32 + (Math.random() * (canvas.height - 96));

        solape = true;
        while(solape == true){

            monster1.x = 32 + (Math.random() * (canvas.width - 96));
            monster1.y = 32 + (Math.random() * (canvas.height - 96));
            monster2.x = 32 + (Math.random() * (canvas.width - 96));
            monster2.y = 32 + (Math.random() * (canvas.height - 96));
            monster3.x = 32 + (Math.random() * (canvas.width - 96));
            monster3.y = 32 + (Math.random() * (canvas.height - 96));
            stone.x = 32 + (Math.random() * (canvas.width -96));
            stone.y = 32 + (Math.random() * (canvas.height -96));

            if (seTocan(princess,stone) && seTocan(princess,monster1) && seTocan(monster1,stone) && seTocan(princess,monster2)&& seTocan(monster2,stone2) && seTocan(princess,monster3) && seTocan(monster3,stone)){
                solape = true;
            }else{
                solape = false;
            }
        }
    };
};





// Update game objects
var update = function (modifier) {
    if (38 in keysDown && hero.y > 35) { // Player holding up
        hero.y -= hero.speed * modifier; //.y es su posicion actual
    }
    if (40 in keysDown && hero.y < 410) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > 35) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < 445) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    if(83 in keysDown){
        localStorage.setItem("escenario",escenario);
        localStorage.setItem("princessesCaught", princessesCaught);
        localStorage.setItem("heroContador", heroContador);
    }

    if(76 in keysDown){
        escenario = localStorage.getItem("escenario");
        princessesCaught = localStorage.getItem("princessesCaught");
        heroContador = localStorage.getItem("heroContador");
        reset();
    }


    // Are they touching?
    if (
        seTocan(hero,princess)
    ) {
        ++princessesCaught;
        reset();
    }

    //se tocan la piedra y el heroe 
    if(
        seTocan(hero,stone) && 40 in keysDown || seTocan(hero,stone) && 39 in keysDown)

    {
        hero.x -= 1;
        hero.y -= 1;
    }

    if(
        seTocan(hero,stone) && 38 in keysDown || seTocan(hero,stone) && 37 in keysDown)
    {
        hero.x += 1;
        hero.y += 1;
    }

    //el heroe ha muerto
    function heroDie(monster){
        if(seTocan(hero,monster)
        ){
            heroContador++;
            reset();
        }
    }

    heroDie(monster);
    heroDie(monster1);
    heroDie(monster2);
    heroDie(monster3);
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (princessReady) {
        ctx.drawImage(princessImage, princess.x, princess.y);
    }
    if (stoneReady) {
            ctx.drawImage(stoneImage, stone.x, stone.y);
    }
    if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (monsterReady && escenario == 2) {
            ctx.drawImage(monsterImage, monster1.x, monster1.y);
    }
    if (monsterReady && escenario == 2) {
        ctx.drawImage(monsterImage, monster2.x, monster2.y);
    }
    if (monsterReady && escenario == 2) {
        ctx.drawImage(monsterImage, monster3.x, monster3.y);
    }



    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Princesses caught: " + princessesCaught + " escenario: " + escenario + " muertes: " + heroContador, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
//cada milisegundo mira a ver si el heroe toca  a la princesa
