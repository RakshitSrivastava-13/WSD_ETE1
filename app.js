document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get user input values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Clear previous error messages
    document.getElementById('fullNameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    let isValid = true;

    // Validation checks
    if (!fullName) {
        document.getElementById('fullNameError').textContent = 'Full Name is required.';
        isValid = false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format.';
        isValid = false;
    }
    
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        isValid = false;
    }

    if (isValid) {
        // Hide the sign-up form
        document.getElementById('signUpForm').classList.add('hidden');
        // Show the news container
        document.getElementById('newsContainer').classList.remove('hidden');
        // Fetch and display the news
        fetchNews();
    }
});

let newsData = [];
let currentPage = 1;
const itemsPerPage = 5; // Number of articles per page

function fetchNews() {
    fetch('news.json') // Fetch news data from local JSON file
        .then(response => response.json())
        .then(data => {
            newsData = data; // Store news data for sorting/filtering/pagination
            renderNews();
        })
        .catch(error => console.error('Error fetching news:', error)); // Handle any errors
}

function renderNews() {
    const newsList = document.getElementById('newsList');
    const filter = document.getElementById('filter').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter news
    const filteredNews = newsData.filter(article => 
        article.title.toLowerCase().includes(filter) || 
        article.description.toLowerCase().includes(filter)
    );
    
    // Sort news
    const sortedNews = filteredNews.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.publishedAt) - new Date(a.publishedAt);
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });
    
    // Pagination
    const totalItems = sortedNews.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = sortedNews.slice(startIndex, endIndex);
    
    // Display news items
    newsList.innerHTML = ''; // Clear existing news
    currentItems.forEach(article => {
        const articleElement = `
            <div class="news-item">
                <img src="${article.urlToImage}" alt="${article.title}">
                <h3 class="text-xl font-bold">${article.title}</h3>
                <p class="text-gray-600">${article.description}</p>
                <a href="${article.url}" class="text-blue-500 mt-4 block">Read more</a>
            </div>
        `;
        newsList.innerHTML += articleElement;
    });

    // Display pagination controls
    displayPagination(totalPages);
}

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination
    
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `px-4 py-2 mx-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderNews(); // Re-render news with updated page
        });
        pagination.appendChild(pageButton);
    }
}

// Event listener for filter input
document.getElementById('filter').addEventListener('input', renderNews);

// Event listener for sort select
document.getElementById('sortBy').addEventListener('change', renderNews);
