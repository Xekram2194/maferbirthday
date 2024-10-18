import React, { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { db } from '../firebase-config'; // Adjust the import path as necessary
import { collection, addDoc } from 'firebase/firestore';
import './style.css'; // Ensure your CSS styles are set up
import MenuHamburguesa from '../components/MenuHamburguesa';


function SudokuGame() {
    const phrases = [
        "Un 14 de febrero tuvimos nuestra primera cita y me contaste tu sueno. Te acuerdas?",
        "Solos mirandonos a los ojos me contaste que fue algo que siempre qusiste pero nunca lo tuviste. Vamos ahora si te Acuerdas?",
        "Te traje un regalo bonito y me diste un beso. ahi me dijiste que querias algo unico. Recuerdas mi amor",
        "Un 30 me declare a mi amor y me dijiste que si. Ahi me dijiste que te acompane para toda vida y me dijiste algo habias sonado tener te acuerdas?",
        "Si un beso hablara, en lagrimas me dijiste algo que nunca pudiste tener en carro mientras me contabas sobre tu hermana. Te acuerdas?",
        "Una noche te tome una foto y tu me dijiste mirando a la luna. Un bonito sueno que tenias. Ahora si te acuerdas?"
    ];
    const initialBoard = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const [board, setBoard] = useState(() => prepareBoard(initialBoard, 50));
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timer, setTimer] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errors, setErrors] = useState([]);
    const [randomPhrase, setRandomPhrase] = useState('');


    useEffect(() => {
        startTimer();
        return () => stopTimer(); // Limpiar el intervalo cuando el componente se desmonte
    }, []);

    const startTimer = () => {
        stopTimer();
        const newTimer = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 1);
        }, 1000);
        setTimer(newTimer);
    };

    const stopTimer = () => {
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
    };

    const handleCellChange = (value, rowIndex, colIndex) => {
        if (/^[1-9]$/.test(value) || value === '') {
            const newBoard = [...board];
            newBoard[rowIndex][colIndex] = value ? parseInt(value) : 0;
            setBoard(newBoard);
            // Clear errors as the user is attempting to correct them
            setErrors(errors.filter(error => error.rowIndex !== rowIndex || error.colIndex !== colIndex));
        }
    };

    const checkSolution = () => {
        stopTimer();
        let newErrors = [];

        // Validate rows, columns, and squares
        for (let i = 0; i < 9; i++) {
            const row = board[i];
            const column = board.map(row => row[i]);
            const square = [];
            const startRow = Math.floor(i / 3) * 3;
            const startCol = (i % 3) * 3;
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    square.push(board[startRow + j][startCol + k]);
                }
            }

            if (!isValidGroup(row) || !isValidGroup(column) || !isValidGroup(square)) {
                row.forEach((_, colIndex) => newErrors.push({ rowIndex: i, colIndex }));
                column.forEach((_, rowIndex) => newErrors.push({ rowIndex, colIndex: i }));
                square.forEach((_, idx) => {
                    newErrors.push({
                        rowIndex: startRow + Math.floor(idx / 3),
                        colIndex: startCol + (idx % 3)
                    });
                });
            }
        }

        setErrors(newErrors);
        if (newErrors.length > 0) {
            showModal('error', 'Error', 'Revisa el tablero. Un número se repite o falta un número.');
            return;
        }

        showModal2();
    };

    const isValidGroup = (group) => {
        const set = new Set(group);
        return set.size === 9 && !set.has(0);
    };

    const showModal2 = () => {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        setRandomPhrase(phrases[randomIndex]);
        setShowSuccessModal(true);
    };

    const showModal = (type, title, content) => {
        if (type === 'error') {
            Modal.error({
                title: title,
                content: content,
            });
        } else if (type === 'success') {
            Modal.success({
                title: title,
                content: content,
            });
        }
    };

    const handleSubmit = async () => {
        try {
            await addDoc(collection(db, "responses"), {
                response: inputValue,
                timestamp: new Date()
            });
            console.log("Response saved!");
        } catch (error) {
            console.error("Error saving the response: ", error);
        }
        resetBoard();
    };

    const resetBoard = () => {
        setBoard(prepareBoard(initialBoard, 50));  // Asumiendo que '2' es la cantidad de celdas vacías deseada
        setTimeElapsed(0);  // Reiniciar el contador de tiempo
        stopTimer();        // Detener el temporizador actual
        startTimer();       // Iniciar un nuevo temporizador
        setErrors([]);      // Limpiar los errores
        setInputValue('');
        setShowSuccessModal(false);
    };

    const formatTime = () => {
        const hours = Math.floor(timeElapsed / 3600);
        const minutes = Math.floor((timeElapsed % 3600) / 60);
        const seconds = timeElapsed % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="sudoku-container">
        <MenuHamburguesa />
        <div className="timer" style={{ position: 'absolute', top: 10, right: 10 }}>
            Time: {timeElapsed}
        </div>
        <h1 style={{ marginTop: '50px'}}>Sudoku Game</h1>
        <div className="sudoku-board">
            {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                    <Input
                        key={`${rowIndex}-${colIndex}`}
                        className="sudoku-cell"
                        value={cell || ''}
                        onChange={e => handleCellChange(e.target.value, rowIndex, colIndex)}
                        maxLength={1}
                    />
                ))
            ))}
        </div>
        <Button onClick={checkSolution} type="primary" style={{ marginTop: '20px', marginRight: '10px' }}>
            Verificar Solución
        </Button>
        <Button onClick={resetBoard} style={{ marginTop: '20px' }}>
            Resetear el sudoku
        </Button>
        <p style={{ margin: '20px', fontWeight:'300', fontSize:'1rem', textAlign:'center' }} >Recuerda que cada ves que termines vas a tener 5 pistas unicas que te van a llevar a tu regalo</p>
        {showSuccessModal && (
            <Modal
                title="¡Felicidades! Has completado el Sudoku correctamente."
                visible={showSuccessModal}
                onOk={handleSubmit}
                onCancel={() => setShowSuccessModal(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Volver a jugar
                    </Button>
                ]}
            >
                <p>{randomPhrase}</p>
                <Input placeholder="Escribe tu respuesta aquí" onChange={e => setInputValue(e.target.value)} value={inputValue} />
            </Modal>
        )}
    </div>
    );
}

// Función para vaciar aleatoriamente algunas celdas en el tablero
function prepareBoard(board, emptyCount) {
    const newBoard = board.map(row => [...row]);
    let emptyCells = 0;
    while (emptyCells < emptyCount) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            emptyCells++;
        }
    }
    return newBoard;
}

export default SudokuGame;
