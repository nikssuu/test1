// Функція для отримання назви поточної сторінки
function getCurrentPageName() {
    const path = window.location.pathname;
    // Повертаємо назву файлу, або порожній рядок, якщо це кореневий URL (наприклад, /test/)
    return path.substring(path.lastIndexOf('/') + 1);
}

// Дані про правильні відповіді для кожної кінематичної пари
// Зібрано на основі наданих вами зображень таблиць
// 'imageName' повинно відповідати імені файлу зображення (наприклад, '1.jpg', '8.jpg')
const KINEMATIC_PAIRS_DATA = [
    {
        imageName: "1.jpg", // Сфера на вигнутій поверхні (image_bd9058.png)
        q1_translation: "Ox, Oy, Oz",
        q2_rotation: "Жодної",
        q3_impossible_moves: "3",
        q4_class: "III",
        q5_type: "Нижча"
    },
    {
        imageName: "2.jpg", // Штифт у пазу (image_bd9079.png, рядок 4)
        q1_translation: "Ox, Oy, Oz",
        q2_rotation: "Oy, Oz",
        q3_impossible_moves: "5",
        q4_class: "V",
        q5_type: "Нижча"
    },
    {
        imageName: "3.jpg", // Гвинтове з'єднання (image_bd9079.png, рядок 1)
        q1_translation: "Ox, Oy",
        q2_rotation: "Ox, Oy, Oz",
        q3_impossible_moves: "5",
        q4_class: "V",
        q5_type: "Нижча"
    },
    {
        imageName: "4.jpg", // Циліндричне з'єднання (image_bd9079.png, рядок 2)
        q1_translation: "Ox, Oy",
        q2_rotation: "Ox, 0y",
        q3_impossible_moves: "5",
        q4_class: "V",
        q5_type: "Нижча"
    },
    {
        imageName: "5.jpg", // Сферичне (шарнірне) з'єднання (image_bd933a.png, рядок 1)
        q1_translation: "Oy, Oz",
        q2_rotation: "Oy, Oz",
        q3_impossible_moves: "4",
        q4_class: "IV",
        q5_type: "Нижча"
    },
    {
        imageName: "6.jpg", // Штифт у циліндричному отворі з осьовим рухом (image_bd933a.png, рядок 2)
        q1_translation: "Oz",
        q2_rotation: "Ox, Oy",
        q3_impossible_moves: "3",
        q4_class: "III",
        q5_type: "Нижча"
    },
    {
        imageName: "7.jpg", // Приклад для 9-го зображення (припустимо, це простий обертовий шарнір, якщо він не представлений в таблицях)
        q1_translation: "Ox, Oy",
        q2_rotation: "Жодної",
        q3_impossible_moves: "2",
        q4_class: "II",
        q5_type: "Вища"
    },
    {
        imageName: "8.jpg", // Блок на блоці (площинне) (image_bd9079.png, рядок 3)
        q1_translation: "Oz",
        q2_rotation: "Жодної",
        q3_impossible_moves: "1",
        q4_class: "I",
        q5_type: "Вища"
    },
];

document.addEventListener('DOMContentLoaded', () => {
    const currentPage = getCurrentPageName();

    // --- Логіка навігації сторінками ---

    // Обробка кнопки "Розпочати" на index.html
    if (currentPage === 'index.html' || currentPage === '') { // Додано || currentPage === '' для коректної роботи на GitHub Pages (коли URL закінчується на /test/)
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', (event) => { // Додано 'event'
                event.preventDefault(); // Запобігаємо стандартній поведінці кнопки (наприклад, якщо вона всередині форми)
                const userName = document.getElementById('userName').value;
                if (userName) {
                    localStorage.setItem('userName', userName);
                    localStorage.removeItem('testStartTime');
                    localStorage.removeItem('testEndTime');
                    localStorage.removeItem('selectedImages');
                    localStorage.removeItem('finalScore'); // Очистити рахунок для нового тесту
                    localStorage.removeItem('remainingAttempts'); // Очистити спроби для нового тесту
                    window.location.href = 'page2.html';
                } else {
                    alert('Будь ласка, введіть ваше ім\'я.');
                }
            });
        }
    }

    const prevButton = document.querySelector('.nav-button.gray');
    const nextButton = document.querySelector('.nav-button.blue');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage === 'page2.html') {
                window.location.href = 'index.html';
            } else if (currentPage === 'page3.html') {
                window.location.href = 'page2.html';
            } else if (currentPage === 'page4.html') {
                window.location.href = 'page3.html';
            } else if (currentPage === 'page5.html') {
                window.location.href = 'page4.html';
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentPage === 'page2.html') {
                if (!localStorage.getItem('testStartTime')) {
                    localStorage.setItem('testStartTime', new Date().getTime());
                }
                window.location.href = 'page3.html';
            } else if (currentPage === 'page3.html') {
                window.location.href = 'page4.html';
            } else if (currentPage === 'page4.html') {
                // Час завершення тестування встановлюється при натисканні "ПЕРЕВІРИТИ" (останній раз)
                window.location.href = 'page5.html';
            } else if (currentPage === 'page5.html') {
                localStorage.removeItem('userName');
                localStorage.removeItem('testStartTime');
                localStorage.removeItem('testEndTime');
                localStorage.removeItem('selectedImages');
                localStorage.removeItem('finalScore');
                localStorage.removeItem('remainingAttempts');
                window.location.href = 'index.html';
            }
        });
    }

    // --- Функціонал таймера та відображення балів для page5.html ---
    if (currentPage === 'page5.html') {
        const startTimeElement = document.getElementById('startTime');
        const endTimeElement = document.getElementById('endTime');
        const executionTimeElement = document.getElementById('executionTime');
        const finalScoreElement = document.getElementById('finalScore');

        const startTime = localStorage.getItem('testStartTime');
        const endTime = localStorage.getItem('testEndTime');
        const finalScore = localStorage.getItem('finalScore');

        if (startTime && endTime) {
            const startDate = new Date(parseInt(startTime));
            const endDate = new Date(parseInt(endTime));

            startTimeElement.textContent = startDate.toLocaleTimeString('uk-UA');
            endTimeElement.textContent = endDate.toLocaleTimeString('uk-UA');

            const executionTimeSeconds = Math.round((endDate - startDate) / 1000);
            executionTimeElement.textContent = `${executionTimeSeconds} сек.`;
        } else {
            startTimeElement.textContent = '--:--:--';
            endTimeElement.textContent = '--:--:--';
            executionTimeElement.textContent = '-- сек.';
        }

        if (finalScore !== null) {
            finalScoreElement.textContent = finalScore;
        } else {
            finalScoreElement.textContent = '0';
        }
    }

    // --- Логіка вибору осей (Клік замість Drag-and-Drop) та Рандомізація зображень, Перевірка відповідей для page4.html ---
    if (currentPage === 'page4.html') {
        // --- Рандомізація зображень ---
        const imageElements = document.querySelectorAll('.question-image');
        let selectedImages = JSON.parse(localStorage.getItem('selectedImages'));

        if (!selectedImages) {
            const allImageNames = KINEMATIC_PAIRS_DATA.map(pair => pair.imageName); // Використовуємо всі доступні зображення з даних
            selectedImages = [];
            while (selectedImages.length < 2) {
                const randomIndex = Math.floor(Math.random() * allImageNames.length);
                const randomImage = allImageNames[randomIndex];
                if (!selectedImages.includes(randomImage)) {
                    selectedImages.push(randomImage);
                }
            }
            localStorage.setItem('selectedImages', JSON.stringify(selectedImages));
        }

        imageElements.forEach((img, index) => {
            if (selectedImages[index]) {
                img.src = `images/${selectedImages[index]}`;
            }
        });

        // --- Допоміжна функція для очищення візуального зворотного зв'язку ---
        function clearFeedback(element) {
            if (element) {
                element.classList.remove('correct-answer', 'incorrect-answer');
            }
        }

        // --- Логіка вибору осей кліками ---
        const axisButtons = document.querySelectorAll('.axis-button');
        const questionInputs = document.querySelectorAll('.question-input'); // Отримуємо всі поля вводу

        axisButtons.forEach(button => {
            button.addEventListener('click', () => {
                const inputValue = button.dataset.value;
                const inputField = button.closest('.input-and-choices').querySelector('.question-input');
                const acceptsMultiple = inputField.dataset.acceptMultiple === 'true';

                let currentValues = inputField.value.split(', ').filter(val => val !== ''); // Отримуємо поточні значення як масив

                if (acceptsMultiple) {
                    if (currentValues.includes(inputValue)) {
                        currentValues = currentValues.filter(val => val !== inputValue);
                    } else {
                        currentValues.push(inputValue);
                    }
                } else {
                    // Якщо приймає лише одне значення
                    if (currentValues.includes(inputValue)) {
                        currentValues = [];
                    } else {
                        const prevSelectedButton = button.closest('.axis-buttons').querySelector('.axis-button.in-input-field');
                        if (prevSelectedButton) {
                            prevSelectedButton.classList.remove('in-input-field');
                        }
                        currentValues = [inputValue];
                    }
                }

                // Оновлюємо значення поля введення (сортуємо для консистентності)
                inputField.value = currentValues.sort().join(', ');

                // Оновлюємо візуальний стан кнопок у цій групі
                const currentAxisButtonsInGroup = button.closest('.axis-buttons').querySelectorAll('.axis-button');
                currentAxisButtonsInGroup.forEach(btn => {
                    if (currentValues.includes(btn.dataset.value)) {
                        btn.classList.add('in-input-field');
                    } else {
                        btn.classList.remove('in-input-field');
                    }
                });

                clearFeedback(inputField); // Очищаємо зворотний зв'язок при зміні відповіді
            });
        });

        // При завантаженні сторінки відновлюємо візуальний стан кнопок та полів
        questionInputs.forEach(inputField => {
            if (inputField.value) {
                const savedValues = inputField.value.split(', ').filter(val => val !== '');
                const parentAxisButtons = inputField.closest('.input-and-choices').querySelectorAll('.axis-button');
                parentAxisButtons.forEach(button => {
                    if (savedValues.includes(button.dataset.value)) {
                        button.classList.add('in-input-field');
                    }
                });
            }
        });


        // --- Налаштування та логіка випадаючих списків ---
        const dropdownOptions = {
            q3: ["1", "2", "3", "4", "5", "6"],
            q4: ["I", "II", "III", "IV", "V"],
            q5: ["Нижча", "Вища"]
        };

        document.querySelectorAll('.dropdown-buttons-group').forEach(group => {
            group.querySelectorAll('.dropdown-button').forEach(button => {
                const qType = button.dataset.qtype;
                const options = dropdownOptions[qType];

                let dropdownList = document.createElement('ul');
                dropdownList.classList.add('dropdown-list');
                dropdownList.style.display = 'none'; // Спочатку приховано
                dropdownList.style.position = 'absolute';
                dropdownList.style.backgroundColor = '#fff';
                dropdownList.style.border = '1px solid #ccc';
                dropdownList.style.zIndex = '100';
                dropdownList.style.listStyle = 'none';
                dropdownList.style.padding = '5px 0';
                dropdownList.style.margin = '0';
                dropdownList.style.borderRadius = '4px';
                dropdownList.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                dropdownList.style.minWidth = 'max-content';
                dropdownList.style.textAlign = 'left';

                options.forEach(option => {
                    let listItem = document.createElement('li');
                    listItem.textContent = option;
                    listItem.style.padding = '8px 15px';
                    listItem.style.cursor = 'pointer';
                    listItem.style.whiteSpace = 'nowrap';
                    listItem.addEventListener('mouseover', () => listItem.style.backgroundColor = '#f0f0f0');
                    listItem.addEventListener('mouseout', () => listItem.style.backgroundColor = '');
                    listItem.addEventListener('click', (e) => {
                        e.stopPropagation(); // Запобігти закриттю кнопки одразу
                        button.textContent = option;
                        button.dataset.value = option; // Зберігаємо вибране значення в data-атрибуті
                        button.classList.remove('active');
                        dropdownList.style.display = 'none';
                        clearFeedback(button); // Очищаємо зворотний зв'язок при зміні відповіді
                    });
                    dropdownList.appendChild(listItem);
                });

                button.parentNode.style.position = 'relative';
                button.parentNode.appendChild(dropdownList);

                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.dropdown-list').forEach(list => list.style.display = 'none');
                    document.querySelectorAll('.dropdown-button').forEach(btn => btn.classList.remove('active'));

                    const isActive = dropdownList.style.display === 'block';
                    dropdownList.style.display = isActive ? 'none' : 'block';
                    button.classList.toggle('active', !isActive);

                    const rect = button.getBoundingClientRect();
                    dropdownList.style.top = `${rect.height + 5}px`;
                    dropdownList.style.left = `0`;
                    dropdownList.style.width = `${rect.width}px`;
                });

                document.addEventListener('click', (e) => {
                    if (!button.contains(e.target) && !dropdownList.contains(e.target)) {
                        dropdownList.style.display = 'none';
                        button.classList.remove('active');
                    }
                });

                // Відновити значення кнопки, якщо воно було збережено
                // Тут можна додати логіку для завантаження збережених відповідей, якщо потрібно
                // Наприклад, з localStorage
                if (button.dataset.value) {
                    button.textContent = button.dataset.value;
                } else {
                    if (qType === 'q3') button.textContent = 'Оберіть кількість';
                    else if (qType === 'q4') button.textContent = 'Оберіть клас';
                    else if (qType === 'q5') button.textContent = 'Оберіть тип';
                }
            });
        });


        // --- Логіка перевірки відповідей та підрахунку балів ---
        let remainingAttempts = localStorage.getItem('remainingAttempts');
        if (remainingAttempts === null || isNaN(remainingAttempts)) {
            remainingAttempts = 3; // Початкова кількість спроб
        } else {
            remainingAttempts = parseInt(remainingAttempts);
        }

        const checkButton = document.querySelector('.check-button');
        if (checkButton) {
            // Оновлення тексту кнопки при завантаженні сторінки
            if (remainingAttempts > 0) {
                checkButton.textContent = `ПЕРЕВІРИТИ (${remainingAttempts} спроб)`;
            } else {
                checkButton.textContent = 'ПЕРЕЙТИ ДО РЕЗУЛЬТАТІВ';
                // Можна відключити поля введення та випадаючі списки тут, якщо спроб більше немає
            }

            checkButton.addEventListener('click', () => {
                const selectedImagesData = selectedImages.map(imgName => KINEMATIC_PAIRS_DATA.find(data => data.imageName === imgName));

                // Допоміжна функція для порівняння відповідей (для осей)
                const compareAxisAnswers = (userAnsString, correctAnsString) => {
                    const userArray = userAnsString.split(', ').filter(Boolean).sort();
                    const correctArray = correctAnsString.split(', ').filter(Boolean).sort();
                    return userArray.length === correctArray.length &&
                           userArray.every((val, index) => val === correctArray[index]);
                };

                // Функція для застосування візуального зворотного зв'язку
                const applyFeedback = (element, isCorrect) => {
                    clearFeedback(element);
                    if (isCorrect) {
                        element.classList.add('correct-answer');
                    } else {
                        element.classList.add('incorrect-answer');
                    }
                };

                // Якщо спроб більше немає, переходимо на сторінку результатів
                if (remainingAttempts <= 0) {
                    let totalFinalScore = 0;
                    if (selectedImagesData.length === 2) {
                        const image1Data = selectedImagesData[0];
                        const image2Data = selectedImagesData[1];

                        // Остання перевірка всіх відповідей перед переходом
                        if (compareAxisAnswers(document.getElementById('q1_ans1').value, image1Data.q1_translation)) totalFinalScore++;
                        if (compareAxisAnswers(document.getElementById('q2_ans1').value, image1Data.q2_rotation)) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q3"]')[0].dataset.value === image1Data.q3_impossible_moves) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q4"]')[0].dataset.value === image1Data.q4_class) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q5"]')[0].dataset.value === image1Data.q5_type) totalFinalScore++;

                        if (compareAxisAnswers(document.getElementById('q1_ans2').value, image2Data.q1_translation)) totalFinalScore++;
                        if (compareAxisAnswers(document.getElementById('q2_ans2').value, image2Data.q2_rotation)) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q3"]')[1].dataset.value === image2Data.q3_impossible_moves) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q4"]')[1].dataset.value === image2Data.q4_class) totalFinalScore++;
                        if (document.querySelectorAll('[data-qtype="q5"]')[1].dataset.value === image2Data.q5_type) totalFinalScore++;
                    }
                    localStorage.setItem('finalScore', totalFinalScore);
                    localStorage.setItem('testEndTime', new Date().getTime());
                    localStorage.removeItem('remainingAttempts'); // Скидаємо спроби для наступного тесту
                    window.location.href = 'page5.html';
                    return; // Виходимо з функції
                }

                // --- Виконуємо перевірку для поточної спроби ---
                if (selectedImagesData.length === 2) {
                    const image1Data = selectedImagesData[0];
                    const image2Data = selectedImagesData[1];

                    // Відповіді для Зображення 1
                    const userQ1Ans1 = document.getElementById('q1_ans1');
                    const userQ2Ans1 = document.getElementById('q2_ans1');
                    const userQ3Btn1 = document.querySelectorAll('[data-qtype="q3"]')[0];
                    const userQ4Btn1 = document.querySelectorAll('[data-qtype="q4"]')[0];
                    const userQ5Btn1 = document.querySelectorAll('[data-qtype="q5"]')[0];

                    // Застосовуємо зворотний зв'язок для Зображення 1
                    applyFeedback(userQ1Ans1, compareAxisAnswers(userQ1Ans1.value, image1Data.q1_translation));
                    applyFeedback(userQ2Ans1, compareAxisAnswers(userQ2Ans1.value, image1Data.q2_rotation));
                    applyFeedback(userQ3Btn1, userQ3Btn1.dataset.value === image1Data.q3_impossible_moves);
                    applyFeedback(userQ4Btn1, userQ4Btn1.dataset.value === image1Data.q4_class);
                    applyFeedback(userQ5Btn1, userQ5Btn1.dataset.value === image1Data.q5_type);

                    // Відповіді для Зображення 2
                    const userQ1Ans2 = document.getElementById('q1_ans2');
                    const userQ2Ans2 = document.getElementById('q2_ans2');
                    const userQ3Btn2 = document.querySelectorAll('[data-qtype="q3"]')[1];
                    const userQ4Btn2 = document.querySelectorAll('[data-qtype="q4"]')[1];
                    const userQ5Btn2 = document.querySelectorAll('[data-qtype="q5"]')[1];

                    // Застосовуємо зворотний зв'язок для Зображення 2
                    applyFeedback(userQ1Ans2, compareAxisAnswers(userQ1Ans2.value, image2Data.q1_translation));
                    applyFeedback(userQ2Ans2, compareAxisAnswers(userQ2Ans2.value, image2Data.q2_rotation));
                    applyFeedback(userQ3Btn2, userQ3Btn2.dataset.value === image2Data.q3_impossible_moves);
                    applyFeedback(userQ4Btn2, userQ4Btn2.dataset.value === image2Data.q4_class);
                    applyFeedback(userQ5Btn2, userQ5Btn2.dataset.value === image2Data.q5_type);
                }

                // Зменшуємо кількість спроб
                remainingAttempts--;
                localStorage.setItem('remainingAttempts', remainingAttempts);

                if (remainingAttempts > 0) {
                    checkButton.textContent = `ПЕРЕВІРИТИ (${remainingAttempts} спроб)`;
                } else {
                    checkButton.textContent = 'ПЕРЕЙТИ ДО РЕЗУЛЬТАТІВ';
                }
            });
        }
    }
});
