import React, { useState } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { db } from '../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import MenuHamburguesa from '../components/MenuHamburguesa';
import { useNavigate } from 'react-router-dom';

function AdivinanzasGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputVisible, setInputVisible] = useState(false);
  const [finalGuess, setFinalGuess] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const questions = [
    "En nuestra primera cita mencionaste algo que queria de niña ¿Te acuerdas?",
    "¿Te recuerdas que era algo muy bonito y tierno a la vez?",
    "¿Sera de un sueño que tuviste?",
    "¿Sera de una musica?",
    "¿Sera de un cuento?",
    "¿Sera de algun deporte?",
    "¿Es algo que te hara muy feliz?"
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/');  // Redirecciona al usuario al inicio
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const nextQuestion = (answer) => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setInputVisible(true);
    }
  };

  const submitGuess = async () => {
    try {
      await addDoc(collection(db, "messages"), {
        text: finalGuess,
        timestamp: new Date()
      });
      showModal();
    } catch (error) {
      showModal();  // Muestra el modal si hay un error
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <MenuHamburguesa />
      {!inputVisible ? (
        <>
          <h2 style={{ marginTop: '70px' }}>¿En qué regalo estás pensando?</h2>
          <p>{questions[currentQuestion]}</p>
          <Button onClick={() => nextQuestion('yes')} type="primary" style={{ marginRight: '10px' }}>Sí</Button>
          <Button onClick={() => nextQuestion('no')} style={{ marginLeft: '10px' }}>No</Button>
        </>
      ) : (
        <>
        <h2 style={{ marginTop: '70px' }}>¿Mafer con estas preguntas recuerdas que regalo me pediste?</h2>
        <p>Ingresa el regalo que me pediste si es correcto vas a desbloarquear el siguiente juego ahora sino esperas al dia de mañana</p>
        <p>Vamos tu puedes ....</p>
          <Input
            placeholder="¿Qué regalo era?"
            onChange={e => setFinalGuess(e.target.value)}
            style={{ width: '300px', margin: '10px 20px 0 20px' }}
          />
          <Button onClick={submitGuess} type="primary" style={{ marginTop: '20px' }}>Enviar</Button>
        </>
      )}
      <Modal style={{ textAlign: 'center'}} title="ERROR MI AMOR NO ERA ESE" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Dale click en <span style={{  fontWeight:700, fontSize:'20px', color: "#1941d4"}}>OK</span> para intentar nuevamente. </p>
        <p>Lee bien las preguntas mi amor</p>
        <p>Tu puedes mi amor ....</p>
        <p>Puedes intentar cuantas veces quieras</p>
      </Modal>
    </div>
  );
}

export default AdivinanzasGame;
