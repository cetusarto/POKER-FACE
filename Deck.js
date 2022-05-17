module.exports = class Deck {
  constructor() {
    this.deck = [];
    this.reset(); //Add 52 cards to the deck
    this.shuffle(); //Suffle the deck
  } //End of constructor

  restart(){
    this.reset();
    this.shuffle();
  }

  reset() {
    this.deck = [];
    const suits = ['h', 'd', 'c', 's'];
    const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K'];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push(values[value]+suits[suit]);
      }
    }
  } //End of reset()
  shuffle() {
    let numberOfCards = this.deck.length;
    for (var i = 0; i < numberOfCards; i++) {
      let j = Math.floor(Math.random() * numberOfCards);
      let tmp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = tmp;
    }
  } //End of shuffle()
  deal() {
    return this.deck.pop();
  } //End of deal()
  isEmpty() {
    return (this.deck.length == 0);
  } //End of isEmpty()
  length() {
    return this.deck.length;
  } //End of length()
} //End of Deck Class
