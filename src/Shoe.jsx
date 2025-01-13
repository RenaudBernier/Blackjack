
export const shoe = {
    cards: [],
    size: 0
}

export function generateShoe(decks){
    let total = 0;
    for (let i = 0; i < 52; i++){
        total += decks;
        shoe.cards[i] = total;
    }
    shoe.size = decks*52;
}

export function draw(){
    const rand = Math.floor(Math.random()*shoe.size);
    let card = 0;
    for(;card < 52; card++){
        if(rand < shoe.cards[card])
            break
    }
    for(let i = card; i < 52; i++){
        shoe.cards[i]--;
    }
    shoe.size--;

    return card;
}
export class Card{
    constructor() {
        let nb = draw();
        const suitInt = Math.floor(nb/13);
        switch(suitInt){
            case 0:
                this.suit = 'Hearts';
                break;
            case 1:
                this.suit = 'Diamonds';
                break;
            case 2:
                this.suit = 'Clubs';
                break;
            case 3:
                this.suit = 'Spades'
                break;
        }
        while (nb > 12){
            nb -= 13;
        }
        this.value = ++nb;
    }

    toString(){
        return `${this.suit}_card_${this.value.toString().padStart(2, '0')}.png`
    }
}
export class Deck{
    constructor(bet, card){
        this.hasAce = false;
        this.cards = [];
        this.minTotal = 0;
        this.maxTotal = 0;
        this.bet = bet ? bet : 0;
        if(card){
            this.draw(card);
            this.draw(new Card());
        }
        else{
            this.draw(new Card());
            this.draw(new Card());
        }
    }
    draw(card){
        this.cards.push(card);
        if (card.value === 1) {
            this.hasAce = true;
            this.minTotal++;
        }
        else if(card.value > 10){
            this.minTotal += 10;
        }
        else
            this.minTotal += card.value;

        if(this.hasAce)
            this.maxTotal = this.minTotal + 10;
        else
            this.maxTotal = this.minTotal;
    }
    split(bet){
        console.log("BET: " + bet);
        const [card] = this.cards.splice(1,1);
        this.minTotal /= 2;
        this.maxTotal /= 2;
        this.draw(new Card());
        return new Deck(this.bet, card);
    }
    total(){
        if (this.maxTotal <= 21)
            return this.maxTotal;
        else if(this.minTotal <= 21)
            return this.minTotal;
        console.log(this.minTotal);
        return "Busted";
    }
    toHtml(isMyTurn, key, isDealerFirst){
        let cardsElement = null;

        if (isDealerFirst)
            cardsElement = this.cards.map((card, i) => {
                return <img src={ i===1 ? "cards-png/Backs/back_0.png" : "cards-png/" + card.toString()} alt={"cardpicture"} key={i}
                            className={isMyTurn ? 'myTurn' : ''}/>})
        else
            cardsElement = this.cards.map((card, i) => {
                return <img src={"cards-png/" + card.toString()} alt={"cardpicture"} key={i}
                            className={isMyTurn ? 'myTurn' : ''}/>})

        return (
            <div className={isMyTurn ? 'my-turn' : 'normal'} key={key}>
                {cardsElement}
                <p>{ isDealerFirst ? '' : this.total()}</p>
            </div>
        )

    }
}
