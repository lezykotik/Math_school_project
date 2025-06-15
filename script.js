document.addEventListener('DOMContentLoaded', function() {
    // Получение элементов (оставлены без изменений)
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    const animationButton = document.getElementById('animation-button');
    const animationIcon = animationButton.querySelector('i');
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const rulesLink = document.getElementById('rules-link');
    const rulesPopup = document.getElementById('rules-popup');
    const closeButton = document.querySelector('.close-button');
    const commentText = document.getElementById('comment');
    const commentName = document.getElementById('name');
    const commentError = document.getElementById('comment-error');

    // Цвета для Canvas (оставлены без изменений)
    const darkThemeIconColor = 'rgba(255, 255, 255, 0.1)'; // Белый для темной темы
    const lightThemeIconColor = 'rgba(0, 0, 0, 0.1)';     // Черный для светлой темы

    const lastCommentTimeKey = 'lastCommentTime';
    const minInterval = 10000; //  Минимальный интервал между комментариями (10 секунд)
    const minNameLength = 3;    //  Минимальная длина имени
    const minCommentLength = 5; //  Минимальная длина комментария
    const forbiddenSymbols = /[<>]/; //  Запрещенные символы (пример: < и >)
    const onlyNumbers = /^[0-9]+$/; // Регулярное выражение для проверки, что строка состоит только из цифр

    let animationFrame; // Объявляем animationFrame здесь
    let animationEnabled = true;
    let icons = [];
    const iconList = ['P (A) = m / n', ' ∫ f(x) dx', '∑ i=1', 'S = π * r^2'];
    const font = '24px FontAwesome';
    let currentIconColor = darkThemeIconColor; // Изначальный цвет - для темной теме

    // Проверяем сохраненную тему при загрузке страницы (оставлено без изменений)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
        body.classList.add('light-theme');
        currentIconColor = lightThemeIconColor; // Устанавливаем цвет для светлой темы
    }

    // *******************************************************************
    // Интеграция alert() после 10 переключений темы (ТОЛЬКО НА ДЕСКТОПЕ)
    let themeSwitchCount = 0;

    // Используем matchMedia для определения мобильных устройств
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

    // Функция для переключения темы (изменено)
    themeSwitch.addEventListener('change', function(e) {
        themeSwitchCount++; // Увеличиваем счетчик переключений темы

        if (e.target.checked) {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            currentIconColor = lightThemeIconColor;
        } else {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            currentIconColor = darkThemeIconColor;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas
        init();
        animate();

        // Проверяем, достигло ли количество переключений темы 10 и является ли устройство десктопным
        if (themeSwitchCount === 10 && !isMobile) {
            //  Показываем alert
            alert("Молодец, ты нашел баг!");

            // Отключаем переключатель темы (или делаем что-то еще, чтобы баг нельзя было повторить)
            themeSwitch.disabled = true;
        }
    });
    // *******************************************************************

    // Функция для переключения анимации (оставлено без изменений)
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

    // Canvas Matrix Effect by Erik Terwan (оставлено без изменений)
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function Icon(x, y, icon, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.icon = icon;
        this.speedX = speedX;
        this.speedY = speedY;

        this.draw = function() {
            ctx.font = font;
            ctx.fillStyle = currentIconColor; // Используем переменную currentIconColor
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.icon, this.x, this.y);
        }

        this.update = function() {
            this.x += this.speedX;
            this.y += this.speedY;

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
        icons = [];
        const numberOfIcons = 15;
        for (let i = 0; i < numberOfIcons; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const icon = iconList[Math.floor(Math.random() * iconList.length)];
            const speedX = (Math.random() - 0.5) * 2;
            const speedY = (Math.random() - 0.5) * 2;
            icons.push(new Icon(x, y, icon, speedX, speedY)); // Устанавливаем цвет при создании
        }
    }

    function animate() {
        if (animationEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < icons.length; i++) {
                icons[i].update();
            }
            animationFrame = requestAnimationFrame(animate);
        }
    }

    init();
    animate();

    // Функция для переключения темы
    themeSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            currentIconColor = lightThemeIconColor;
        } else {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            currentIconColor = darkThemeIconColor;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas
        init();
        animate();
    });

    // Блэкджек

    // Объект для представления карты
    function Card(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    Card.prototype.value = function() {
        if (["J", "Q", "K"].includes(this.rank)) return 10;
        if (this.rank === "A") return 11;
        return parseInt(this.rank, 10);
    };

    Card.prototype.display = function() {
        return this.rank + this.suit.slice(0, 1);
    };

    Card.prototype.getCardName = function() {
        const suitSymbols = {
            "Hearts": "♥",
            "Diamonds": "♦",
            "Clubs": "♣",
            "Spades": "♠"
        };
        return this.rank + (suitSymbols[this.suit] || '');
    };

    // Объект для представления колоды
    function Deck() {
        this.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
        this.ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        this.cards = [];
    }

    Deck.prototype.createDeck = function() {
        this.cards = []; // Очищаем колоду перед созданием
        for (const suit of this.suits) {
            for (const rank of this.ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
    };

    Deck.prototype.shuffleDeck = function() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    };

    Deck.prototype.dealCard = function() {
        return this.cards.pop();
    };

    // Объект для представления руки
    function Hand() {
        this.cards = [];
        this.score = 0;
        this.aces = 0;
    }

    Hand.prototype.addCard = function(card) {
        this.cards.push(card);
        this.score += card.value();
        if (card.rank === "A") {
            this.aces++;
        }
        this.adjustForAces();
    };

    Hand.prototype.adjustForAces = function() {
        while (this.score > 21 && this.aces > 0) {
            this.score -= 10;
            this.aces--;
        }
    };

    Hand.prototype.getDisplay = function() {
        return this.cards.map(card => card.display()).join(" ");
    };

    Hand.prototype.getCardsHTML = function() {
        return this.cards.map(card => `<div class="card">${card.getCardName()}</div>`).join("");
    };

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
        while (dealerHand.score < 17 && gameStatus === "") {
            dealerHand.addCard(deck.dealCard());
            updateUI(); //  Обновляем UI каждый раз, когда дилер берет карту
            if (dealerHand.score > 21) {
                gameStatus = "Дилер перебрал! Вы выиграли!";
                break;
            }
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

        if (gameStatus === "") {
            if (playerHand.score > 21) {
                gameStatus = "Вы проиграли! Перебор!";
            } else if (dealerHand.score > 21) {
                gameStatus = "Вы выиграли! Дилер перебрал!";
            } else if (playerHand.score > dealerHand.score) {
                gameStatus = "Вы выиграли!";
            } else if (playerHand.score < dealerHand.score) {
                gameStatus = "Вы проиграли!";
            } else {
                gameStatus = "Ничья!";
            }
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
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function handleScroll() {
        let currentSectionId = '';
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            //  Центр экрана находится в пределах секции
            if (pageYOffset >= (sectionTop - windowHeight / 2) && pageYOffset < (sectionTop + sectionHeight - windowHeight / 2)) {
                currentSectionId = section.id;
            }
        });
        setActiveLink(currentSectionId);
    }

    function scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);

    // Комментарии
    function revealSections() {
        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            const windowHeight = window.innerHeight;
            const elementTop = section.getBoundingClientRect().top;
            const elementVisible = 150; //  Высота видимости до добавления класса

            if (elementTop < windowHeight - elementVisible) {
                section.classList.add('show');
            } else {
                section.classList.remove('show');
            }
        });
    }

    window.addEventListener('scroll', revealSections);
    revealSections();

    // Функция для отображения комментария
    function displayComment(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const date = new Date(comment.id);
        const formattedDate = date.toLocaleDateString();

        commentDiv.innerHTML = `
            <div class="comment-author">${escapeHTML(comment.name)}</div>
            <div class="comment-text">${escapeHTML(comment.comment)}</div>
            <div class="comment-actions">
                <div class="likes-dislikes">
                    <button class="like-button"><i class="fas fa-thumbs-up"></i> <span class="like-count">${comment.likes}</span></button>
                    <button class="dislike-button"><i class="fas fa-thumbs-down"></i> <span class="dislike-count">${comment.dislikes}</span></button>
                </div>
                <div class="comment-date">${formattedDate}</div>
                <button class="report-button" data-comment-id="${comment.id}"><i class="fas fa-flag"></i> Пожаловаться</button>
            </div>
        `;
        commentList.appendChild(commentDiv);

        // Обработчики событий (делегирование)
    }

    // Функция для экранирования HTML
    function escapeHTML(string) {
        let p = document.createElement("p");
        p.appendChild(document.createTextNode(string));
        return p.innerHTML;
    }

    // Делегирование событий для кнопок лайков, дизлайков и жалоб
    commentList.addEventListener('click', function(event) {
        const target = event.target;
        const commentDiv = target.closest('.comment'); //  Находим ближайшего родителя с классом 'comment'
        if (!commentDiv) return;  //  Если не нашли, выходим

        const commentId = parseInt(commentDiv.querySelector('.report-button').dataset.commentId, 10);
        const likeCountSpan = commentDiv.querySelector('.like-count');
        const dislikeCountSpan = commentDiv.querySelector('.dislike-count');

        if (target.closest('.like-button')) {
            likeComment(commentId, likeCountSpan);
        } else if (target.closest('.dislike-button')) {
            dislikeComment(commentId, dislikeCountSpan);
        } else if (target.closest('.report-button')) {
            reportComment(commentId);
        }
    });

    // Функции для обработки лайков, дизлайков и жалоб
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
        alert('Комментарий пожалован. Он будет отмечен в панели модерации.');
    }

    // Функции для работы с localStorage
    function getCommentsFromLocalStorage() {
        try {
            const comments = localStorage.getItem('comments');
            return comments ? JSON.parse(comments) : [];
        } catch (e) {
            console.error("Ошибка при чтении из localStorage:", e);
            return [];
        }
    }

    function saveCommentsToLocalStorage(comments) {
        try {
            localStorage.setItem('comments', JSON.stringify(comments));
        } catch (e) {
            console.error("Ошибка при записи в localStorage:", e);
        }
    }

    // Загрузка и отображение комментариев
    let comments = getCommentsFromLocalStorage();
    comments.forEach(comment => displayComment(comment));

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        //  Проверяем время последней отправки
        const lastCommentTime = localStorage.getItem(lastCommentTimeKey);
        const now = Date.now();

        if (lastCommentTime && (now - lastCommentTime < minInterval)) {
            const timeLeft = (minInterval - (now - lastCommentTime)) / 1000;
            alert(`Пожалуйста, подождите ${timeLeft.toFixed(1)} секунд, прежде чем отправлять новый комментарий.`);
            return;
        }

        const nameValue = commentName.value;
        const commentTextValue = commentText.value;
        const agreement = document.getElementById('agreement').checked;

        //  Проверяем длину имени
        if (nameValue.length < minNameLength) {
            commentError.textContent = `Имя должно содержать не менее ${minNameLength} символов.`;
            return;
        }

         //  Проверяем, что имя не состоит только из цифр
        if (onlyNumbers.test(nameValue)) {
            commentError.textContent = 'Имя не может состоять только из цифр.';
            return;
        }

        //  Проверяем длину комментария
        if (commentTextValue.length < minCommentLength) {
            commentError.textContent = `Комментарий должен содержать не менее ${minCommentLength} символов.`;
            return;
        }

        //  Проверяем, что комментарий не состоит только из цифр
        if (onlyNumbers.test(commentTextValue)) {
            commentError.textContent = 'Комментарий не может состоять только из цифр.';
            return;
        }

         //  Проверяем запрещенные символы в имени
        if (forbiddenSymbols.test(nameValue)) {
            commentError.textContent = 'Имя содержит недопустимые символы.';
            return;
        }

        //  Проверяем запрещенные символы в комментарии
        if (forbiddenSymbols.test(commentTextValue)) {
            commentError.textContent = 'Комментарий содержит недопустимые символы.';
            return;
        }

        if (commentTextValue.length > 250) {
            commentError.textContent = 'Комментарий не должен превышать 250 символов.';
            return;
        } else {
            commentError.textContent = '';
        }

        if (!agreement) {
            alert('Пожалуйста, согласитесь с правилами платформы.');
            return;
        }

        const newComment = {
            id: Date.now(),
            name: nameValue,
            comment: commentTextValue,
            likes: 0,
            dislikes: 0,
            reported: false
        };

        comments.push(newComment);
        saveCommentsToLocalStorage(comments);
        displayComment(newComment);

        commentForm.reset();

        //  Сохраняем время последней отправки
        localStorage.setItem(lastCommentTimeKey, now);
    });

    // Popup для правил
    rulesLink.addEventListener('click', function(event) {
        event.preventDefault();
        rulesPopup.classList.add('show');
        setTimeout(() => {
            document.querySelector(".popup-content").classList.add("show")
        }, 10)
    });

    closeButton.addEventListener('click', function() {
        document.querySelector(".popup-content").classList.remove("show")
        setTimeout(() => {
            rulesPopup.classList.remove('show');
        }, 300)
    });

    window.addEventListener('click', function(event) {
        if (event.target === rulesPopup) {
            document.querySelector(".popup-content").classList.remove("show")
            setTimeout(() => {
                rulesPopup.classList.remove('show');
            }, 300)
        }
    });
         // Функция для броска кубика
    function rollDice() { // Убрали window, делаем ее локальной
        const guessInput = document.getElementById('guess');
        const resultDiv = document.getElementById('result');
        const guess = parseInt(guessInput.value, 10);

        if (isNaN(guess) || guess < 1 || guess > 6) {
            resultDiv.textContent = 'Пожалуйста, введите число от 1 до 6.';
            return;
        }

        const roll = Math.floor(Math.random() * 6) + 1;

        if (guess === roll) {
            resultDiv.textContent = `Вы угадали! Выпало число ${roll}.`;
        } else {
            resultDiv.textContent = `Не угадали. Выпало число ${roll}.`;
        }
    }

    //  Устанавливаем функцию как listener
    const rollDiceButton = document.getElementById("rollDiceButton"); // Добавляем обработчик событий
    rollDiceButton.addEventListener("click", rollDice);

    

    //  Генерация и установка CSRF-токена
    function generateCSRFToken() {
        const randomBytes = new Uint8Array(32);
        window.crypto.getRandomValues(randomBytes);
        return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    const csrfToken = generateCSRFToken();
    document.getElementById('csrf_token').value = csrfToken;  //  Установка токена в поле формы
    localStorage.setItem('csrfToken', csrfToken);  // Сохранение токена в localStorage

    //  Подтверждение CSRF-токена перед отправкой формы (очень простая имитация)
    commentForm.addEventListener('submit', function (event) {
        const storedToken = localStorage.getItem('csrfToken');
        const submittedToken = document.getElementById('csrf_token').value;

        if (submittedToken !== storedToken) {
            event.preventDefault();  //  Предотвращаем отправку формы
            alert('Ошибка безопасности: Неверный CSRF-токен!');
        }
    });

    // Атрибуты rel="noopener noreferrer" для всех внешних ссылок
    const links = document.querySelectorAll('a[href^="http"]'); // Находим все ссылки, начинающиеся с "http"
    links.forEach(link => {
        if (link.hostname !== window.location.hostname) { // Проверяем, что это внешняя ссылка
            link.rel = 'noopener noreferrer';
        }
    });
});