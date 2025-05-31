document.addEventListener('DOMContentLoaded', function() {
    const moderationList = document.getElementById('moderation-list');

    //  Функция для получения комментариев из localStorage
    function getCommentsFromLocalStorage() {
        const comments = localStorage.getItem('comments');
        return comments ? JSON.parse(comments) : [];
    }

    //  Функция для сохранения комментариев в localStorage
    function saveCommentsToLocalStorage(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    //  Загрузка комментариев из localStorage при загрузке страницы
    let comments = getCommentsFromLocalStorage();
    displayCommentsForModeration(comments);

    function displayCommentsForModeration(comments) {
        moderationList.innerHTML = ''; //  Очищаем список
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            if (comment.reported) {
                commentDiv.classList.add('reported'); //  Добавляем класс "reported"
            }
            commentDiv.innerHTML = `
                <div class="comment-author">${comment.name}</div>
                <div class="comment-text">${comment.comment}</div>
                <button class="approve-button" data-id="${comment.id}">Одобрить</button>
                <button class="delete-button" data-id="${comment.id}">Удалить</button>
            `;
            moderationList.appendChild(commentDiv);

            //  Привязка обработчиков событий для кнопок после добавления комментария
            const approveButton = commentDiv.querySelector('.approve-button');
            const deleteButton = commentDiv.querySelector('.delete-button');

            if (approveButton) { // Проверка на существование кнопки
                approveButton.addEventListener('click', function() {
                    const commentId = parseInt(this.dataset.id);
                    approveComment(commentId);
                });
            }

            if (deleteButton) { // Проверка на существование кнопки
                deleteButton.addEventListener('click', function() {
                    const commentId = parseInt(this.dataset.id);
                    if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
                        deleteComment(commentId);
                    }
                });
            }
        });
    }

    function approveComment(commentId) {
        comments = comments.map(comment => {
            if (comment.id === commentId) {
                comment.reported = false; // Убираем флаг "пожалован"
            }
            return comment;
        });
        saveCommentsToLocalStorage(comments);
        displayCommentsForModeration(comments); // Перерисовываем список
    }

    function deleteComment(commentId) {
        if (confirm('Вы уверены, что хотите удалить этот комментарий?')) {
            comments = comments.filter(comment => comment.id !== commentId);
            saveCommentsToLocalStorage(comments);
            displayCommentsForModeration(comments); // Перерисовываем список
        }
    }
});

