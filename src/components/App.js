import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
	const [page, setPage] = useState("List");
	const [questions, setQuestion] = useState([]);

	// POST add to server and update DOM
	function addQuestion(newQuestion) {
		const postQuestion = {
			prompt: newQuestion.prompt,
			answers: [
				newQuestion.answer1,
				newQuestion.answer2,
				newQuestion.answer3,
				newQuestion.answer4,
			],
			correctIndex: newQuestion.correctIndex,
		};

		fetch("http://localhost:4000/questions", {
			method: "POST",
			body: JSON.stringify(postQuestion),
			headers: { "Content-type": "application/json; charset=UTF-8" },
		})
			.then((response) => response.json())
			.then((json) => setQuestion([...questions, json]))
			.catch((err) => console.log(err));
	}
	// GET from server
	useEffect(() => {
		fetch("http://localhost:4000/questions")
			.then((response) => response.json())
			.then((data) => {
				setQuestion(data);
			});
	}, []);

	// DELETE remove a question
	function deleteQuestion(id) {
		/////////////////////////
		fetch(`http://localhost:4000/questions/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((data) => {
				// this is the data we get after putting our data,
				const filtered = questions.filter(
					(question) => question.id !== id
				);
				setQuestion(filtered);
			});
	}
	////////////////////////
	//PATCH edit coreect answer
	function updateCorrectAnswer(id, answer) {
		/////////////////////
		fetch(`http://localhost:4000/questions/${id}`, {
			method: "PATCH",
			body: JSON.stringify({
				correctIndex: answer,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		})
			.then((response) => response.json())
			.then((json) => {
				const updatedCorrect = questions.map((question) => {
					if (id === question.id) {
						return { ...question, correctIndex: answer };
					} else {
						return question;
					}
				});
				setQuestion(updatedCorrect);
			});
	}

	return (
		<main>
			<AdminNavBar onChangePage={setPage} />
			{page === "Form" ? (
				<QuestionForm addQuestion={addQuestion} />
			) : (
				<QuestionList
					questions={questions}
					deleteQuestion={deleteQuestion}
					updateCorrectAnswer={updateCorrectAnswer}
				/>
			)}
		</main>
	);
}

export default App;
