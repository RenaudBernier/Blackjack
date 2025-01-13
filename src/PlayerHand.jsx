import {shoe} from "./Shoe.jsx";
import {Card} from "./Shoe.jsx";
import {generateShoe} from "./Shoe.jsx";
import {Deck} from "./Shoe.jsx";
import {useRef, useState} from "react";
generateShoe(1);

let dealer = new Deck();
let playerHands = [new Deck()];
let tokens = 10;
let currentBet = 0;

export default function PlayerHand(){
    const [hands, setHands] = useState([playerHands[0].toHtml(true, 0)]);
    const [dealHand, setDealHand] = useState(dealer.toHtml(false, "100", true));
    let [turn, setTurn] = useState(-1);
    const [betTime, setBetTime] = useState(0);
    const bet = useRef();

    async function newRound(){
        generateShoe(1);
        currentBet = bet.current.value;
        dealer = new Deck();
        playerHands = [new Deck(currentBet)];
        tokens -= currentBet;
        setTurn(0);
        setHands([playerHands[0].toHtml(true, 0)]);
        setDealHand(dealer.toHtml(false, "100", true));

        //Round ends immediately if player has blackjack
        if (playerHands[0].total() === 21){
            await wait(1000);
            endRound();
        }
    }


    function editHand(index, fn, ...args){
        const val = playerHands[index][fn](...args);

        if (fn === 'split') {
            tokens -= currentBet;
            playerHands.push(val);
        }
        if(playerHands[turn].total() === 21)
            stand();
        else if(playerHands[turn].total() === "Busted"){
            stand();
            return;
        }
        update(turn);
    }

    function stand(){
        if (turn === playerHands.length-1)
            endRound();
        else {
            update(turn + 1);
            setTurn(turn + 1);
        }
    }

    function double(){
        tokens -= currentBet;
        playerHands[turn].bet *= 2;
        editHand(turn, 'draw', new Card());
        stand();
    }

    function update(turn){
        setHands(playerHands.map((hand, index) => {
            return hand.toHtml(index === turn, index);
        }));
    }

    async function endRound(){
        update(turn);
        await wait(1000);
        setDealHand(dealer.toHtml(false, "100", false));

        while(dealer.total() <= 17){
            if(dealer.minTotal === 17)
                break;
            await wait(1000);
            dealer.draw(new Card());
            setDealHand(dealer.toHtml(false, "100", false));
        }
        await wait(1000);

        if (dealer.total() !== "Busted") {
            for (const hand of playerHands) {
                if (hand.total() > dealer.total())
                    tokens += 2 * hand.bet;
                else if (hand.total() === dealer.total())
                    tokens += Number(hand.bet);
            }
        }
        else{
            for (const hand of playerHands) {
                if (hand.total() !== "Busted")
                    tokens += 2 * hand.bet;
            }
        }
        setTurn(-1);
    }

    function wait(time){
        return new Promise( (resolve) => {
            setTimeout(resolve, time);
        })
    }

    if (turn >= 0) { //Component shows player's cards
        return (
            <>
                <div style={{backgroundColor: "white"}}>
                    {dealHand}
                </div>
                {hands}
                <p className='chips'>{tokens} chips</p>
                <button onClick={() => {
                    editHand(turn, 'draw', new Card());
                }}> hit
                </button>
                <button onClick={() => {
                    double();
                }}> double
                </button>
                <button onClick={() => {
                    if (playerHands[turn].cards.length === 2 && playerHands[turn].cards[0].value === playerHands[turn].cards[1].value
                        || playerHands[turn].cards[0].value >= 10 && playerHands[turn].cards[1].value)
                        editHand(turn, 'split');
                }}>split
                </button>
                <button onClick={() => stand()}>stand</button>
            </>
        )
    } else { //Asks player's bet. Happens before round
        return (
            <div>
                <label htmlFor="chips">bet</label>
                <input type="number" id="chips" ref={bet}/>
                <button onClick={newRound}>GO</button>
                <p className='chips'>{tokens} chips</p>
            </div>
        )
    }
}
