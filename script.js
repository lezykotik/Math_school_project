// Переключение темы
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

themeSwitch.addEventListener('change', () => {
    body.classList.toggle('light-theme');
    void themeSwitch.offsetWidth;
});

// Игра в кости
function rollDice() {
    const guess = document.getElementById("guess").value;
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    const resultDiv = document.getElementById("result");

    if (guess == randomNumber) {
        resultDiv.innerHTML = "Поздравляю! Вы угадали!";
    } else {
        resultDiv.innerHTML = "Не повезло! Выпало число " + randomNumber;
    }
}

// Блэкджек

// Объект для представления карты
function Card(suit, rank) {
    this.suit = suit; // "Hearts", "Diamonds", "Clubs", "Spades"
    this.rank = rank; // "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
    this.value = function() {
        if (this.rank === "J" || this.rank === "Q" || this.rank === "K") return 10;
        if (this.rank === "A") return 11; // Туз изначально как 11
        return parseInt(this.rank);
    };
    this.display = function() {
        return this.rank + this.suit.slice(0,1); // Отображение, например, "AH" (Туз Червей)
    }

   this.getCardName = function() {
      let suitSymbol = "";
        switch (this.suit) {
            case "Hearts": suitSymbol = "♥"; break;
            case "Diamonds": suitSymbol = "♦"; break;
            case "Clubs": suitSymbol = "♣"; break;
            case "Spades": suitSymbol = "♠"; break;
        }
        return this.rank + suitSymbol;
    }
}

// Объект для представления колоды
function Deck() {
    this.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    this.cards = [];

    this.createDeck = function() {
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
    };

    this.shuffleDeck = function() {
        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    };

    this.dealCard = function() {
        return this.cards.pop();
    };
}

// Объект для представления руки
function Hand() {
    this.cards = [];
    this.score = 0;
    this.aces = 0;  // Счетчик тузов

    this.addCard = function(card) {
        this.cards.push(card);
        this.score += card.value();
        if (card.rank === "A") {
            this.aces++;
        }
        this.adjustForAces();
    };

    this.adjustForAces = function() {
        while (this.score > 21 && this.aces > 0) {
            this.score -= 10; // Превращаем туза из 11 в 1
            this.aces--;
        }
    };

    this.getDisplay = function() {
        let displayString = "";
        for (let card of this.cards) {
            displayString += card.display() + " ";
        }
        return displayString;
    }

     this.getCardsHTML = function() {
            let cardsHTML = "";
            for (let card of this.cards) {
                cardsHTML += `<div class="card">${card.getCardName()}</div>`;
            }
            return cardsHTML;
        }
}

// Переменные для игры
let deck;
let dealerHand;
let playerHand;
let gameStatus;

// Получаем элементы из DOM
const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const dealButton = document.getElementById("deal-button");
const gameStatusEl = document.getElementById("game-status");


// Функции для игры
function startGame() {
    deck = new Deck();
    deck.createDeck();
    deck.shuffleDeck();

    dealerHand = new Hand();
    playerHand = new Hand();
    gameStatus = "";

    // Раздача карт
    playerHand.addCard(deck.dealCard());
    dealerHand.addCard(deck.dealCard());
    playerHand.addCard(deck.dealCard());
    dealerHand.addCard(deck.dealCard());

    // Обновление отображения
    updateUI();

    // Включаем кнопки
    hitButton.disabled = false;
    standButton.disabled = false;
    dealButton.disabled = true; // Отключаем кнопку "Начать игру"
}

function hit() {
    playerHand.addCard(deck.dealCard());
    updateUI();
    checkPlayerBust();
}

function stand() {
    dealerTurn();
}

function dealerTurn() {
    while (dealerHand.score < 17) {
        dealerHand.addCard(deck.dealCard());
    }
    endGame();
}

function checkPlayerBust() {
    if (playerHand.score > 21) {
        gameStatus = "Вы проиграли! Перебор!";
        endGame();
    }
}

function endGame() {
    hitButton.disabled = true;
    standButton.disabled = true;
    dealButton.disabled = false; // Включаем кнопку "Начать игру"

    let message = "";
    if (gameStatus === "") {  // Если еще нет статуса, определяем победителя
        if (playerHand.score > 21) {
            message = "Вы проиграли! Перебор!";
        } else if (dealerHand.score > 21) {
            message = "Вы выиграли! Дилер перебрал!";
        } else if (playerHand.score > dealerHand.score) {
            message = "Вы выиграли!";
        } else if (playerHand.score < dealerHand.score) {
            message = "Вы проиграли!";
        } else {
            message = "Ничья!";
        }
        gameStatus = message;
    }
    updateUI();
}

function updateUI() {
    dealerCardsEl.innerHTML = dealerHand.getCardsHTML();
    playerCardsEl.innerHTML = playerHand.getCardsHTML();
    dealerScoreEl.textContent = dealerHand.score;
    playerScoreEl.textContent = playerHand.score;
    gameStatusEl.textContent = gameStatus;
}

// Обработчики событий
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
dealButton.addEventListener("click", startGame);

// Инициализация (скрыть кнопки до начала игры)
hitButton.disabled = true;
standButton.disabled = true;

// Навигация по разделам
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function setActiveLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function handleScroll() {
    let currentSectionId = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const windowHeight = window.innerHeight;  // Высота окна браузера
        if (pageYOffset >= (sectionTop - windowHeight / 2) &&
            pageYOffset < (sectionTop + sectionHeight - windowHeight / 2)) {
            currentSectionId = section.id;
        }
    });
    setActiveLink(currentSectionId);
}

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

//  ... остальная часть JavaScript  ...//
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const rulesLink = document.getElementById('rules-link');
    const rulesPopup = document.getElementById('rules-popup');
    const closeButton = document.querySelector('.close-button');

    //  Функция для отображения комментария
    function displayComment(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const date = new Date(comment.id);
const formattedDate = date.toLocaleDateString(); //  Только дата

        commentDiv.innerHTML = `
    <div class="comment-author">${comment.name}</div>
    <div class="comment-text">${comment.comment}</div>
    <div class="comment-actions">
        <div class="likes-dislikes">
            <button class="like-button"><i class="fas fa-thumbs-up"></i> <span class="like-count">${comment.likes}</span></button>
            <button class="dislike-button"><i class="fas fa-thumbs-down"></i> <span class="dislike-count">${comment.dislikes}</span></button>
        </div>
        <div class="comment-date">${formattedDate}</div>  <!--  ДАТА ТУТ  -->
        <button class="report-button"><i class="fas fa-flag"></i> Пожаловаться</button>
    </div>
`;
    commentList.appendChild(commentDiv);

        //  Обработчики событий для кнопок (лайки, дизлайки, пожаловаться)
        const likeButton = commentDiv.querySelector('.like-button');
        const dislikeButton = commentDiv.querySelector('.dislike-button');
        const reportButton = commentDiv.querySelector('.report-button');
        const likeCountSpan = commentDiv.querySelector('.like-count');
        const dislikeCountSpan = commentDiv.querySelector('.dislike-count');

        likeButton.addEventListener('click', function() {
            likeComment(comment.id, likeCountSpan);
        });

        dislikeButton.addEventListener('click', function() {
            dislikeComment(comment.id, dislikeCountSpan);
        });

        reportButton.addEventListener('click', function() {
            reportComment(comment.id);
        });
    }

    //  Функции для обработки лайков, дизлайков и жалоб
    function likeComment(commentId, likeCountSpan) {
        comments = comments.map(comment => {
            if (comment.id === commentId) {
                comment.likes++;
                likeCountSpan.textContent = comment.likes;
            }
            return comment;
        });
        saveCommentsToLocalStorage(comments);
    }

    function dislikeComment(commentId, dislikeCountSpan) {
        comments = comments.map(comment => {
            if (comment.id === commentId) {
                comment.dislikes++;
                dislikeCountSpan.textContent = comment.dislikes;
            }
            return comment;
        });
        saveCommentsToLocalStorage(comments);
    }

    function reportComment(commentId) {
        comments = comments.map(comment => {
            if (comment.id === commentId) {
                comment.reported = true;
            }
            return comment;
        });
        saveCommentsToLocalStorage(comments);
        alert('Комментарий пожалован. Он будет отмечен в панели модерации.'); //  Показываем уведомление
    }

    //  Функция для получения комментариев из localStorage
    function getCommentsFromLocalStorage() {
        const comments = localStorage.getItem('comments');
        return comments ? JSON.parse(comments) : [];
    }

    //  Функция для сохранения комментариев в localStorage
    function saveCommentsToLocalStorage(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    //  Загрузка существующих комментариев из localStorage при загрузке страницы
    let comments = getCommentsFromLocalStorage();
    comments.forEach(comment => displayComment(comment));

    //  Обработчик отправки формы
    const commentText = document.getElementById('comment');    // Добавьте эти две строки
    const commentError = document.getElementById('comment-error'); // Добавьте эти две строки

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const commentTextValue = commentText.value; //  Получаем значение из textarea
        const agreement = document.getElementById('agreement').checked;
    
        //  Проверяем длину комментария!
        if (commentTextValue.length > 250) {  //  Проверяем длину комментария
            commentError.textContent = 'Комментарий не должен превышать 250 символов.'; // Выводим сообщение об ошибке
            return;                              // Прерываем отправку формы
        } else {
            commentError.textContent = '';  //  Очищаем сообщение об ошибке
        }
    
        if (!agreement) {
            alert('Пожалуйста, согласитесь с правилами платформы.');
            return;
        }
    
        const newComment = {
            id: Date.now(), //  Используем текущее время как ID (timestamp)
            name: name,
            comment: commentTextValue,
            likes: 0,
            dislikes: 0,
            reported: false //  Флаг "пожалован"
        };
    
        comments.push(newComment);
        saveCommentsToLocalStorage(comments);
        displayComment(newComment);
    
        commentForm.reset();
    });

    //  Обработчик для ссылки на правила
    rulesLink.addEventListener('click', function(event) {
        event.preventDefault();
        rulesPopup.classList.add('show'); //  Добавляем класс show для отображения с анимацией
        setTimeout(() => {
            document.querySelector(".popup-content").classList.add("show")
        }, 10)
    });

    //  Обработчик для кнопки закрытия popup
    closeButton.addEventListener('click', function() {
        document.querySelector(".popup-content").classList.remove("show")
        setTimeout(() => {
            rulesPopup.classList.remove('show'); //  Убираем класс show для скрытия с анимацией
        }, 300)
    });

    //  Закрытие popup при клике вне окна
    window.addEventListener('click', function(event) {
        if (event.target === rulesPopup) {
            document.querySelector(".popup-content").classList.remove("show")
            setTimeout(() => {
                rulesPopup.classList.remove('show'); // Скрываем popup
            }, 300)
        }
    });

    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    const animationButton = document.getElementById('animation-button');
    const animationIcon = animationButton.querySelector('i');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationEnabled = true;
    let icons = []; //  Переименовали circles в icons

    // Список иконок, используйте HTML-сущности или Font Awesome (нужно подключение Font Awesome)
    const iconList = ['P (A) = m / n', ' ∫ f(x) dx', '∑ i=1', 'S = π * r^2'];
    const font = '24px FontAwesome'; //  Шрифт для иконок FontAwesome. Укажите нужный шрифт

    function Icon(x, y, icon, color, speedX, speedY) { //  Переименовали Circle в Icon
        this.x = x;
        this.y = y;
        this.icon = icon;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;

        this.draw = function() {
            ctx.font = font;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.icon, this.x, this.y);
        }

        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Отражение от стенок
            if (this.x + ctx.measureText(this.icon).width / 2 > canvas.width || this.x - ctx.measureText(this.icon).width / 2 < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y + 12 > canvas.height || this.y - 12 < 0) {
                this.speedY = -this.speedY;
            }
            this.draw();
        }
    }

    function init() {
        icons = [];  //  Переименовали circles в icons
        const numberOfIcons = 10; //  Количество иконок
        for (let i = 0; i < numberOfIcons; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const icon = iconList[Math.floor(Math.random() * iconList.length)];  //  Случайная иконка из списка
            const color = 'rgba(255, 255, 255, 0.05)'; //  Белый полупрозрачный
            const speedX = (Math.random() - 0.5) * 1.5;
            const speedY = (Math.random() - 0.5) * 1.5;
            icons.push(new Icon(x, y, icon, color, speedX, speedY));  //  Переименовали Circle в Icon
        }
    }

    function animate() {
        if (animationEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < icons.length; i++) {  //  Переименовали circles в icons
                icons[i].update();  //  Переименовали circles в icons
            }
            requestAnimationFrame(animate);
        }
    }

    animationButton.addEventListener('click', function() {
        animationEnabled = !animationEnabled;
        if (animationEnabled) {
            animationIcon.classList.remove('fa-pause');
            animationIcon.classList.add('fa-play');
            animate();
        } else {
            animationIcon.classList.remove('fa-play');
            animationIcon.classList.add('fa-pause');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); //  Переинициализируем иконки при изменении размера окна
    });

    init();
    animate();
});