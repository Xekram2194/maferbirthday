import React, { useState } from 'react';
import { Input, Button, Modal } from 'antd';
import MenuHamburguesa from '../components/MenuHamburguesa'; // Asegúrate de que la ruta de importación sea correcta
import './style.css'; // Importa tus estilos de CSS

function SudokuGame() {
    const initialBoard = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    const [board, setBoard] = useState(initialBoard);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCellChange = (value, rowIndex, colIndex) => {
        if (/^[1-9]$/.test(value) || value === '') {
            const newBoard = [...board];
            newBoard[rowIndex][colIndex] = value ? parseInt(value) : 0;
            setBoard(newBoard);
        }
    };

    const checkSolution = () => {
        // Validar filas
        for (let row of board) {
            if (!isValidGroup(row)) {
                showModal('Error', 'Revisa las filas. Un número se repite o falta un número.');
                return;
            }
        }
    
        // Validar columnas
        for (let col = 0; col < 9; col++) {
            const column = board.map(row => row[col]);
            if (!isValidGroup(column)) {
                showModal('Error', 'Revisa las columnas. Un número se repite o falta un número.');
                return;
            }
        }
    
        // Validar subcuadrículas 3x3
        for (let startRow = 0; startRow < 9; startRow += 3) {
            for (let startCol = 0; startCol < 9; startCol += 3) {
                const square = [];
                for (let row = startRow; row < startRow + 3; row++) {
                    for (let col = startCol; col < startCol + 3; col++) {
                        square.push(board[row][col]);
                    }
                }
                if (!isValidGroup(square)) {
                    showModal('Error', 'Revisa las subcuadrículas. Un número se repite o falta un número.');
                    return;
                }
            }
        }
    
        showModal('Éxito', '¡Felicidades! Has completado el Sudoku correctamente.');
    };
    
    const isValidGroup = (group) => {
        const filteredGroup = group.filter(val => val !== 0);
        const set = new Set(filteredGroup);
        return filteredGroup.length === 9 && set.size === 9;
    };
    
    const showModal = (title, content) => {
        Modal.error({
            title: title,
            content: content,
        });
    };
    

    const resetBoard = () => {
        setBoard(initialBoard);
    };

    return (
        <div className="sudoku-container">
            <MenuHamburguesa />
            <h1>Sudoku</h1>
            <div className="sudoku-board">
                {board.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <Input
                            key={`${rowIndex}-${colIndex}`}
                            value={cell || ''}
                            onChange={(e) => handleCellChange(e.target.value, rowIndex, colIndex)}
                            className="sudoku-cell"
                            maxLength={1}
                        />
                    ))
                ))}
            </div>
            <Button onClick={checkSolution} type="primary" style={{ margin: '20px' }}>
                Verificar Solución
            </Button>
            <Button onClick={resetBoard} style={{ margin: '20px' }}>
                Reiniciar Juego
            </Button>
        </div>
    );
}

export default SudokuGame;
