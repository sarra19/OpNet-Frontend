/*eslint-disable*/
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const QuizUser = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 600 secondes = 10 minutes
  const [offerId, setOfferId] = useState(''); // Nouvelle dépendance d'état pour l'ID de l'offre

  useEffect(() => {
    if (!quizSubmitted) {
      fetchQuestions();
      startTimer();
    }
  }, [quizSubmitted]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Utilisation de l'ID de l'offre dans la requête
      const response = await axios.get(`http://localhost:5000/quiz/${offerId}`);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  // Fonction pour modifier la valeur de l'ID de l'offre
  const handleOfferIdChange = (event) => {
    setOfferId(event.target.value);
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleOptionChange = (questionId, optionIndex) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionId] = optionIndex;
    setAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async () => {
    const totalQuestions = questions.length;
    let correctAnswers = 0;
    answers.forEach((selectedOption, index) => {
      if (selectedOption === questions[index].correctOption) {
        correctAnswers++;
      }
    });
    const calculatedScore = (correctAnswers / totalQuestions) * 100;
    setScore(calculatedScore.toFixed(2));
    setQuizSubmitted(true);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
      <MDBox
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="success"
        mx={1}
        mt={0.1}
        p={2}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Quiz
        </MDTypography>
      </MDBox>
        {!quizSubmitted && (
          <div>
            <p style={styles.timeRemaining}>Temps restant : {formatTime()}</p>
            {loading && <p style={styles.loading}>Chargement...</p>}
            {error && <p style={styles.error}>Erreur lors du chargement des questions.</p>}
            {!loading && !error && !quizSubmitted && (
              <div>
                {questions.map((question, index) => (
                  <div key={question._id} style={styles.questionContainer}>
                    <h3>{question.text}</h3>
                    <ul style={styles.optionsList}>
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} style={styles.option}>
                          <input
                            type="radio"
                            id={`question-${index}-option-${optionIndex}`}
                            name={`question-${index}`}
                            value={optionIndex}
                            onChange={() => handleOptionChange(index, optionIndex)}
                          />
                          <label htmlFor={`question-${index}-option-${optionIndex}`}>{option}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <button style={styles.submitButton} onClick={handleSubmitQuiz}>Soumettre Quiz</button>
              </div>
            )}
          </div>
        )}
        {quizSubmitted && (
          <p style={styles.score}>Votre score : {score}%</p>
        )}
      </div>
    </DashboardLayout>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  questionContainer: {
    marginBottom: '20px',
  },
  optionsList: {
    listStyleType: 'none',
    padding: 0,
  },
  option: {
    marginBottom: '10px',
  },
  submitButton: {
    backgroundColor: 'red',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  score: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  timeRemaining: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
};

export default QuizUser;