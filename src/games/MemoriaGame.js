import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import './style.css'; // Asegúrate de importar tus estilos
import hangman0 from '../images/ahorcado0.png';
import hangman1 from '../images/ahorcado1.png';
import hangman2 from '../images/ahorcado2.png';
import hangman3 from '../images/ahorcado3.png';
import hangman4 from '../images/ahorcado4.png';
import hangman5 from '../images/ahorcado5.png';
import hangman6 from '../images/ahorcado6.png';

function HangmanGame() {
    const phrases = [
        "Algo que realza tu estilo",
        "Un complemento para tu elegancia",
        "Una sorpresa que te hara lucir",
        "Algo nuevo para tu coleccion personal",
        "Un detalle que te abriga",
        "Una pieza para tu armario",
        "Algo que te acompana a donde vayas",
        "Una novedad para tu imagen",
        "Un toque para tu personalidad",
        "Un secreto que te hara brillar"
    ];

    // Selecciona una frase aleatoria de la lista de frases.
    const getRandomPhrase = () => {
        const index = Math.floor(Math.random() * phrases.length);
        return phrases[index].toUpperCase();
    };

    const [word, setWord] = useState(getRandomPhrase());
    const [guessedLetters, setGuessedLetters] = useState(new Set([' ']));
    const [mistakes, setMistakes] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isWinModalVisible, setIsWinModalVisible] = useState(false);
    const images = [hangman0, hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];

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

    // Verifica si el jugador ha adivinado correctamente todas las letras.
    const checkWin = (guessed) => {
        if (word.split('').every(letter => guessed.has(letter) || letter === ' ')) {
            setIsWinModalVisible(true);
        }
    };

    const handleReset = () => {
        const newPhrase = getRandomPhrase(); // Asegura una nueva frase
        setWord(newPhrase);
        setGuessedLetters(new Set([' ']));
        setMistakes(0);
        setIsModalVisible(false);
        setIsWinModalVisible(false);
    };

    const guessedWord = word.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ');

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Ahorcado</h1>
            <p>Aqui vas a tener unas pistas de que puede ser tu regalo</p>
            <img src={images[mistakes]} alt="Hangman Stage" />
            <p>Adivina la frase: {guessedWord}</p>
            <p>Intentos erróneos: {mistakes}</p>
            <div className="keyboard">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('').map(letter => (
                    <Button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.has(letter) || mistakes >= images.length - 1 || isWinModalVisible}>
                        {letter}
                    </Button>
                ))}
            </div>
            <p style={{  fontWeight:700, fontSize:'20px', color: "#2fd0ec"}}>RECUERDA Q SON FRASES AMOR</p>
            <Modal
                title="Fin del juego"
                visible={isModalVisible}
                onOk={handleReset}
                onCancel={handleReset}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Lo siento, has perdido. Vamos mi amor tu puedes</p>
            </Modal>
            <Modal
                title="¡Felicidades!"
                visible={isWinModalVisible}
                onOk={handleReset}
                onCancel={handleReset}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>¡Bien hecho! Has adivinado la frase correctamente: {word}</p>
            </Modal>
        </div>
    );
}

export default HangmanGame;