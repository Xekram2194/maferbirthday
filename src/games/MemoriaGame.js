import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import './style.css'; // Asegúrate de importar tus estilos
import hangman0 from '../images/ahorcado0.png';
import hangman1 from '../images/ahorcado1.png';
import hangman2 from '../images/ahorcado2.png';
import hangman3 from '../images/ahorcado3.png';
import hangman4 from '../images/ahorcado4.png';
import hangman5 from '../images/ahorcado5.png';
import hangman6 from '../images/ahorcado6.png';
import { db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import MenuHamburguesa from '../components/MenuHamburguesa';

function HangmanGame() {
    const phrases = [
        "Algo que realza tu estilo",
        "Un complemento para tu elegancia",
        "Una sorpresa que te hara lucir",
        "Algo nuevo para tu coleccion personal",
        "Un detalle que te abriga",
        "Una pieza para tu armario",
        "Algo que te acompaña a donde vayas",
        "Una novedad para tu imagen",
        "Un toque para tu personalidad",
        "Un secreto que te hara brillar"
    ];

    const getRandomPhrase = () => phrases[Math.floor(Math.random() * phrases.length)].toUpperCase();

    const [word, setWord] = useState(getRandomPhrase());
    const [guessedLetters, setGuessedLetters] = useState(new Set([' ']));
    const [mistakes, setMistakes] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isWinModalVisible, setIsWinModalVisible] = useState(false);
    const [giftGuess, setGiftGuess] = useState('');
    const images = [hangman0, hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];

    useEffect(() => {
        setWord(getRandomPhrase());
    }, []);

    const handleGuess = (letter) => {
        if (!guessedLetters.has(letter)) {
            setGuessedLetters(prev => new Set(prev.add(letter)));
            if (!word.includes(letter)) {
                const newMistakes = mistakes + 1;
                setMistakes(newMistakes);
                if (newMistakes === images.length - 1) {
                    setIsModalVisible(true);
                }
            } else {
                checkWin(new Set([...guessedLetters, letter]));
            }
        }
    };

    const checkWin = (guessed) => {
        if (word.split('').every(letter => guessed.has(letter) || letter === ' ')) {
            setIsWinModalVisible(true);
        }
    };

    const handleWinSubmit = async () => {
        try {
            if (giftGuess.trim() !== '') {
                await addDoc(collection(db, "giftGuesses"), {
                    guess: giftGuess,
                    timestamp: new Date()
                });
            }
            resetGame();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const resetGame = () => {
        setWord(getRandomPhrase());
        setGuessedLetters(new Set([' ']));
        setMistakes(0);
        setIsModalVisible(false);
        setIsWinModalVisible(false);
        setGiftGuess('');
    };

    const guessedWord = word.split('').map(letter => letter === ' ' ? ' ' : (guessedLetters.has(letter) ? letter : '_')).join('');

    return (
        <div style={{ textAlign: 'center' }}>
            
      <MenuHamburguesa />
            <h1 style={{ paddingLeft: '50px' }}>Ahorcado</h1>
            <img src={images[mistakes]} alt="Hangman Stage" />
            <p>Adivina la frase: {guessedWord}</p>
            <p>Intentos erróneos: {mistakes}</p>
            <div className="keyboard">
                {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ '.split('').map(letter => (
                    <Button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.has(letter) || mistakes >= images.length - 1 || isWinModalVisible}>
                        {letter}
                    </Button>
                ))}
            </div>
            <Modal
                title="Fin del juego"
                visible={isModalVisible}
                onOk={resetGame}
                onCancel={resetGame}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Lo siento, has perdido. Vamos mi amor tu puedes</p>
            </Modal>
            <Modal
                title="¡Felicidades!"
                visible={isWinModalVisible}
                onOk={handleWinSubmit}
                onCancel={resetGame}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>¡Bien hecho! Has adivinado la frase correctamente: {word}</p>
                <p>¿Qué crees que será tu regalo?</p>
                <Input
                    value={giftGuess}
                    onChange={e => setGiftGuess(e.target.value)}
                    placeholder="Escribe tu suposición aquí"
                />
            </Modal>
        </div>
    );
}

export default HangmanGame;
