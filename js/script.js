document.addEventListener('DOMContentLoaded', function () {
    let currentMoney = 100;
    let successRate = 90;
    let winningsMultiplier = 1.5;

    const moneyElement = document.querySelector('.Stonks p');
    const gambleButton = document.querySelector('.Gamble button');
    const successRateElement = document.querySelector('.gambleDetails p:nth-child(1)');
    const winningsMultiplierElement = document.querySelector('.gambleDetails p:nth-child(2)');

    moneyElement.textContent = `Current Money: $${currentMoney}`;
    successRateElement.textContent = `Success rate: ${successRate}%`;
    winningsMultiplierElement.textContent = `Winnings Multiplier: ${winningsMultiplier}x`;

    gambleButton.addEventListener('click', function () {
        // Update values
        currentMoney = 150;
        successRate = 80;
        winningsMultiplier = 2.0;

        // Update elements
        moneyElement.textContent = `Current Money: $${currentMoney}`;
        successRateElement.textContent = `Success rate: ${successRate}%`;
        winningsMultiplierElement.textContent = `Winnings Multiplier: ${winningsMultiplier}x`;
    });

    const dashboardContainer = document.querySelector('.dashboardContainer');
    const investmentButton = document.querySelector('.Stonks button');

    // Event listener for Investment button
    investmentButton.addEventListener('click', function () {
        // Toggle visibility of dashboardContainer
        if (dashboardContainer.style.display === 'none' || dashboardContainer.style.display === '') {
            dashboardContainer.style.display = 'flex';
        } else {
            dashboardContainer.style.display = 'none';
        }
    });

    const closeButton = document.querySelector('.close');

    closeButton.addEventListener('click', function () {
        dashboardContainer.style.display = 'none';
    });

    const buyButton = document.querySelector('.investmentWindow .btn-primary:nth-child(1)');
    const sellButton = document.querySelector('.investmentWindow .btn-primary:nth-child(2)');

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(function () {
            notification.remove();
        }, 3000);
    }

    // Event listeners for Buy and Sell buttons
    buyButton.addEventListener('click', function () {
        dashboardContainer.style.display = 'none';
        showNotification('Purchased!');
    });

    sellButton.addEventListener('click', function () {
        dashboardContainer.style.display = 'none';
        showNotification('Sold!');
    });

    const startQuestionButton = document.querySelector('.Work .btn-primary');
    const questionDiv = document.querySelector('.question');
    const formContainer = document.querySelector('.formContainer');
    const header = document.querySelector('.header');

    // Event listener for Start Question button
    startQuestionButton.addEventListener('click', function () {
        // Show the question div and input form
        header.style.display = 'none';
        questionDiv.style.display = 'block';
        formContainer.style.display = 'block';
    });

    const submitButton = document.querySelector('.formContainer button');
    const inputNumber = document.querySelector('#inputNumber');
    const resultDiv = document.querySelector('.result');

    // Event listener for the Submit button
    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the form from submitting and refreshing the page

        const correctAnswer = parseInt(inputNumber.value);
        if (correctAnswer === 76) {
            currentMoney += 50;
            moneyElement.textContent = `Current Money: $${currentMoney}`;

            resultDiv.textContent = 'Correct!';
            resultDiv.style.display = 'block';

            questionDiv.style.display = 'none';
            formContainer.style.display = 'none';
            header.style.display = 'block';

            // Hide question div and input form after 3 seconds
            setTimeout(function () {
                resultDiv.style.display = 'none';
            }, 3000);
        } else {
            resultDiv.textContent = 'Incorrect. Try again!';
            resultDiv.style.display = 'block';

            setTimeout(function () {
                resultDiv.style.display = 'none';
            }, 3000);

            questionDiv.style.display = 'none';
            formContainer.style.display = 'none';
            header.style.display = 'block';
        }
    });
});
