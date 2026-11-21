const form = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const statusEl = document.getElementById('status');
const avatarEl = document.getElementById('avatar');
const usernameEl = document.getElementById('username');
const statRepos = document.getElementById('stat-repos');
const statStars = document.getElementById('stat-stars');
const statFollowers = document.getElementById('stat-followers');
const statFollowing = document.getElementById('stat-following');
const languageList = document.getElementById('language-list');
const repoGrid = document.getElementById('repo-grid');
const contributionsEl = document.getElementById('contributions');
const contribTotalEl = document.getElementById('contrib-total');
const contribYearsEl = document.getElementById('contrib-years');

const DEFAULT_USER = 'gaboers-s';
let currentUser = null;
let selectedYear = 'last';

function setStatus(message, isError = false) {
    statusEl.textContent = message || '';
    statusEl.classList.toggle('error', isError);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const err = new Error('Request failed');
        err.status = response.status;
        throw err;
    }
    return response.json();
}

function renderProfile(user) {
    avatarEl.src = user.avatar_url || '';
    avatarEl.alt = `${user.login} avatar`;
    avatarEl.removeAttribute('aria-hidden');
    usernameEl.textContent = user.login || '-';
    statRepos.textContent = user.public_repos ?? 0;
    statFollowers.textContent = user.followers ?? 0;
    statFollowing.textContent = user.following ?? 0;
}

function renderLanguages(repos) {
    const counts = {};
    repos.forEach((repo) => {
        if (repo.language) {
            counts[repo.language] = (counts[repo.language] || 0) + 1;
        }
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    languageList.innerHTML = '';

    if (entries.length === 0) {
        languageList.innerHTML = '<li class="muted">No language data available.</li>';
        return;
    }

    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    entries.forEach(([name, count]) => {
        const percent = Math.round((count / total) * 100);
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="lang-row"><span>${name}</span><span>${percent}%</span></div>
            <div class="lang-bar"><span class="lang-fill" style="width: ${percent}%;"></span></div>
        `;
        languageList.appendChild(li);
    });
}

function renderRepos(repos) {
    repoGrid.innerHTML = '';

    if (!repos.length) {
        repoGrid.innerHTML = '<p class="muted">No public repositories found.</p>';
        return;
    }

    const topRepos = [...repos]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 6);

    topRepos.forEach((repo) => {
        const card = document.createElement('article');
        card.className = 'card repo-card';
        const visibility = repo.private ? 'Private' : 'Public';
        const badgeClass = repo.private ? 'badge badge-muted' : 'badge';
        const description = repo.description ? repo.description : 'No description provided.';
        card.innerHTML = `
            <div class="repo-top">
                <h3 class="repo-name"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
                <span class="${badgeClass}">${visibility}</span>
            </div>
            <p class="repo-desc">${description}</p>
            <div class="repo-meta">
                <span>${repo.language || 'Unknown'}</span>
                <span>★ ${repo.stargazers_count ?? 0}</span>
                <span>⑂ ${repo.forks_count ?? 0}</span>
                <span>Updated ${formatDate(repo.updated_at)}</span>
            </div>
        `;
        repoGrid.appendChild(card);
    });
}

function levelForCount(count, max) {
    if (!count || max <= 0) return 0;
    const ratio = count / max;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
}

function renderYearSelector(createdAt) {
    contribYearsEl.innerHTML = '';
    const current = new Date().getFullYear();
    const startYear = createdAt ? new Date(createdAt).getFullYear() : current - 5;
    const years = [];
    for (let y = current; y >= Math.max(startYear, 2008); y--) years.push(y);

    years.forEach((y) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'year-btn' + (String(y) === String(selectedYear) ? ' active' : '');
        btn.textContent = String(y);
        btn.addEventListener('click', async () => {
            if (!currentUser || String(selectedYear) === String(y)) return;
            selectedYear = String(y);
            renderYearSelector(createdAt);
            contributionsEl.innerHTML = '<p class="muted">Loading contributions...</p>';
            contribTotalEl.textContent = '';
            try {
                const data = await fetchContributions(currentUser, y);
                renderContributions(data, y);
            } catch {
                contributionsEl.innerHTML = '<p class="muted">Contribution calendar unavailable.</p>';
            }
        });
        contribYearsEl.appendChild(btn);
    });
}

function renderContributions(data, year) {
    const contributions = (data && data.contributions) ? data.contributions : [];
    contributionsEl.innerHTML = '';
    contribTotalEl.textContent = '';

    if (!contributions.length) {
        contributionsEl.innerHTML = '<p class="muted">Contribution data unavailable.</p>';
        return;
    }

    let total = contributions.reduce((sum, d) => sum + (d.count || 0), 0);
    if (data.total) {
        if (year && typeof data.total[String(year)] === 'number') total = data.total[String(year)];
        else if (!year || year === 'last') {
            if (typeof data.total.lastYear === 'number') total = data.total.lastYear;
        }
    }
    const label = year && year !== 'last' ? `in ${year}` : 'in the last year';
    contribTotalEl.textContent = `${total.toLocaleString()} contributions ${label}`;

    const max = contributions.reduce((m, d) => Math.max(m, d.count || 0), 0);

    const firstDate = new Date(contributions[0].date + 'T00:00:00');
    const startDay = firstDate.getDay(); // 0=Sun

    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    contributions.forEach((d) => cells.push(d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weekCount = cells.length / 7;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabels = new Array(weekCount).fill('');
    let lastMonth = -1;
    for (let w = 0; w < weekCount; w++) {
        const day = cells[w * 7] || cells[w * 7 + 1] || cells[w * 7 + 2] || cells[w * 7 + 3] || cells[w * 7 + 4] || cells[w * 7 + 5] || cells[w * 7 + 6];
        if (!day) continue;
        const m = new Date(day.date + 'T00:00:00').getMonth();
        if (m !== lastMonth) {
            monthLabels[w] = monthNames[m];
            lastMonth = m;
        }
    }

    const wrap = document.createElement('div');
    wrap.className = 'contrib-wrap';

    const months = document.createElement('div');
    months.className = 'contrib-months';
    monthLabels.forEach((labelText) => {
        const span = document.createElement('span');
        span.className = 'contrib-month';
        span.textContent = labelText;
        months.appendChild(span);
    });

    const days = document.createElement('div');
    days.className = 'contrib-days';
    ['', 'Mon', '', 'Wed', '', 'Fri', ''].forEach((labelText) => {
        const span = document.createElement('span');
        span.textContent = labelText;
        days.appendChild(span);
    });

    const graph = document.createElement('div');
    graph.className = 'contrib-graph';
    cells.forEach((day) => {
        const cell = document.createElement('span');
        if (!day) {
            cell.className = 'contrib-cell empty';
        } else {
            const level = levelForCount(day.count || 0, max);
            cell.className = `contrib-cell level-${level}`;
            const dateLabel = formatDate(day.date);
            const count = day.count || 0;
            cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${dateLabel}`;
        }
        graph.appendChild(cell);
    });

    wrap.appendChild(months);
    wrap.appendChild(days);
    wrap.appendChild(graph);
    contributionsEl.appendChild(wrap);
}

async function fetchContributions(username, year) {
    const y = year && year !== 'last' ? String(year) : 'last';
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${encodeURIComponent(y)}`;
    return fetchJson(url);
}

async function loadDashboard(username) {
    const user = username.trim();
    if (!user) return;

    setStatus(`Loading ${user}...`);
    contributionsEl.innerHTML = '<p class="muted">Loading contributions...</p>';
    contribTotalEl.textContent = '';
    contribYearsEl.innerHTML = '';

    try {
        const nowYear = String(new Date().getFullYear());
        selectedYear = nowYear;
        const [profile, repos, contribResult] = await Promise.all([
            fetchJson(`https://api.github.com/users/${encodeURIComponent(user)}`, {
                headers: { Accept: 'application/vnd.github+json' }
            }),
            fetchJson(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`, {
                headers: { Accept: 'application/vnd.github+json' }
            }),
            fetchContributions(user, nowYear).catch(() => null)
        ]);

        currentUser = profile.login;
        renderProfile(profile);
        renderYearSelector(profile.created_at);
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        statStars.textContent = totalStars;
        renderLanguages(repos);
        renderRepos(repos);
        if (contribResult) {
            renderContributions(contribResult, nowYear);
        } else {
            contributionsEl.innerHTML = '<p class="muted">Contribution calendar unavailable.</p>';
        }
        setStatus(`Showing data for ${profile.login}.`);
    } catch (error) {
        let message = 'Failed to load data from GitHub.';
        if (error && error.status === 404) message = 'User not found.';
        if (error && error.status === 403) message = 'GitHub API rate limit reached. Try again later.';
        setStatus(message, true);
        avatarEl.src = '';
        avatarEl.alt = '';
        avatarEl.setAttribute('aria-hidden', 'true');
        usernameEl.textContent = '-';
        statRepos.textContent = '-';
        statStars.textContent = '-';
        statFollowers.textContent = '-';
        statFollowing.textContent = '-';
        languageList.innerHTML = '<li class="muted">No data</li>';
        repoGrid.innerHTML = '<p class="muted">No repositories loaded.</p>';
        contributionsEl.innerHTML = '<p class="muted">Contribution data unavailable.</p>';
        contribTotalEl.textContent = '';
        contribYearsEl.innerHTML = '';
        currentUser = null;
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    loadDashboard(searchInput.value);
});

loadDashboard(DEFAULT_USER);
