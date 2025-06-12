let trator;
let bolinhas = [];
let cidadeX;
let pontos = 0;
let tempoLimite = 60;
let tempoInicial;
let jogando = false;

function setup() {
  createCanvas(800, 400);
  trator = new Trator();
  cidadeX = width - 150;
  tempoInicial = millis();
  for (let i = 0; i < 5; i++) {
    bolinhas.push(new Bolinha());
  }
}

function draw() {
  if (!jogando) {
    mostrarInstrucoes();
    return;
  }

  background(100, 200, 100); // campo
  fill(200);                 // cidade
  rect(cidadeX, 0, 150, height);

  fill(0);
  textSize(16);
  text("Pontos: " + pontos, 10, 20);
  let tempoRestante = max(0, tempoLimite - int((millis() - tempoInicial) / 1000));
  text("Tempo: " + tempoRestante, 10, 40);

  if (tempoRestante <= 0) {
    textSize(32);
    textAlign(CENTER);
    text("FIM DE JOGO!", width / 2, height / 2);
    noLoop();
    return;
  }

  trator.mostrar();
  trator.mover();

  for (let b of bolinhas) {
    b.mostrar();
    if (!trator.carregando && b.coletado(trator)) {
      trator.carregando = true;
      b.reposicionar();
    }
  }

  // Verifica se o trator chegou à cidade
  if (trator.carregando && trator.x + trator.tamanho > cidadeX) {
    pontos++;
    trator.carregando = false;
  }
}

function keyPressed() {
  if (!jogando && keyCode === ENTER) {
    jogando = true;
    tempoInicial = millis();
    loop();
  }
}

function mostrarInstrucoes() {
  background(255);
  textAlign(CENTER);
  fill(0);
  textSize(24);
  text("🚜 Jogo: Do Campo à Cidade – Caça às Bolinhas", width / 2, 60);

  textSize(16);
  text("🟢 Objetivo: Capture bolinhas no campo e leve para a cidade!", width / 2, 110);
  text("🕹️ Use as teclas WASD ou as setas para mover o trator.", width / 2, 140);
  text("🔵 As bolinhas aparecem no lado esquerdo (campo).", width / 2, 170);
  text("🏙️ Entregue-as no lado direito (cidade) para ganhar pontos.", width / 2, 200);
  text("⏳ Você tem 60 segundos. Veja quantas consegue entregar!", width / 2, 230);

  textSize(18);
  text("👉 Pressione ENTER para começar o jogo!", width / 2, 280);
}

class Trator {
  constructor() {
    this.x = 100;
    this.y = height / 2;
    this.tamanho = 30;
    this.vel = 2;
    this.carregando = false;
  }

  mostrar() {
    fill(this.carregando ? "orange" : "blue");
    rect(this.x, this.y, this.tamanho, this.tamanho);
  }

  mover() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.vel;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.vel;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.vel;

    this.x = constrain(this.x, 0, width - this.tamanho);
    this.y = constrain(this.y, 0, height - this.tamanho);
  }
}

class Bolinha {
  constructor() {
    this.reposicionar();
    this.tamanho = 20;
  }

  mostrar() {
    fill("green");
    ellipse(this.x, this.y, this.tamanho);
  }

  coletado(trator) {
    let d = dist(this.x, this.y, trator.x + trator.tamanho / 2, trator.y + trator.tamanho / 2);
    return d < this.tamanho / 2 + trator.tamanho / 2;
  }

  reposicionar() {
    this.x = random(50, cidadeX - 50);
    this.y = random(50, height - 50);
  }
}
