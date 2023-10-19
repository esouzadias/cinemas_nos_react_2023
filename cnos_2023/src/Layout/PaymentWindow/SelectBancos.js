import React, { useState, useEffect } from 'react'
import './SelectBancos.scss'

function SelectBancos({ setSelectedBancos, selectedNumeroPessoas }) {
  const [matrix, setMatrix] = useState([]);
  const [activeCells, setActiveCells] = useState([]);

  const handleSeatSelect = (rowIndex, colIndex) => {
    const cellId = `${String.fromCharCode(65 + colIndex)}-${rowIndex + 1}`;
    const isCellActive = activeCells.includes(cellId);
    const seat = matrix[rowIndex][colIndex];

    if (seat === 'unavailable' || seat === 'occupied') {
      return;
    }

    if (isCellActive) {
      setActiveCells((prevCells) => prevCells.filter((cell) => cell !== cellId));
      setSelectedBancos((prevBancos) =>
        prevBancos.filter((banco) => banco.rowIndex !== rowIndex || banco.colIndex !== colIndex)
      );
    } else {
      const isCellAvailable = !activeCells.includes(cellId) && selectedNumeroPessoas > activeCells.length;

      if (isCellAvailable) {
        setActiveCells((prevCells) => [...prevCells, cellId]);
        setSelectedBancos((prevBancos) => [
          ...prevBancos,
          { rowIndex, colIndex, cellId },
        ]);
      }
    }
  };

  useEffect(() => {
    // Gere o número de colunas aleatoriamente entre 5 e 12
    const numCols = Math.floor(Math.random() * (12 - 5 + 1)) + 5;

    // Gere o número de colunas "unavailable" entre 1 e 2
    const numUnavailableCols = Math.floor(Math.random() * 2) + 1;

    // Gere as posições aleatórias para as colunas "unavailable"
    const unavailableCols = [];
    while (unavailableCols.length < numUnavailableCols) {
      const colIndex = Math.floor(Math.random() * numCols);
      if (!unavailableCols.includes(colIndex)) {
        unavailableCols.push(colIndex);
      }
    }

    // Gere a matriz
    const newMatrix = Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: numCols }, (_, colIndex) => {
        if (unavailableCols.includes(colIndex)) {
          // Coluna "unavailable"
          return 'unavailable';
        } else {
          // Coluna selecionável
          return `${String.fromCharCode(65 + colIndex)}-${rowIndex + 1}`;
        }
      })
    );

    // Adicione aleatoriamente entre 2 e 6 bancos "occupied" em colunas selecionáveis
    let occupiedCount = 0;
    while (occupiedCount < Math.floor(Math.random() * (6 - 2 + 1)) + 2) {
      const randomRowIndex = Math.floor(Math.random() * 5);
      const randomColIndex = Math.floor(Math.random() * numCols);

      if (newMatrix[randomRowIndex][randomColIndex] !== 'unavailable') {
        newMatrix[randomRowIndex][randomColIndex] = 'occupied';
        occupiedCount++;
      }
    }

    setMatrix(newMatrix);
  }, []);

  return (
    <div className='matrix'>
      <table>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((seat, colIndex) => (
                <td
                  key={colIndex}
                  id={seat}
                  onClick={() => handleSeatSelect(rowIndex, colIndex)}
                  className={`banco ${activeCells.includes(seat) ? 'active' : ''} ${seat === 'unavailable' ? 'unavailable' : ''}`}
                >{String.fromCharCode(65 + colIndex)}-{rowIndex + 1}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SelectBancos