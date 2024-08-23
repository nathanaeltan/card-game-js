/**
 *
 *
You are to create a card game for 4 players. The players each draw a card from the deck each round. The player who draws the highest card will win the round and score a point. When there are no more cards left in the deck, the game should end with a scoreboard that displays the players ranked in order of the total number of points they have scored
Might also want to add more than 4 players in future

Functional Requirement
* Deck of cards for players to draw from
* Ability for players to draw from the deck
* For each round need to check for player with the highest card
* Keep track of points for each player for each round
* Keep track of number of cards left in deck (end game when there is no more)
* Display scoreboard with number of points for each player



1. More than 4 players (Done)
2. Players must reveal/log the card for each draw (Done)
3.Players can now skip the round (don't draw a card for that round), manually called to skip a round (Done)
4. 2 decks of cards instead of 1 (Done)
*/
const inquirer = require('inquirer');

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    addScore() {
        this.score +=1;
    }
    async skipRound() {
        const { skip } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'skip',
            message: `${this.name}, do you want to skip this round?`,
            default: false
          }
        ]);
        return skip;
      }
}

class Game {
    constructor(playersNames, numberOfDecks = 1) {
        this.players = playersNames.map(name => new Player(name));
        this.numberOfDecks = numberOfDecks;
        this.deck = this.createDeck();
        this.shuffleDeck()
    }
    createDeck() {
        const suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
        const values = [
            {name: 'Ace', rank: 1},
            {name: '2', rank: 2},
            {name: '3', rank: 3},
            {name: '4', rank: 4},
            {name: '5', rank: 5},
            {name: '6', rank: 6},
            {name: '7', rank: 7},
            {name: '8', rank: 8},
            {name: '9', rank: 9},
            {name: '10', rank: 10},
            {name: 'Jack', rank: 11 },
            {name: 'Queen', rank: 12},
            {name: 'King', rank: 13},
        ]
        let deck = [];
        for(let suit of suits) {
            for(let value of values) {
                deck.push({suit, ...value});
            }
        }
        return [...deck, ...deck];
    }

    shuffleDeck() {
        for(let i = this.deck.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
        }
    }

    async playRound() {
        const roundDrawnCards = [];
        for(let player of this.players) {
            const skip = await player.skipRound()
            if(skip) {
                console.log(`${player.name} skips this round.`);
                continue;
            }
            const drawnCard = this.deck.pop();
            console.log(`${player.name} drew ${drawnCard.name} of ${drawnCard.suit}`);
            roundDrawnCards.push({player, card: drawnCard});
        }
        const winner = roundDrawnCards.reduce((prev,current) => (prev.card.rank > current.card.rank) ? prev : current);
        winner.player.addScore();
    }

    async play() {
        while(this.deck.length >= this.players.length) {
            await this.playRound();
        }
        console.log('Game Over. Here is the score:')
        this.players.sort((a, b) => b.score - a.score);
        this.players.forEach(player => {
            console.log(`${player.name}: ${player.score}`);
        })

    }
}

const playerNames = ["Nat", "Kah Seng", "Justin", "JJ","Alice", "Kate"];
const game = new Game(playerNames);
game.play();