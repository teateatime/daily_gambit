document.addEventListener('DOMContentLoaded', function () {
    let currentMoney = 100;
    let successRate = 90;
    let winningsMultiplier = 1.5;
    let fileName;
    let questions;
    let selectedQuestion;
    let bonusStatus;

    const moneyElement = document.querySelector('.Stonks p');
    const gambleButton = document.querySelector('.Gamble button');
    const successRateElement = document.querySelector('.gambleDetails p:nth-child(1)');
    const winningsMultiplierElement = document.querySelector('.gambleDetails p:nth-child(2)');

    const dashboardContainer = document.querySelector('.dashboardContainer');
    const investmentButton = document.querySelector('.Stonks button');
    const closeButton = document.querySelector('.close');
    const buyButton = document.querySelector('.investmentWindow .btn-primary:nth-child(1)');
    const sellButton = document.querySelector('.investmentWindow .btn-primary:nth-child(2)');

    const startQuestionButton = document.querySelector('.Work .btn-primary');
    const questionDiv = document.querySelector('.question');
    const formContainer = document.querySelector('.formContainer');
    const header = document.querySelector('.header');
    const generatedNumberDiv = document.querySelector('.diceNum');
    const submitButton = document.querySelector('.formContainer button');
    const inputNumber = document.querySelector('#inputNumber');
    const resultDiv = document.querySelector('.result');

    moneyElement.textContent = `Current Money: $${currentMoney}`;
    successRateElement.textContent = `Success rate: ${successRate}%`;
    winningsMultiplierElement.textContent = `Winnings Multiplier: ${winningsMultiplier}x`;

    function updateGambleValues() {
        if (currentMoney <= 0) {
            showNotification("You don't have enough money to gamble!");
            return;
        }
    
        const gambleResult = Math.random() * 100; // Simulate a random result between 0 and 100
        if (gambleResult <= successRate) {
            // Gamble successful, make a profit based on the winnings multiplier
            const profit = currentMoney * winningsMultiplier;
            currentMoney += profit;
            showNotification(`Gamble successful! You made a profit of $${profit}`);
            
            // Decrease successRate by 10%, but not below 10%
            successRate = Math.max(successRate - 10, 10);
        } else {
            // Gamble unsuccessful, lose the money wagered
            currentMoney -= currentMoney;
            showNotification(`Gamble unsuccessful! You lost $${currentMoney}`);
        }
    
        moneyElement.textContent = `Current Money: $${currentMoney}`;
        successRateElement.textContent = `Success rate: ${successRate}%`;

        if((playerWon())) {
            return;
        }
    }

    gambleButton.addEventListener('click', function () {
        updateGambleValues();
    });

    investmentButton.addEventListener('click', function () {
        toggleDashboardVisibility();
    });

    closeButton.addEventListener('click', function () {
        hideDashboard();
    });

    buyButton.addEventListener('click', function () {
        hideDashboard();
        showNotification('Purchased!');
    });

    sellButton.addEventListener('click', function () {
        hideDashboard();
        showNotification('Sold!');
    });

    startQuestionButton.addEventListener('click', function () {
        startQuestion();
    });

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        checkAnswer();
    });

    function toggleDashboardVisibility() {
        if (dashboardContainer.style.display === 'none' || dashboardContainer.style.display === '') {
            dashboardContainer.style.display = 'flex';
        } else {
            dashboardContainer.style.display = 'none';
        }
    }

    function hideDashboard() {
        dashboardContainer.style.display = 'none';
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function () {
            notification.remove();
        }, 3000);
    }

    function randomEvents() {
        console.log("randomEvents Called")
        const eventChance = Math.random() * 100; // Simulate a random result between 0 and 100

        if (eventChance <= 5) {
            // 5% chance - Negative effect: Player loses all money
            currentMoney = 0;
            moneyElement.textContent = `Current Money: $${currentMoney}`;
            showNotification('Random event: You lost all your money!');
        } else if (eventChance <= 10) {
            // 5% chance - Positive effect: Double profits for the next correct answer
            bonusStatus = true;
            showNotification('Random event: Double profits for the next correct answer!');
        }
        // For the other 90%, nothing happens
    }

    function startQuestion() {
        randomEvents();
        const randomNumber = Math.floor(Math.random() * 6) + 1;

        generatedNumberDiv.style.display = 'block';
        generatedNumberDiv.textContent = `Generated Number: ${randomNumber}`;

        // Load the appropriate JSON file based on the random number
        if (randomNumber === 1) {
            fileName = 'JSON/addition.json';
        } else if (randomNumber === 2) {
            fileName = 'JSON/subtraction.json';
        } else if (randomNumber === 3) {
            fileName = 'JSON/mult.json';
        } else if (randomNumber === 4) {
            fileName = 'JSON/division.json';
        } else if (randomNumber === 5) {
            fileName = 'JSON/algebra.json';
        } else if (randomNumber === 6) {
            fileName = 'JSON/exp.json';
        }

        fetch(fileName)
            .then(response => response.json())
            .then(data => {
                questions = data.questions; // Set questions as a global variable
                const randomIndex = Math.floor(Math.random() * questions.length);
                selectedQuestion = questions[randomIndex]; // Set selectedQuestion as a global variable

                questionDiv.textContent = `Question: ${selectedQuestion}`;
            })
            .catch(error => console.error('Error loading question:', error));

        setTimeout(function () {
            generatedNumberDiv.style.display = 'none';
            header.style.display = 'none';
            questionDiv.style.display = 'block';
            formContainer.style.display = 'block';
        }, 1500);
    }

    function checkAnswer() {
        const correctAnswer = parseFloat(inputNumber.value); // Parse as float for decimal precision
    
        console.log(fileName);
        // Load the appropriate JSON file based on the question
        let answerFileName;
    
        if (fileName === 'JSON/addition.json') {
            answerFileName = 'JSON/addition_ans.json';
        } else if (fileName === 'JSON/subtraction.json') {
            answerFileName = 'JSON/subtraction_ans.json';
        } else if (fileName === 'JSON/mult.json') {
            answerFileName = 'JSON/mult_ans.json';
        } else if (fileName === 'JSON/division.json') {
            answerFileName = 'JSON/division_ans.json';
        } else if (fileName === 'JSON/algebra.json') {
            answerFileName = 'JSON/algebra_ans.json';
        } else if (fileName === 'JSON/exp.json') {
            answerFileName = 'JSON/exp_ans.json';
        }
    
        fetch(answerFileName)
            .then(response => response.json())
            .then(data => {
                const answers = data.answers;
                const answerIndex = questions.indexOf(selectedQuestion);
                const correctAnswerFromJson = answers[answerIndex];
    
                if (correctAnswer === correctAnswerFromJson) {
                    currentMoney += 1000;
    
                    // Check if currentMoney is negative, set it to 0
                    currentMoney = Math.max(currentMoney, 0);

                    if (bonusStatus == true) {
                        currentMoney += 1000;
                        bonusStatus = false;
                    }
    
                    moneyElement.textContent = `Current Money: $${currentMoney}`;
    
                    if (playerWon()) {
                        return; // Player won
                    }
    
                    startQuestion(); // Move to the next question
                } else {
                    currentMoney -= 1000;
    
                    // Check if currentMoney is negative, set it to 0
                    currentMoney = Math.max(currentMoney, 0);
    
                    resultDiv.textContent = `Incorrect. Try again! The Correct Answer is: ${correctAnswerFromJson}`;
                    resultDiv.style.display = 'block';
    
                    setTimeout(function () {
                        resultDiv.style.display = 'none';
                    }, 3000);
    
                    moneyElement.textContent = `Current Money: $${currentMoney}`;
                    questionDiv.style.display = 'none';
                    formContainer.style.display = 'none';
                    header.style.display = 'block';
                }
            })
            .catch(error => console.error('Error loading answer:', error));
    }    

    function playerWon() {
        if (currentMoney >= 1000000) {
            resultDiv.textContent = 'Congratulations! You reached 1 million dollars and won the game!';
            resultDiv.style.display = 'block';

            const quitButton = document.createElement('button');
            quitButton.className = 'btn btn-danger';
            quitButton.textContent = 'Quit';

            quitButton.addEventListener('click', function () {
                window.location.href = 'index.html';
            });

            resultDiv.appendChild(quitButton);

            questionDiv.style.display = 'none';
            formContainer.style.display = 'none';
            header.style.display = 'block';

            return true; // Player won
        }
        return false; // Player hasn't won yet
    }
});
