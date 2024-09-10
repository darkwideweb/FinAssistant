import React, { useState, useMemo } from 'react';
import { Button, Radio, Card, Typography, Result, message } from 'antd';
import '../styles/Quiz.css'; 

const { Title } = Typography;

const Quiz = () => {
  const questions = useMemo(() => [
    {
      question: "Что такое инвестиции?",
      answers: ["Покупка акций", "Оплата налогов", "Закрытие кредита"],
      correct: "Покупка акций",
      hint: "Инвестиции связаны с увеличением вашего капитала."
    },
    {
      question: "Какой инструмент помогает планировать бюджет?",
      answers: ["Таблица", "Кредит", "Обмен валют"],
      correct: "Таблица",
      hint: "Этот инструмент позволяет вам отслеживать доходы и расходы."
    },
    {
      question: "Что такое диверсификация?",
      answers: ["Распределение инвестиций по различным активам", "Увеличение долга", "Снижение налогообложения"],
      correct: "Распределение инвестиций по различным активам",
      hint: "Это стратегия для снижения рисков."
    },
    {
      question: "Какой метод управления долгами наиболее эффективен?",
      answers: ["Консолидация долгов", "Отсрочка платежей", "Увеличение минимальных платежей"],
      correct: "Консолидация долгов",
      hint: "Этот метод объединяет несколько долгов в один."
    },
    {
      question: "Что такое кредитный рейтинг?",
      answers: ["Оценка вашей кредитоспособности", "Сумма вашего долга", "Процентная ставка по кредиту"],
      correct: "Оценка вашей кредитоспособности",
      hint: "Этот рейтинг показывает вашу способность погашать кредиты."
    },
    {
      question: "Что такое 'пассивный доход'?",
      answers: ["Доход от аренды", "Зарплата", "Доход от продаж"],
      correct: "Доход от аренды",
      hint: "Этот доход не требует активного участия."
    },
    {
      question: "Какой финансовый инструмент может обеспечить ликвидность?",
      answers: ["Краткосрочные облигации", "Долгосрочные депозиты", "Акции"],
      correct: "Краткосрочные облигации",
      hint: "Этот инструмент позволяет быстро преобразовать инвестиции в наличные средства."
    }
  ], []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [showMessage, contextHolder] = message.useMessage();

  const { question, answers, correct, hint } = questions[currentQuestion];

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      if (selectedAnswer === correct) {
        setScore(prevScore => prevScore + 1);
        showMessage.success('Правильный ответ!');
      } else {
        showMessage.error('Неправильный ответ!');
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setHintVisible(false);
        } else {
          setQuizCompleted(true);
        }
      }, 500);  
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setHintVisible(false);
  };

  const showHint = () => {
    showMessage.info(hint);
    setHintVisible(true);
  };

  return (
    <div className="quiz-container">
      {contextHolder}
      {quizCompleted ? (
        <Result
          status="success"
          title="Поздравляем!"
          subTitle={`Вы ответили правильно на ${score} из ${questions.length} вопросов.`}
          extra={[
            <Button type="primary" key="restart" onClick={restartQuiz}>
              Пройти квиз еще раз
            </Button>
          ]}
        />
      ) : (
        <Card 
        title={`Вопрос ${currentQuestion + 1}/${questions.length}`} 
        className="quiz-card"
        style={{ transition: 'opacity 0.5s ease-in-out' }} 
      >
          <Title level={4}>{question}</Title>
          <Radio.Group 
            onChange={(e) => setSelectedAnswer(e.target.value)} 
            value={selectedAnswer} 
            className="quiz-radio-group"
          >
            {answers.map((answer, index) => (
              <Radio key={index} value={answer} className="quiz-radio-button">{answer}</Radio>
            ))}
          </Radio.Group>
          <div className="quiz-actions">
            <Button
              type="default"
              onClick={showHint}
              className="quiz-hint-button"
              disabled={hintVisible}
            >
              Показать подсказку
            </Button>
            <Button
              type="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="quiz-button"
            >
              Далее
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Quiz;