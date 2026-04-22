const API = "http://localhost:3000";

// Check if user is logged in to toggle UI
const token = localStorage.getItem('token');
const authLinks = document.getElementById('auth-links');

if (token) {
    authLinks.innerHTML = `
        <a href="add-solution.html">Add Solution</a>
        <button onclick="logout()">Logout</button>
    `;
}

function logout() {
    localStorage.removeItem('token');
    window.location.reload();
}

// async function fetchSolutions() {
//     const res = await fetch(`${API}/solutions`);
//     const solutions = await res.json();
//     const list = document.getElementById('solutions-list');
//     list.innerHTML = solutions.map(s => `
//         <div class="card">
//             <h3>${s.title}</h3>
//             <p>${s.description}</p>
//             <button onclick="upvote(${s.id})">Upvote (${s.upvotes})</button>
//         </div>
//     `).join('');
// }

async function fetchSolutions() {
    try {
        console.log("Fetching solutions..."); // Debug log
        const res = await fetch(`${API}/solutions`);
        const solutions = await res.json();
        console.log("Data received:", solutions); // Debug log

        const list = document.getElementById('solutions-list');
        
        if (!list) {
            console.error("Error: Could not find element with id 'solutions-list'");
            return;
        }
// ... inside fetchSolutions function ...
list.innerHTML = solutions.map(s => `
    <div class="card">
        <div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
        </div>
        <button onclick="upvote(${s.id})">👍 Upvote (${s.upvotes})</button>
    </div>
`).join('');
        list.innerHTML = solutions.map(s => `
            <div class="card">
                <h3>${s.title}</h3>
                <p>${s.description}</p>
                <button onclick="upvote(${s.id})">Upvote (${s.upvotes})</button>
            </div>
        `).join('');
    } catch (err) {
        console.error("Failed to fetch solutions:", err);
    }
}

async function upvote(id) {
    if (!token) return alert("Login to upvote!");
    await fetch(`${API}/solutions/${id}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchSolutions();
}

document.getElementById('search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? '' : 'none';
    });
});

fetchSolutions();