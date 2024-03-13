import React, { useState, useEffect, useRef } from "react";


const placeholderCard = {
    image: "https://s3.amazonaws.com/images.penguinmagic.com/images/products/original/8007b.jpg",
    value: "Card",
    suit: "Placeholder"
}

const Game = () => {
    // state for the deck ID
    const [deckId, setDeckId] = useState(null);
    // state for the current card and remainig cards
    const [currentCard, setCurrentCard] = useState(placeholderCard);
    const [cardsRemaining, setCardsRemaining] = useState(null);
    const [isShuffling, setIsShuffling] = useState(false);

    // fetch a new deck when components mounts
    useEffect(() => {
        // async function to fetch deck data
        const fetchDeck = async () => {
            // const res = await fetch("http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            const res = await fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
            const data = await res.json();
            setDeckId(data.deck_id);
            // console.log(data)
        };
        fetchDeck();
    }, []);

     // draw a new card
        const drawCard = async () => {
            if(!deckId || cardsRemaining === 0){
                alert("Error: No cards remaining to draw!!!");
                return;
            }

            const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const data = await response.json();

            // update current card and cards remaining
            setCurrentCard(data.cards[0])
            setCardsRemaining(data.remaining);
        };

        const handleShuffle = async () => {
            if (deckId) {
                try {
                    //indicates shuffling is starting
                    setIsShuffling(true)

                    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
                    const data = await res.json()

                    if(data.success) {
                        // check if shuffle was successful and reset card states
                        setCurrentCard(placeholderCard);
                        setCardsRemaining(52);
                    } else {
                        alert('Shuffle Failed')
                        console.log('Shuffle Failed')
                    }
                } catch (error) {
                    console.error('Error shuffling the desck:', error);
                } finally {
                    // indicate shuffling is complete
                    setIsShuffling(false);
                }
            }
        }

        return (
            <div className="Card-Game">
                {/* Button to draw a card  */}
                <button onClick={drawCard} disabled={isShuffling} className="Card-draw-btn">Draw Card</button>
                {/* display the current card  */}
                {currentCard && (
                    <div>
                        <img src={currentCard.image} alt={`${currentCard.value} of ${currentCard.suit}`} className="card-image"/>
                        {/* <p className="card-name">{currentCard.value.toLowerCase()} of {currentCard.suit.toLowerCase()}</p> */}
                        <p className="card-name">{currentCard.value.charAt(0).toUpperCase() + currentCard.value.slice(1).toLowerCase()} of {currentCard.suit.charAt(0).toUpperCase() + currentCard.suit.slice(1).toLowerCase()}</p>
                    </div>
                )}

                <button onClick={handleShuffle} disabled={isShuffling} className="Card-shuffle-btn">Shuffel Deck</button>
            </div>
        )

}

export default Game;