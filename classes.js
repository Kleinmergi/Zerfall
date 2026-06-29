class Wuerfel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.seite = Math.floor(Math.random() * 6) + 1;
    this.farbe = "#ffffff";
    this.durchsichtig = false;
  }

  wuerfeln() {
    if (!this.durchsichtig) {
      this.seite = Math.floor(Math.random() * 6) + 1;
    }
  }

  anzeigen() {
    fill(this.farbe);
    rect(this.x, this.y, breite, breite, 5);
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.seite, this.x + breite / 2, this.y + breite / 2);
  }

  entfernen() {
    this.durchsichtig = true;
    this.farbe = "#eeeeee";
  }

  istEntfernt() {
    return this.durchsichtig;
  }

  istSechs() {
    return this.seite == 6;
  }
}

class Balken {
  constructor(x, y, farbe) {
    this.x = x;
    this.y = y;
    this.breite = 20;
    this.hoehe = 0;
    this.farbe = farbe;
  }

  erhoeheHoehe() {
    this.hoehe += 1;
  }

  anzeigen() {
    fill(this.farbe);
    rect(this.x, this.y - this.hoehe, this.breite, this.hoehe);
  }
}
export { Balken, Wuerfel };