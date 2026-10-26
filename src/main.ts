import Phaser from "phaser";
import "./style.css";

const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 760;

class PlazaScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private speed = 230;
  private worldBounds = new Phaser.Geom.Rectangle(24, 24, WORLD_WIDTH - 48, WORLD_HEIGHT - 48);
  private obstacles: Phaser.Geom.Rectangle[] = [];

  constructor() {
    super("Plaza");
  }

  create() {
    this.drawWorld();
    this.createObstacles();
    this.createPlayer();

    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.cursors = keyboard.createCursorKeys();
      this.keys = keyboard.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    }

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(220, 130);

    this.add.text(34, 30, "SUNNY PLAZA", {
      fontFamily: "Arial, sans-serif", fontSize: "16px", color: "#244768",
      fontStyle: "bold", padding: { x: 7, y: 5 }, backgroundColor: "#fff8e8"
    }).setScrollFactor(0).setDepth(100);

    this.add.text(WORLD_WIDTH - 34, 30, "EXPLORATION AREA", {
      fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#244768",
      padding: { x: 7, y: 5 }, backgroundColor: "#fff8e8"
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
  }

  update(_time: number, delta: number) {
    if (!this.player || !this.keys) return;

    let dx = 0;
    let dy = 0;
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    if (left) dx -= 1;
    if (right) dx += 1;
    if (up) dy -= 1;
    if (down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      const length = Math.hypot(dx, dy);
      dx /= length;
      dy /= length;
    }

    const distance = this.speed * (delta / 1000);
    const nextX = Phaser.Math.Clamp(this.player.x + dx * distance, this.worldBounds.left, this.worldBounds.right);
    const nextY = Phaser.Math.Clamp(this.player.y + dy * distance, this.worldBounds.top, this.worldBounds.bottom);

    if (!this.collidesAt(nextX, this.player.y)) this.player.x = nextX;
    if (!this.collidesAt(this.player.x, nextY)) this.player.y = nextY;

    this.player.setDepth(this.player.y);
    const body = this.player.getByName("body") as Phaser.GameObjects.Ellipse;
    body.setScale(dx < 0 ? 0.94 : 1, dy !== 0 ? 1.02 : 1);
  }

  private collidesAt(x: number, y: number) {
    const playerBox = new Phaser.Geom.Rectangle(x - 14, y - 12, 28, 24);
    return this.obstacles.some((obstacle) => Phaser.Geom.Intersects.RectangleToRectangle(playerBox, obstacle));
  }

  private drawWorld() {
    const g = this.add.graphics();
    g.fillStyle(0xb8df9b, 1);
    g.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    const patches = [
      [90, 105, 310, 180], [875, 80, 300, 205], [90, 535, 340, 150],
      [850, 520, 330, 160], [465, 90, 300, 110]
    ];
    patches.forEach(([x, y, w, h]) => {
      g.fillStyle(0xc9e9ad, 1);
      g.fillRoundedRect(x, y, w, h, 40);
    });

    g.fillStyle(0xf2dfb8, 1);
    g.fillRoundedRect(0, 300, WORLD_WIDTH, 160, 30);
    g.fillRoundedRect(520, 0, 220, WORLD_HEIGHT, 30);
    g.fillStyle(0xe5cfa7, 1);
    g.fillRoundedRect(0, 309, WORLD_WIDTH, 7, 4);
    g.fillRoundedRect(0, 444, WORLD_WIDTH, 7, 4);
    g.fillRoundedRect(529, 0, 7, WORLD_HEIGHT, 4);
    g.fillRoundedRect(724, 0, 7, WORLD_HEIGHT, 4);

    for (let i = 0; i < 34; i++) {
      const x = 45 + ((i * 137) % (WORLD_WIDTH - 90));
      const y = 55 + ((i * 83) % (WORLD_HEIGHT - 110));
      if ((x > 480 && x < 770) || (y > 285 && y < 470)) continue;
      g.fillStyle(i % 2 ? 0xf4a8b8 : 0xffdf77, 1);
      g.fillCircle(x, y, 3 + (i % 3));
    }

    g.fillStyle(0x8cbaa9, 0.25);
    g.fillEllipse(632, 386, 146, 104);
    g.fillStyle(0x7bb9d4, 1);
    g.fillCircle(632, 378, 48);
    g.lineStyle(7, 0xfaf1d9, 1);
    g.strokeCircle(632, 378, 48);
    g.fillStyle(0xbde8f2, 1);
    g.fillCircle(632, 378, 31);
    g.fillStyle(0x7bb9d4, 1);
    g.fillEllipse(632, 367, 20, 12);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(622, 361, 5);
    g.fillCircle(642, 389, 4);

    this.drawBuilding(155, 160, 190, 112, 0xe9a16f, 0xc66d5c, "POST OFFICE");
    this.drawBuilding(915, 150, 205, 120, 0x91c9dc, 0x5b9bb9, "CLUB HOUSE");
    this.drawBuilding(165, 555, 200, 100, 0xd8b1e7, 0xa17fc1, "ART STUDIO");
    this.drawBuilding(920, 555, 200, 100, 0xf0ce73, 0xc99a3d, "GARDEN SHOP");

    g.lineStyle(5, 0x8bb77c, 1);
    g.strokeRoundedRect(18, 18, WORLD_WIDTH - 36, WORLD_HEIGHT - 36, 28);
    g.destroy();
  }

  private drawBuilding(x: number, y: number, w: number, h: number, wall: number, roof: number, label: string) {
    const g = this.add.graphics();
    g.fillStyle(0x57765d, 0.18);
    g.fillRoundedRect(x + 5, y + 9, w, h, 12);
    g.fillStyle(wall, 1);
    g.fillRoundedRect(x, y + 24, w, h - 24, 10);
    g.fillStyle(roof, 1);
    g.fillTriangle(x - 12, y + 32, x + w / 2, y - 14, x + w + 12, y + 32);
    g.fillStyle(0xfff2d4, 1);
    g.fillRoundedRect(x + w / 2 - 18, y + h - 42, 36, 42, 8);
    g.fillStyle(0xb4e1ef, 1);
    g.fillRoundedRect(x + 18, y + 47, 30, 27, 5);
    g.fillRoundedRect(x + w - 48, y + 47, 30, 27, 5);
    g.lineStyle(3, 0xffffff, 0.7);
    g.lineBetween(x + 33, y + 48, x + 33, y + 72);
    g.lineBetween(x + w - 33, y + 48, x + w - 33, y + 72);
    g.destroy();

    this.add.text(x + w / 2, y + h + 5, label, {
      fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#345448",
      fontStyle: "bold", backgroundColor: "#eff5d9", padding: { x: 6, y: 4 }
    }).setOrigin(0.5, 0);

    this.obstacles.push(new Phaser.Geom.Rectangle(x - 4, y + 8, w + 8, h - 8));
  }

  private createObstacles() {
    const trees = [
      [430, 160], [820, 190], [440, 550], [820, 570], [105, 390], [1160, 390],
      [390, 385], [870, 385], [475, 260], [790, 490], [570, 590], [700, 160]
    ];
    trees.forEach(([x, y], i) => {
      const tree = this.add.container(x, y);
      const shadow = this.add.ellipse(4, 16, 62, 22, 0x5c8a62, 0.22);
      const trunk = this.add.rectangle(0, 4, 16, 34, 0x9b704a, 1).setOrigin(0.5, 0.5);
      const crown = this.add.circle(0, -15, 27 + (i % 3) * 3, i % 2 ? 0x5da67a : 0x73b982);
      const highlight = this.add.circle(-9, -23, 9, 0x9ad69a, 0.8);
      tree.add([shadow, trunk, crown, highlight]);
      tree.setDepth(y);
      this.obstacles.push(new Phaser.Geom.Rectangle(x - 18, y - 2, 36, 34));
    });
  }

  private createPlayer() {
    this.player = this.add.container(632, 485);
    const shadow = this.add.ellipse(0, 13, 36, 15, 0x3e665a, 0.24);
    const feet = this.add.ellipse(0, 7, 24, 11, 0x394c6b, 1);
    const body = this.add.ellipse(0, -7, 30, 35, 0x6a9be8, 1).setName("body");
    body.setStrokeStyle(3, 0xffffff, 1);
    const face = this.add.ellipse(0, -24, 28, 25, 0xffd9b3, 1);
    const hair = this.add.arc(0, -30, 16, 3.2, 6.2, false, 0x634d4b, 1);
    hair.setStrokeStyle(8, 0x634d4b, 1);
    const eye1 = this.add.circle(-5, -25, 2.2, 0x2c3c50);
    const eye2 = this.add.circle(5, -25, 2.2, 0x2c3c50);
    const smile = this.add.arc(0, -20, 5, 0.2, 2.9, false, 0xb76d63);
    smile.setStrokeStyle(1.8, 0xb76d63, 1);
    const nameplate = this.add.text(0, -58, "Explorer", {
      fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#263d5a",
      fontStyle: "bold", backgroundColor: "#fffdf5", padding: { x: 7, y: 4 }
    }).setOrigin(0.5, 0.5);

    this.player.add([shadow, feet, body, face, hair, eye1, eye2, smile, nameplate]);
    this.player.setDepth(this.player.y);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: 960,
  height: 620,
  backgroundColor: "#b8df9b",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%"
  },
  render: { antialias: true, pixelArt: false, roundPixels: true },
  physics: { default: "arcade", arcade: { debug: false } },
  scene: [PlazaScene]
});

window.addEventListener("beforeunload", () => game.destroy(true));
