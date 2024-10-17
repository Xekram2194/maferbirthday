import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import moment from 'moment';
import AdivinanzasGame from './games/AdivinanzasGame'; // Asegúrate de tener este componente
import MemoriaGame from './games/MemoriaGame'; // Asume que tienes este componente
import PuzzleGame from './games/PuzzleGame'; // Asume que tienes este componente
import LaberintoGame from './games/LaberintoGame'; // Asume que tienes este componente
import TriviaGame from './games/TriviaGame'; // Asume que tienes este componente
import DiferenciaGame from './games/DiferenciaGame'; // Asume que tienes este componente
import PersonalidadGame from './games/PersonalidadGame'; // Asume que tienes este componente

// Definición de juegos en un nivel superior
const games = [
  { day: 16, name: "Juego de Adivinanzas", route: '/adivinanzas', component: AdivinanzasGame },
  { day: 17, name: "Juego de Ahorcado", route: '/memoria', component: MemoriaGame },
  { day: 18, name: "Puzzle de Imágenes", route: '/puzzle', component: PuzzleGame },
  { day: 19, name: "Juego de Laberintos", route: '/laberinto', component: LaberintoGame },
  { day: 20, name: "Trivia", route: '/trivia', component: TriviaGame },
  { day: 21, name: "Juego de 'Encuentra la Diferencia'", route: '/diferencia', component: DiferenciaGame },
  { day: 22, name: "Cuestionario de Personalidad", route: '/personalidad', component: PersonalidadGame }
];

function HomePage() {
  const birthday = moment('2024-10-23');
  const [timeLeft, setTimeLeft] = useState({
    days: undefined,
    hours: undefined,
    minutes: undefined,
    seconds: undefined,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = moment();
      const duration = moment.duration(birthday.diff(now));

      setTimeLeft({
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [birthday]);

  const renderGames = () => {
    const today = moment();
    return games.map(game => {
      const releaseDate = moment(birthday).subtract(23 - game.day, 'days');
      const isAvailable = today.isSameOrAfter(releaseDate, 'day');
      return (
        <Card key={game.name} title={game.name} style={{ marginTop: '10px' }}>
          {isAvailable ? (
            <Link to={game.route}>
              <Button type="primary">Jugar</Button>
            </Link>
          ) : (
            `Disponible el ${releaseDate.format('YYYY-MM-DD')}`
          )}
        </Card>
      );
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center'}}>
      <h1>¡Cuenta regresiva para tu cumpleaños de mi amorcito!</h1>
      <h1>MAFER</h1>
      <h2>
        Faltan {timeLeft.days} días, {timeLeft.hours} horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
      </h2>
      <div>{renderGames()}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {games.map(game => (
          <Route key={game.route} path={game.route} element={<game.component />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;