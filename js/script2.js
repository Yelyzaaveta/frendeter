const filterBtn = document.getElementById('filterBtn');
const filterMenu = document.getElementById('filterMenu');
const mainPage = document.getElementById('main');
const searchInput = document.getElementById('search-input');

const userData = JSON.parse(localStorage.getItem('user'));
console.log(userData);   //це просто шоб глянути чи видалився яюзер

const cardContainer = document.getElementById('cardContainer');
const loading = document.getElementById('loading');


let page = 1;
const resultsPerPage = 9;
let isLoading = false;
let loadCount = 0;
const maxLoadCount = 100;
const hobbiesArray = ['Футбол', 'Читання', 'Аніме', 'Подорожі', 'Малювання', 'Кулінарія', 'Музика', 'Фотографія', 'Танці', 'Відеоігри'];
//всі через юзер апі але там не було хобі тому в мене буде це масив

const usersArray = [];

function toggleFilterMenu() {
    if (filterMenu.style.display === "none" || filterMenu.style.display === "") {
    filterMenu.style.display = "block";
        mainPage.style.filter = "blur(40px)";
} else {
    filterMenu.style.display = "none";
    mainPage.style.filter = "none";
}
}


// отут все для створення карточок з юзерами
function getRandomItems(arr, num) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

async function fetchUsers() {
    const response = await fetch(`https://randomuser.me/api/?results=${resultsPerPage}&page=${page}`);
    const data = await response.json();
    return data.results;
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'photo';
    img.src = user.picture.large;
    img.alt = `${user.name.first} ${user.name.last}`;

    const name = document.createElement('h3');
    name.className = 'name';
    name.textContent = `${user.name.first} ${user.name.last}`;

    const description = document.createElement('div');
    description.className = 'description';

    const country = document.createElement('p');
    country.className = 'country';
    country.textContent = user.location.country;

    const age = document.createElement('p');
    age.className = 'age';
    age.textContent = `${user.dob.age} years old`;

    const phone = document.createElement('p');
    phone.className = 'phone';
    phone.textContent = user.phone;

    const hobbies = document.createElement('div');
    hobbies.className = 'hobbies';
    const hobbiesTitle = document.createElement('p');
    hobbiesTitle.textContent = 'Хоббі';
    const hobbiesList = document.createElement('ul');
    const hobbyItems = getRandomItems(hobbiesArray, 3);
    hobbyItems.forEach(hobby => {
        const hobbyItem = document.createElement('li');
        hobbyItem.textContent = hobby;
        hobbiesList.appendChild(hobbyItem);
    });
    hobbies.appendChild(hobbiesTitle);
    hobbies.appendChild(hobbiesList);

    const registration = document.createElement('p');
    registration.className = 'registration';
    const registrationDate = new Date(user.registered.date);
    registration.textContent = `Here from: ${registrationDate.toLocaleDateString()}`;


    description.appendChild(country);
    description.appendChild(age);
    description.appendChild(phone);
    description.appendChild(hobbies);
    description.appendChild(registration);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(document.createElement('hr'));
    card.appendChild(description);

    return card;
}

async function loadUsers() {
    if (isLoading || loadCount >= maxLoadCount) {
        loading.style.display = 'none';
        return;
    }

    isLoading = true;
    loading.style.display = 'block';
    const users = await fetchUsers();
    usersArray.push(...users);
    users.forEach(user => {
        const userCard = createUserCard(user);
        cardContainer.appendChild(userCard);
    });
    loading.style.display = 'none';
    isLoading = false;
    page++;
    loadCount++;
}

function isScrolledToBottom() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return (documentHeight - windowHeight - scrollTop) < 10;
}


// ось тут починається пошук та фільри

function debounce(func, delay) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function filterUsersByName(searchTerm) {
    const filteredUsers = usersArray.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        return fullName.includes(searchTerm);
    });

    cardContainer.innerHTML = '';

    filteredUsers.forEach(user => {
        const userCard = createUserCard(user);
        cardContainer.appendChild(userCard);
    });
}


function sortUsers(users, sortBy) {
    switch (sortBy) {
        case 'younger':
            return users.sort((a, b) => a.dob.age - b.dob.age);
        case 'older':
            return users.sort((a, b) => b.dob.age - a.dob.age);
        case 'alphabet_a':
            return users.sort((a, b) => a.name.first.localeCompare(b.name.first));
        case 'alphabet_z':
            return users.sort((a, b) => b.name.first.localeCompare(a.name.first));
        case 'date_new':
            return users.sort((a, b) => new Date(b.registered.date) - new Date(a.registered.date));
        case 'date_old':
            return users.sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
        default:
            return users;
    }
}
function filterUsers(users, filters) {
    return users.filter(user => {

        if (filters.minAge && user.dob.age < parseInt(filters.minAge)) {
            return false;
        }
        if (filters.maxAge && user.dob.age > parseInt(filters.maxAge)) {
            return false;
        }

        if (filters.name && !user.name.first.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }

        return !(filters.country && !user.location.country.toLowerCase().includes(filters.country.toLowerCase()));

    });
}

function renderUsers(users) {

    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';

    users.forEach(user => {
        const userCard = createUserCard(user);
        cardContainer.appendChild(userCard);
    });
}


// ЮРЛ модифікація
function getSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    return params;
}

function updateFiltersAndSortFromURL() {
    const params = getSearchParams();
    const filters = {
        minAge: params.minAge || '',
        maxAge: params.maxAge || '',
        name: params.name || '',
        country: params.country || ''
    };
    const sortBy = params.sortBy || '';

    document.getElementById('filterAgeFrom').value = filters.minAge;
    document.getElementById('filterAgeTo').value = filters.maxAge;
    document.getElementById('filterName').value = filters.name;
    document.getElementById('filterLocation').value = filters.country;

    document.getElementById('sort').value = sortBy;

    const filteredUsers = filterUsers(usersArray, filters);
    const sortedUsers = sortUsers(filteredUsers, sortBy);
    renderUsers(sortedUsers);
}

function updateURL(params) {
    const url = new URL(window.location);
    const searchParams = new URLSearchParams(params).toString();
    const newURL = `${url.pathname}?${searchParams}`;

    fetch(newURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update URL');
            }
            window.history.pushState({ path: newURL }, '', newURL);
            updateFiltersAndSortFromURL();
        })
        .catch(error => {
            console.error('Error updating URL:', error);
        });
}



// Події.....



document.addEventListener("DOMContentLoaded", function() {

    const main = document.getElementById('main'); // обробник головної сторіки
    main.addEventListener('click', function (event) {
        if (event.target.id === 'filterBtn') {
            toggleFilterMenu();
        }
        if (event.target.id === 'logOutBtn') {
            localStorage.removeItem('user');
            if (localStorage.getItem('user') === null) {
                console.log('user removed.');
            }
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }

    });

    // це типу інпут обробка для дебаунс пошуку
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterUsersByName(searchTerm);
    }, 300));


    const filterMenu = document.getElementById('filterMenu'); // обробник спливаючого меню
    filterMenu.addEventListener('click', function(event) {
        if (event.target.classList.contains('sort-btn')) {
            const sortBy = document.getElementById('sort').value;
            updateURL({ sortBy });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateFiltersAndSortFromURL();
        }

        if (event.target.classList.contains('filtering-btn')) {
            const filters = {
                minAge: document.getElementById('filterAgeFrom').value.trim(),
                maxAge: document.getElementById('filterAgeTo').value.trim(),
                name: document.getElementById('filterName').value.trim(),
                country: document.getElementById('filterLocation').value.trim(),
            };
            updateURL(filters);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateFiltersAndSortFromURL();
        }

        if (event.target.id === 'toggleButtonClose') {
            toggleFilterMenu();
        }
    });

   // довантаження

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading) {
            loadUsers().then(() => {
            }).catch(error => {
                console.error('Error loading users:', error);
            });

        }
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    observer.observe(loading);

    window.addEventListener('scroll', () => {
        if (isScrolledToBottom()) {
            document.getElementById('loading').style.display = 'block'; // Показуємо індикатор завантаження

            setTimeout(() => {
                loadUsers().then(() => {
                    document.getElementById('loading').style.display = 'none'; // Ховаємо індикатор завантаження
                });
            }, 500);
        }
    });

    loadUsers().then(() => {
    }).catch(error => {
        console.error('Error loading users:', error);
    });

});
