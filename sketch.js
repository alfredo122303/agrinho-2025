let tractor;
let resources = [];
let obstacles = [];
let city;
let score = 0;
let gameOver = false;
let timeLeft = 30; // Tempo de jogo (em segundos)
let startTime;
let currentPhase = 1;
let maxPhase = 7; // Número máximo de fases
let resourcesToDeliver = 3; // Quantidade de recursos para entregar por fase

function setup() {
  createCanvas(800, 600);
  
  // Criar o trator
  tractor = new Tractor(100, height / 2);
  
  // Criar a cidade
  city = createVector(width - 100, height / 2);
  
  // Iniciar o tempo
  startTime = millis();
  
  // Iniciar a fase 1
  startPhase();
}

function draw() {
  background(220);
  
  if (gameOver) {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Game Over! Pontuação Final: " + score, width / 2, height / 2);
    return;
  }
  
  // Atualizar o tempo restante
  timeLeft = max(0, 30 - int((millis() - startTime) / 1000));
  
  // Mostrar o tempo
  fill(0);
  textSize(24);
  textAlign(RIGHT, TOP);
  text("Tempo: " + timeLeft, width - 20, 20);
  
  // Desenhar a cidade
  fill(100, 100, 255);
  ellipse(city.x, city.y, 100, 100);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Cidade", city.x, city.y);
  
  // Desenhar o trator
  tractor.update();
  tractor.display();
  
  // Verificar se o trator saiu da borda
  if (tractor.isOutOfBounds()) {
    gameOver = true; // Se o trator sair da borda, o jogo acaba
  }
  
  // Desenhar os recursos
  for (let i = resources.length - 1; i >= 0; i--) {
    let r = resources[i];
    fill(0, 255, 0);
    rect(r.x, r.y, 30, 30);
    if (tractor.collidesWith(r)) {
      resources.splice(i, 1); // Remove o recurso após pegá-lo
      score += 10; // Aumenta a pontuação
    }
  }
  
  // Desenhar obstáculos
  fill(139, 69, 19); // Cor das pedras (obstáculos)
  for (let i = 0; i < obstacles.length; i++) {
    ellipse(obstacles[i].x, obstacles[i].y, 50, 50);
    if (tractor.collidesWith(obstacles[i])) {
      gameOver = true; // Se o trator colidir com um obstáculo, o jogo acaba
    }
  }
  
  // Desenhar o caminho para a cidade
  if (tractor.collidesWith(city) && resources.length === 0) {
    score += 50; // Pontuação extra por entregar todos os recursos na cidade
    resourcesToDeliver = 3 + currentPhase; // Aumenta o número de recursos para a próxima fase
    if (currentPhase < maxPhase) {
      currentPhase++; // Avançar para a próxima fase
      startPhase();
    } else {
      fill(0, 255, 0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Você Venceu! Pontuação Final: " + score, width / 2, height / 2);
    }
  }
  
  // Exibir a pontuação
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Pontuação: " + score, 20, 20);
}

function startPhase() {
  // Reseta os recursos e obstáculos
  resources = [];
  obstacles = [];
  
  // Alterar os parâmetros da fase com base na fase atual
  let numResources = resourcesToDeliver + currentPhase; // Aumenta a quantidade de recursos
  let numObstacles = currentPhase + 3; // Aumenta os obstáculos a cada fase
  let phaseTime = 30 - currentPhase * 2; // Diminui o tempo por fase
  
  // Limita o tempo mínimo
  timeLeft = max(10, phaseTime);
  
  // Criar novos recursos e obstáculos com base na fase atual
  for (let i = 0; i < numResources; i++) {
    resources.push(createVector(random(150, 400), random(100, height - 100)));
  }
  
  // Criar obstáculos baseados na fase
  for (let i = 0; i < numObstacles; i++) {
    obstacles.push(createVector(random(300, 600), random(100, height - 100)));
  }
  
  // Reinicia o tempo da fase
  startTime = millis();
}

class Tractor {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 27; // Velocidade máxima aumentada
    this.maxForce = 0.5; // Aceleração
    this.angle = 0; // Ângulo do trator
  }
  
  update() {
    // Aplica a aceleração na velocidade
    this.velocity.add(this.acceleration);
    
    // Limita a velocidade máxima
    this.velocity.limit(this.maxSpeed);
    
    // Atualiza a posição com a velocidade
    this.position.add(this.velocity);
    
    // Suaviza a desaceleração (fica mais suave quando não pressionado)
    this.acceleration.mult(0);
    
    // Suaviza a rotação do trator
    if (this.velocity.mag() > 0) {
      this.angle = this.velocity.heading();
    }
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    
    // Trator representado por um retângulo simples
    fill(255, 165, 0);
    noStroke();
    rect(-20, -10, 40, 20); // Corpo do trator
    rect(-5, -15, 10, 15);  // Cabine
    
    pop();
  }
  
  // Função para mover o trator com as teclas WASD
  keyPressed() {
    if (key === 'A' || key === 'a') {
      let force = createVector(-0.3, 0); // Aplica uma força para a esquerda
      this.applyForce(force);
    } else if (key === 'D' || key === 'd') {
      let force = createVector(0.3, 0); // Aplica uma força para a direita
      this.applyForce(force);
    } else if (key === 'W' || key === 'w') {
      let force = createVector(0, -0.5); // Aplica uma força para cima
      this.applyForce(force);
    } else if (key === 'S' || key === 's') {
      let force = createVector(0, 0.5); // Aplica uma força para baixo
      this.applyForce(force);
    }
  }
  
  // Verificar colisão com recursos ou obstáculos
  collidesWith(obj) {
    let d = dist(this.position.x, this.position.y, obj.x, obj.y);
    return d < 30;
  }

  // Verificar se o trator saiu da tela
  isOutOfBounds() {
    return this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height;
  }
}

// Captura de movimento do teclado
function keyPressed() {
  tractor.keyPressed();
}
