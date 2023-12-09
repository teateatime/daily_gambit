document.addEventListener('DOMContentLoaded', function () {
    let currentMoney = 10000;
    let successRate = 50;
    let winningsMultiplier = 1.5;
    let fileName;
    let questions;
    let selectedQuestion;
    let bonusStatus;
    let turnCounter = 0;
    let questionActive = false;
    let dashboardActive = false;
    let hasBoughtOnCurrentTurn = false;
    let stockItemCounts = {};

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
    const stocksInventory = document.querySelector('.stocksInventory ul');

    moneyElement.textContent = `Current Money: $${currentMoney}`;
    successRateElement.textContent = `Success rate: ${successRate}%`;
    winningsMultiplierElement.textContent = `Winnings Multiplier: ${winningsMultiplier}x`;

    const xValues = generateXValues(turnCounter); // Initial x-values
    const initialData = [
        [1],
        [2],
        [3],
        [4],
        [5]
    ];
    const colors = ['red', 'blue', 'green', 'orange', 'purple'];
    const itemLabels = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: initialData.map((data, index) => ({
                data: data,
                borderColor: colors[index],
                fill: false,
                label: itemLabels[index]
            }))
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Number of Turns'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Cost ($ in thousands)'
                    }
                }
            }
        }
    });

    let subArray = 0;
    let storeBuy = []; // Store the purchased values
    let tempValue = [];
    let purchaseHistory = []; // Store the history of purchases and sales
    let currentIndex = xValues.length - 1;

    function updateChartData() {
        const xValues = generateXValues(turnCounter);
        myChart.data.labels = xValues;
        myChart.update();
    }

    function generateXValues(turnCounter) {
        const xValues = Array.from({ length: turnCounter + 1 }, (_, index) => index);
        console.log(xValues)
        return xValues;
    }

    function updateGambleValues(wagerAmount) {
        console.log(wagerAmount);
        if (wagerAmount <= 0) {
            showNotification("You don't have enough money to gamble!");
            return;
        }
    
        const gambleResult = Math.random() * 100; // Simulate a random result between 0 and 100
        if (gambleResult <= successRate) {
            // Gamble successful, make a profit based on the winnings multiplier
            const profit = wagerAmount * winningsMultiplier;
            currentMoney += profit;
            showNotification(`Gamble successful! You made a profit of $${profit}`);
            
            // Decrease successRate by 10%, but not below 10%
            successRate = Math.max(successRate - 10, 10);
        } else {
            // Gamble unsuccessful, lose the money wagered
            currentMoney -= wagerAmount;
            showNotification(`Gamble unsuccessful! You lost $${wagerAmount}`);
            successRate = 50;
        }
    
        moneyElement.textContent = `Current Money: $${currentMoney}`;
        successRateElement.textContent = `Success rate: ${successRate}%`;

        if((playerWon())) {
            return;
        }

        startQuestionButton.disabled = false;
        investmentButton.disabled = false;
    }

    gambleButton.addEventListener('click', function () {
        if (!questionActive && !dashboardActive) {
            // Show the wager form
            startQuestionButton.disabled = true;
            investmentButton.disabled = true;
            document.querySelector('.wager-form').style.display = 'block';
        }
    });

    document.getElementById('wager-close').addEventListener('click', function () {
        startQuestionButton.disabled = false;
        investmentButton.disabled = false;
        document.querySelector('.wager-form').style.display = 'none';
    });

    document.getElementById('wager-submit').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        // Get the wager amount from the form
        wagerAmount = parseFloat(document.getElementById('wagerAmount').value);
    
        // Validate if the wager amount is a positive number
        if (isNaN(wagerAmount) || wagerAmount <= 0 || wagerAmount === null || wagerAmount === " ") {
            showNotification("Invalid wager amount. Please enter a positive number.");
            return;
        }
    
        // Ensure the user has enough money to place the wager
        if (wagerAmount > currentMoney) {
            showNotification("You don't have enough money for this wager!");
            return;
        }
    
        // Proceed with the gamble
        updateGambleValues(wagerAmount);
    
        // Hide the wager form after submission
        document.querySelector('.wager-form').style.display = 'none';
    });
    
    investmentButton.addEventListener('click', function () {
        if (!questionActive && !dashboardActive && !gambleButton.disabled) {
            toggleDashboardVisibility();
        }
    });

    closeButton.addEventListener('click', function () {
        hideDashboard();
        dashboardActive = false; // Set the dashboard as inactive when closed
    });

    startQuestionButton.addEventListener('click', function () {
        if (!questionActive && !dashboardActive) {
            // Check if the Gamble button is active
            if (!gambleButton.disabled) {
                currentIndex++;
    
                const addedValues = [];
                myChart.data.datasets.forEach((dataset, index) => {
                    const newValue = Math.floor(Math.random() * 10);
                    dataset.data.push(newValue);
                    addedValues.push(newValue);
                    tempValue.push(newValue)
                });
                // Modify tempValue to isolate the latest value in each sub-array
                const lastValues = [];
                for (let i = 0; i < initialData.length; i++) {
                    lastValues.push(tempValue[tempValue.length - (i + 1)]);
                }
                tempValue = lastValues.reverse();
    
                myChart.data.labels.push(currentIndex * 10);
                myChart.update();
    
                subArray++;
    
                if (!questionActive) {
                    questionActive = true; // Set to true when a question is started
                    startQuestion();
                    updateChartData();
                }
            }
        }
    });

    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (questionActive) {
            checkAnswer();
            questionActive = false; // Set to false when the user submits an answer
        }
    });

    buyButton.addEventListener('click', function () {
        if (turnCounter === 0) {
            showNotification("Stocks are empty!");
            return;
        }
    
        // Get the total value to be bought in thousands
        const totalValueToBuy = tempValue.reduce((sum, value) => sum + value, 0) * 100;
    
        // Check if the user has enough money to buy
        if (totalValueToBuy > currentMoney) {
            showNotification("You don't have enough money to buy!");
            return;
        }
    
        // Deduct the amount from current money
        currentMoney -= totalValueToBuy;
        moneyElement.textContent = `Current Money: $${currentMoney}`;
    
        // Store a copy of tempValue, the turn number, and the total value in the storeBuy array
        storeBuy.push({
            turn: turnCounter,
            values: [...tempValue.map(value => value * 100)],
            totalValue: totalValueToBuy
        });
    
        // Update the investment inventory screen
        updateStocksInventory();
    
        showNotification('Purchased!');
    
        hasBoughtOnCurrentTurn = true;
    });
    
    sellButton.addEventListener('click', function () {
        // Check if the user has items to sell
        if (storeBuy.length === 0) {
            showNotification("You don't have anything to sell!");
            return;
        }
    
        let totalEarnings = 0;
    
        // Loop through storeBuy and calculate total earnings based on the current stock prices
        for (const purchase of storeBuy) {
            const currentStockPrices = tempValue.map(value => value * 100);
            const currentValue = purchase.values.reduce((sum, value, index) => {
                const currentPrice = currentStockPrices[index];
                return sum + currentPrice;
            }, 0);
            totalEarnings += currentValue;
        }
    
        // Subtract the total earnings from current money
        currentMoney += totalEarnings;
        moneyElement.textContent = `Current Money: $${currentMoney}`;
    
        showNotification(`Sold! Gain: $${totalEarnings}`);
    
        // Clear the storeBuy array
        storeBuy = [];
    
        // Reset the flag since the user has sold on this turn
        hasBoughtOnCurrentTurn = false;
    
        // Clear and update the investment inventory screen
        updateStocksInventory();
    });
    
    function updateStocksInventory() {
        // Clear the content of the investment inventory screen
        stocksInventory.innerHTML = '';
    
        // Populate the stocks inventory with the bought items and their counts
        const stockItemCounts = {}; // Keep track of the count of each stock item
        for (const purchase of storeBuy) {
            for (let i = 0; i < purchase.values.length; i++) {
                const itemName = `Item ${i + 1}`;
                stockItemCounts[itemName] = (stockItemCounts[itemName] || 0) + 1;
            }
        }
    
        // Append the items and counts to the investment inventory screen
        for (const itemName in stockItemCounts) {
            const count = stockItemCounts[itemName];
            const listItem = document.createElement('li');
            listItem.textContent = `${itemName} * ${count}`;
            stocksInventory.appendChild(listItem);
        }
    }

    function toggleDashboardVisibility() {
        if (dashboardContainer.style.display === 'none' || dashboardContainer.style.display === '') {
            dashboardContainer.style.display = 'flex';
            dashboardActive = true; // Set the dashboard as active
        } else {
            dashboardContainer.style.display = 'none';
            dashboardActive = false; // Set the dashboard as inactive
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

        if (eventChance <= 1) {
            // 1% chance - Negative effect: Player loses all money
            currentMoney = 0;
            moneyElement.textContent = `Current Money: $${currentMoney}`;
            showNotification('Random event: You lost all your money!');
        } else if (eventChance <= 5) {
            // 4% chance - Positive effect: Double profits for the next correct answer
            bonusStatus = true;
            showNotification('Random event: Double profits for the next correct answer!');
        }
        // For the other 95%, nothing happens
    }

    function startQuestion() {
        turnCounter++;
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
                    currentMoney += 10000;
    
                    // Check if currentMoney is negative, set it to 0
                    currentMoney = Math.max(currentMoney, 0);

                    if (bonusStatus == true) {
                        currentMoney += 10000;
                        bonusStatus = false;
                    }
    
                    moneyElement.textContent = `Current Money: $${currentMoney}`;
    
                    if (playerWon()) {
                        return; // Player won
                    }
    
                    questionDiv.style.display = 'none';
                    formContainer.style.display = 'none';
                    header.style.display = 'block';

                    showNotification('Nice Job! You got the correct answer!');

                } else {
                    if (bonusStatus == true) {
                        bonusStatus = false;
                    }
                    currentMoney -= 10000;
    
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
            resultDiv.textContent = `Congratulations! You reached 1 million dollars and won the game! Amount of Turns to Win: ${turnCounter}`;
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
