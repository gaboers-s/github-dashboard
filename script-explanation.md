# script.js — Line-by-Line Explanation (Beginner Friendly)

This file explains every line of `script.js` in simple terms.  
`script.js` makes the dashboard "dynamic": it asks GitHub for data and updates the page.

---

## Lines 1–14: Getting elements from the HTML page

```js
1: const form = document.getElementById('search-form');
```
- Finds the HTML element with `id="search-form"` (the search form) and stores it in a constant variable named `form` so we can work with it later (like listen for submit).

```js
2: const searchInput = document.getElementById('search');
```
- Finds the text input box (`id="search"`) where the user types a GitHub username, and stores it in `searchInput`.

```js
3: const statusEl = document.getElementById('status');
```
- Finds the element (`id="status"`) used to show messages like "Loading..." or error messages.

```js
4: const avatarEl = document.getElementById('avatar');
```
- Finds the image element (`id="avatar"`) that will display the user's profile picture.

```js
5: const usernameEl = document.getElementById('username');
```
- Finds the element that displays the GitHub username in the header.

```js
6: const statRepos = document.getElementById('stat-repos');
```
- Finds the element that will show the number of public repositories.

```js
7: const statStars = document.getElementById('stat-stars');
```
- Finds the element that will show the total number of stars.

```js
8: const statFollowers = document.getElementById('stat-followers');
```
- Finds the element that will show the follower count.

```js
9: const statFollowing = document.getElementById('stat-following');
```
- Finds the element that will show how many accounts the user is following.

```js
10: const languageList = document.getElementById('language-list');
```
- Finds the list (`<ul>`) where top languages will be displayed.

```js
11: const repoGrid = document.getElementById('repo-grid');
```
- Finds the container where repository cards will be displayed.

```js
12: const contributionsEl = document.getElementById('contributions');
```
- Finds the container where the contribution calendar (heatmap) will be drawn.

```js
13: const contribTotalEl = document.getElementById('contrib-total');
```
- Finds the element that shows total contributions text (e.g. "123 contributions in 2026").

```js
14: const contribYearsEl = document.getElementById('contrib-years');
```
- Finds the container where clickable year buttons will be added.

---

## Lines 15–18: Default settings and state

```js
15: 
```
- A blank line for readability (separates sections).

```js
16: const DEFAULT_USER = 'gaboers-s';
```
- Sets the default GitHub username to load when the page first opens.

```js
17: let currentUser = null;
```
- Creates a variable to remember which user is currently loaded. Starts as `null` (nothing loaded yet). `let` means it can change later.

```js
18: let selectedYear = 'last';
```
- Creates a variable to remember which contribution year is selected. Starts as `'last'`.

---

## Lines 19–23: Showing status messages

```js
19: 
```
- Blank line for readability.

```js
20: function setStatus(message, isError = false) {
```
- Defines a function named `setStatus` to show messages to the user. It takes `message` (text to show) and `isError` (defaults to `false` if not provided).

```js
21:     statusEl.textContent = message || '';
```
- Sets the text inside the status element. If `message` is empty/missing, it uses an empty string `''`.

```js
22:     statusEl.classList.toggle('error', isError);
```
- Adds the CSS class `error` if `isError` is `true`, or removes it if `false`. This can change the message color/style.

```js
23: }
```
- Ends the `setStatus` function.

---

## Lines 24–29: Formatting dates nicely

```js
24: 
```
- Blank line.

```js
25: function formatDate(dateString) {
```
- Defines a function to turn a date string (like from GitHub) into a readable format.

```js
26:     const date = new Date(dateString);
```
- Creates a JavaScript `Date` object from the provided date string.

```js
27:     if (Number.isNaN(date.getTime())) return 'Unknown';
```
- Checks if the date is invalid. If so, returns `'Unknown'` and stops the function.

```js
28:     return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
```
- Returns the date in a readable local format (e.g. "Nov 13, 2026"). `undefined` uses the browser's default locale.

```js
29: }
```
- Ends the `formatDate` function.

---

## Lines 30–39: Fetching JSON data from a URL

```js
30: 
```
- Blank line.

```js
31: async function fetchJson(url, options = {}) {
```
- Defines an asynchronous function (it can `await` things that take time, like network requests). It takes a `url` and optional `options` (default empty object).

```js
32:     const response = await fetch(url, options);
```
- Sends a request to the URL and waits for the response. `fetch` is the browser's built-in way to get data from the internet.

```js
33:     if (!response.ok) {
```
- Checks if the request failed (HTTP errors like 404 or 403 make `ok` false).

```js
34:         const err = new Error('Request failed');
```
- Creates a new error object with a message.

```js
35:         err.status = response.status;
```
- Attaches the HTTP status code (like 404) to the error so we can handle it later.

```js
36:         throw err;
```
- Throws the error, which stops normal execution and jumps to a `catch` block (if there is one).

```js
37:     }
```
- Ends the `if` block.

```js
38:     return response.json();
```
- Reads the response body and converts it from JSON text into a JavaScript object/value, then returns it.

```js
39: }
```
- Ends the `fetchJson` function.

---

## Lines 40–49: Rendering profile information

```js
40: 
```
- Blank line.

```js
41: function renderProfile(user) {
```
- Defines a function to update the page with the user's profile data. `user` is an object from the GitHub API.

```js
42:     avatarEl.src = user.avatar_url || '';
```
- Sets the avatar image source to the user's avatar URL, or empty string if missing.

```js
43:     avatarEl.alt = `${user.login} avatar`;
```
- Sets the image's alt text (important for accessibility) using the user's login name.

```js
44:     avatarEl.removeAttribute('aria-hidden');
```
- Removes `aria-hidden` so screen readers can recognize the image now that it has meaningful content.

```js
45:     usernameEl.textContent = user.login || '-';
```
- Shows the user's login/username in the header, or `-` if missing.

```js
46:     statRepos.textContent = user.public_repos ?? 0;
```
- Shows the number of public repos. `?? 0` means "use 0 if the value is null or undefined".

```js
47:     statFollowers.textContent = user.followers ?? 0;
```
- Shows the followers count, defaulting to 0 if missing.

```js
48:     statFollowing.textContent = user.following ?? 0;
```
- Shows the following count, defaulting to 0 if missing.

```js
49: }
```
- Ends `renderProfile`.

---

## Lines 50–77: Rendering top languages

```js
50: 
```
- Blank line.

```js
51: function renderLanguages(repos) {
```
- Defines a function to calculate and display top languages from a list of repositories.

```js
52:     const counts = {};
```
- Creates an empty object to count how many repos use each language (e.g. `{ JavaScript: 5 }`).

```js
53:     repos.forEach((repo) => {
```
- Loops over each repository in the `repos` array.

```js
54:         if (repo.language) {
```
- Checks if the repo has a primary language set (some repos have none).

```js
55:             counts[repo.language] = (counts[repo.language] || 0) + 1;
```
- Increases the count for that language by 1. If it wasn't counted before, start from 0.

```js
56:         }
```
- Ends the `if`.

```js
57:     });
```
- Ends the `forEach` loop.

```js
58: 
```
- Blank line.

```js
59:     const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
```
- Converts the counts object into `[language, count]` pairs, sorts them by count (highest first), and keeps only the top 6.

```js
60:     languageList.innerHTML = '';
```
- Clears any old language items from the list.

```js
61: 
```
- Blank line.

```js
62:     if (entries.length === 0) {
```
- Checks if there are no language entries to show.

```js
63:         languageList.innerHTML = '<li class="muted">No language data available.</li>';
```
- Shows a friendly "no data" message.

```js
64:         return;
```
- Exits the function early since there's nothing else to render.

```js
65:     }
```
- Ends the `if`.

```js
66: 
```
- Blank line.

```js
67:     const total = entries.reduce((sum, [, count]) => sum + count, 0);
```
- Adds up all the counts to get a total (used to calculate percentages).

```js
68:     entries.forEach(([name, count]) => {
```
- Loops through each top language entry, extracting `name` and `count`.

```js
69:         const percent = Math.round((count / total) * 100);
```
- Calculates the percentage and rounds it to a whole number.

```js
70:         const li = document.createElement('li');
```
- Creates a new `<li>` (list item) element.

```js
71:         li.innerHTML = `
```
- Starts setting the HTML content inside the list item (using a template string that can span lines).

```js
72:             <div class="lang-row"><span>${name}</span><span>${percent}%</span></div>
```
- Adds a row showing the language name and its percentage.

```js
73:             <div class="lang-bar"><span class="lang-fill" style="width: ${percent}%;"></span></div>
```
- Adds a bar and sets the filled part's width to the percentage.

```js
74:         `;
```
- Ends the template string for `innerHTML`.

```js
75:         languageList.appendChild(li);
```
- Adds the new list item into the language list on the page.

```js
76:     });
```
- Ends the loop over language entries.

```js
77: }
```
- Ends `renderLanguages`.

---

## Lines 78–112: Rendering repository cards

```js
78: 
```
- Blank line.

```js
79: function renderRepos(repos) {
```
- Defines a function to display repository cards.

```js
80:     repoGrid.innerHTML = '';
```
- Clears old repository cards/content.

```js
81: 
```
- Blank line.

```js
82:     if (!repos.length) {
```
- Checks if there are no repositories.

```js
83:         repoGrid.innerHTML = '<p class="muted">No public repositories found.</p>';
```
- Shows a "no repos" message.

```js
84:         return;
```
- Exits early.

```js
85:     }
```
- Ends the `if`.

```js
86: 
```
- Blank line.

```js
87:     const topRepos = [...repos]
```
- Makes a copy of the repos array (`[...repos]`) so we don't modify the original, then starts chaining operations.

```js
88:         .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
```
- Sorts repos by last updated time, newest first.

```js
89:         .slice(0, 6);
```
- Keeps only the first 6 repos from the sorted list.

```js
90: 
```
- Blank line.

```js
91:     topRepos.forEach((repo) => {
```
- Loops over each of those top repos.

```js
92:         const card = document.createElement('article');
```
- Creates a new `<article>` element for a repo card.

```js
93:         card.className = 'card repo-card';
```
- Gives it CSS classes for styling.

```js
94:         const visibility = repo.private ? 'Private' : 'Public';
```
- Sets a label based on whether the repo is private or public.

```js
95:         const badgeClass = repo.private ? 'badge badge-muted' : 'badge';
```
- Chooses badge styling class depending on visibility.

```js
96:         const description = repo.description ? repo.description : 'No description provided.';
```
- Uses the repo description if available, otherwise a fallback message.

```js
97:         card.innerHTML = `
```
- Starts building the card's inner HTML.

```js
98:             <div class="repo-top">
```
- Opens a container for the repo name and badge.

```js
99:                 <h3 class="repo-name"><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
```
- Adds the repo name as a link to GitHub. `target="_blank"` opens in a new tab; `rel="noopener noreferrer"` is a security best practice for new-tab links.

```js
100:                 <span class="${badgeClass}">${visibility}</span>
```
- Adds the Public/Private badge.

```js
101:             </div>
```
- Closes the top row container.

```js
102:             <p class="repo-desc">${description}</p>
```
- Adds the repository description.

```js
103:             <div class="repo-meta">
```
- Opens a container for metadata (language, stars, forks, updated date).

```js
104:                 <span>${repo.language || 'Unknown'}</span>
```
- Shows the repo's primary language, or `Unknown`.

```js
105:                 <span>★ ${repo.stargazers_count ?? 0}</span>
```
- Shows star count (★ symbol) with default 0.

```js
106:                 <span>⑂ ${repo.forks_count ?? 0}</span>
```
- Shows fork count with default 0.

```js
107:                 <span>Updated ${formatDate(repo.updated_at)}</span>
```
- Shows the formatted last-updated date.

```js
108:             </div>
```
- Closes the meta container.

```js
109:         `;
```
- Ends the card HTML template.

```js
110:         repoGrid.appendChild(card);
```
- Adds the card to the repo grid on the page.

```js
111:     });
```
- Ends the loop over repos.

```js
112: }
```
- Ends `renderRepos`.

---

## Lines 113–121: Deciding contribution intensity level

```js
113: 
```
- Blank line.

```js
114: function levelForCount(count, max) {
```
- Defines a function to convert a contribution count into a level (0–4) for coloring cells.

```js
115:     if (!count || max <= 0) return 0;
```
- If there are no contributions (or max is invalid), return level 0 (empty/lightest).

```js
116:     const ratio = count / max;
```
- Calculates how large this day's count is compared to the maximum day.

```js
117:     if (ratio <= 0.25) return 1;
```
- Up to 25% of max → level 1.

```js
118:     if (ratio <= 0.5) return 2;
```
- Up to 50% of max → level 2.

```js
119:     if (ratio <= 0.75) return 3;
```
- Up to 75% of max → level 3.

```js
120:     return 4;
```
- Anything higher → level 4 (most intense).

```js
121: }
```
- Ends `levelForCount`.

---

## Lines 122–150: Rendering year selector buttons

```js
122: 
```
- Blank line.

```js
123: function renderYearSelector(createdAt) {
```
- Defines a function to create clickable year buttons based on when the account was created.

```js
124:     contribYearsEl.innerHTML = '';
```
- Clears existing year buttons.

```js
125:     const current = new Date().getFullYear();
```
- Gets the current year (e.g. 2026).

```js
126:     const startYear = createdAt ? new Date(createdAt).getFullYear() : current - 5;
```
- Uses the account creation year if available; otherwise falls back to 5 years ago.

```js
127:     const years = [];
```
- Creates an empty array to hold years.

```js
128:     for (let y = current; y >= Math.max(startYear, 2008); y--) years.push(y);
```
- Loops from current year down to the start year (but not earlier than 2008, when GitHub started) and adds each year to the array.

```js
129: 
```
- Blank line.

```js
130:     years.forEach((y) => {
```
- Loops through each year to create a button.

```js
131:         const btn = document.createElement('button');
```
- Creates a `<button>` element.

```js
132:         btn.type = 'button';
```
- Sets button type so it doesn't act like a form submit button.

```js
133:         btn.className = 'year-btn' + (String(y) === String(selectedYear) ? ' active' : '');
```
- Sets CSS classes; adds `active` if this year is the currently selected one.

```js
134:         btn.textContent = String(y);
```
- Sets the button label to the year.

```js
135:         btn.addEventListener('click', async () => {
```
- Adds a click handler. It's `async` because it will fetch data.

```js
136:             if (!currentUser || String(selectedYear) === String(y)) return;
```
- If no user is loaded, or the clicked year is already selected, do nothing.

```js
137:             selectedYear = String(y);
```
- Updates the selected year state.

```js
138:             renderYearSelector(createdAt);
```
- Re-renders year buttons so the active highlight updates.

```js
139:             contributionsEl.innerHTML = '<p class="muted">Loading contributions...</p>';
```
- Shows a loading message in the contributions area.

```js
140:             contribTotalEl.textContent = '';
```
- Clears the total contributions text while loading.

```js
141:             try {
```
- Starts a try block to catch errors from fetching.

```js
142:                 const data = await fetchContributions(currentUser, y);
```
- Fetches contribution data for the selected year and waits for it.

```js
143:                 renderContributions(data, y);
```
- Renders the contribution calendar with the fetched data.

```js
144:             } catch {
```
- If something goes wrong during fetch/render...

```js
145:                 contributionsEl.innerHTML = '<p class="muted">Contribution calendar unavailable.</p>';
```
- Shows an unavailable message.

```js
146:             }
```
- Ends try/catch.

```js
147:         });
```
- Ends the click event listener.

```js
148:         contribYearsEl.appendChild(btn);
```
- Adds the year button to the page.

```js
149:     });
```
- Ends the loop over years.

```js
150: }
```
- Ends `renderYearSelector`.

---

## Lines 151–236: Rendering the contribution calendar

```js
151: 
```
- Blank line.

```js
152: function renderContributions(data, year) {
```
- Defines a function to draw the contribution heatmap/calendar.

```js
153:     const contributions = (data && data.contributions) ? data.contributions : [];
```
- Safely gets the contributions array from the data; uses empty array if missing.

```js
154:     contributionsEl.innerHTML = '';
```
- Clears previous calendar content.

```js
155:     contribTotalEl.textContent = '';
```
- Clears previous total text.

```js
156: 
```
- Blank line.

```js
157:     if (!contributions.length) {
```
- If there is no contribution data...

```js
158:         contributionsEl.innerHTML = '<p class="muted">Contribution data unavailable.</p>';
```
- Show an unavailable message.

```js
159:         return;
```
- Exit early.

```js
160:     }
```
- Ends the `if`.

```js
161: 
```
- Blank line.

```js
162:     let total = contributions.reduce((sum, d) => sum + (d.count || 0), 0);
```
- Calculates total contributions by summing each day's count (defaulting missing counts to 0).

```js
163:     if (data.total) {
```
- If the API provided a `total` object, prefer its totals when available.

```js
164:         if (year && typeof data.total[String(year)] === 'number') total = data.total[String(year)];
```
- If a total for the specific year exists, use it.

```js
165:         else if (!year || year === 'last') {
```
- Otherwise, if we're showing "last year" data...

```js
166:             if (typeof data.total.lastYear === 'number') total = data.total.lastYear;
```
- Use the API's `lastYear` total if present.

```js
167:         }
```
- Ends inner `else if`.

```js
168:     }
```
- Ends `if (data.total)`.

```js
169:     const label = year && year !== 'last' ? `in ${year}` : 'in the last year';
```
- Chooses the label text based on whether a specific year is selected.

```js
170:     contribTotalEl.textContent = `${total.toLocaleString()} contributions ${label}`;
```
- Displays the total with thousands separators and the label.

```js
171: 
```
- Blank line.

```js
172:     const max = contributions.reduce((m, d) => Math.max(m, d.count || 0), 0);
```
- Finds the highest single-day contribution count (used to determine color levels).

```js
173: 
```
- Blank line.

```js
174:     const firstDate = new Date(contributions[0].date + 'T00:00:00');
```
- Gets the first date in the data as a Date object (`T00:00:00` helps avoid timezone parsing issues).

```js
175:     const startDay = firstDate.getDay(); // 0=Sun
```
- Gets the day of week for the first date (0 = Sunday, 6 = Saturday).

```js
176: 
```
- Blank line.

```js
177:     const cells = [];
```
- Creates an array to hold calendar cells (including padding).

```js
178:     for (let i = 0; i < startDay; i++) cells.push(null);
```
- Adds empty (`null`) cells at the beginning so the first real day lines up under the correct weekday.

```js
179:     contributions.forEach((d) => cells.push(d));
```
- Adds each real contribution day to the cells array.

```js
180:     while (cells.length % 7 !== 0) cells.push(null);
```
- Pads the end with `null`s so the total number of cells is a multiple of 7 (complete weeks).

```js
181: 
```
- Blank line.

```js
182:     const weekCount = cells.length / 7;
```
- Calculates how many week columns there are.

```js
183:     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```
- Defines short month names for labels.

```js
184:     const monthLabels = new Array(weekCount).fill('');
```
- Creates an array with one label slot per week, all empty initially.

```js
185:     let lastMonth = -1;
```
- Tracks the last month we labeled so we don't repeat month names too often.

```js
186:     for (let w = 0; w < weekCount; w++) {
```
- Loops through each week column.

```js
187:         const day = cells[w * 7] || cells[w * 7 + 1] || cells[w * 7 + 2] || cells[w * 7 + 3] || cells[w * 7 + 4] || cells[w * 7 + 5] || cells[w * 7 + 6];
```
- Tries to find any real day in that week (skips nulls) to determine the month for labeling.

```js
188:         if (!day) continue;
```
- If the whole week is empty, skip it.

```js
189:         const m = new Date(day.date + 'T00:00:00').getMonth();
```
- Gets the month index (0–11) for that day.

```js
190:         if (m !== lastMonth) {
```
- If this is a new month compared to the last labeled one...

```js
191:             monthLabels[w] = monthNames[m];
```
- Put the month abbreviation in this week's label slot.

```js
192:             lastMonth = m;
```
- Remember this month as the last labeled month.

```js
193:         }
```
- Ends the `if`.

```js
194:     }
```
- Ends the week loop.

```js
195: 
```
- Blank line.

```js
196:     const wrap = document.createElement('div');
```
- Creates a wrapper element to hold months, day labels, and the graph.

```js
197:     wrap.className = 'contrib-wrap';
```
- Assigns a CSS class for layout/styling.

```js
198: 
```
- Blank line.

```js
199:     const months = document.createElement('div');
```
- Creates a container for month labels.

```js
200:     months.className = 'contrib-months';
```
- Assigns its CSS class.

```js
201:     monthLabels.forEach((labelText) => {
```
- Loops through each week’s month label.

```js
202:         const span = document.createElement('span');
```
- Creates a `<span>` for the label.

```js
203:         span.className = 'contrib-month';
```
- Assigns a class for styling.

```js
204:         span.textContent = labelText;
```
- Sets the label text (may be empty for many weeks).

```js
205:         months.appendChild(span);
```
- Adds the span to the months container.

```js
206:     });
```
- Ends month labels loop.

```js
207: 
```
- Blank line.

```js
208:     const days = document.createElement('div');
```
- Creates a container for weekday labels (Mon, Wed, Fri).

```js
209:     days.className = 'contrib-days';
```
- Assigns its CSS class.

```js
210:     ['', 'Mon', '', 'Wed', '', 'Fri', ''].forEach((labelText) => {
```
- Loops over 7 slots (one per row/day of week), labeling only some for readability like GitHub.

```js
211:         const span = document.createElement('span');
```
- Creates a span for each day label.

```js
212:         span.textContent = labelText;
```
- Sets the label text.

```js
213:         days.appendChild(span);
```
- Adds it to the days container.

```js
214:     });
```
- Ends day labels loop.

```js
215: 
```
- Blank line.

```js
216:     const graph = document.createElement('div');
```
- Creates the container for the actual heatmap grid cells.

```js
217:     graph.className = 'contrib-graph';
```
- Assigns its CSS class.

```js
218:     cells.forEach((day) => {
```
- Loops through every cell (including padding nulls).

```js
219:         const cell = document.createElement('span');
```
- Creates a span element for each cell.

```js
220:         if (!day) {
```
- If this cell is padding (no real date)...

```js
221:             cell.className = 'contrib-cell empty';
```
- Mark it as an empty/hidden placeholder cell.

```js
222:         } else {
```
- Otherwise it's a real day with data.

```js
223:             const level = levelForCount(day.count || 0, max);
```
- Determines color intensity level (0–4) based on the day's count.

```js
224:             cell.className = `contrib-cell level-${level}`;
```
- Sets classes so CSS can color it appropriately.

```js
225:             const dateLabel = formatDate(day.date);
```
- Formats the day’s date for display in the tooltip.

```js
226:             const count = day.count || 0;
```
- Gets the contribution count for that day.

```js
227:             cell.title = `${count} contribution${count === 1 ? '' : 's'} on ${dateLabel}`;
```
- Sets the tooltip text shown on hover (handles singular/plural "contribution(s)").

```js
228:         }
```
- Ends if/else for cell.

```js
229:         graph.appendChild(cell);
```
- Adds the cell to the graph.

```js
230:     });
```
- Ends cells loop.

```js
231: 
```
- Blank line.

```js
232:     wrap.appendChild(months);
```
- Adds month labels to the wrapper.

```js
233:     wrap.appendChild(days);
```
- Adds weekday labels to the wrapper.

```js
234:     wrap.appendChild(graph);
```
- Adds the heatmap grid to the wrapper.

```js
235:     contributionsEl.appendChild(wrap);
```
- Adds the complete calendar to the page.

```js
236: }
```
- Ends `renderContributions`.

---

## Lines 237–242: Fetching contribution data

```js
237: 
```
- Blank line.

```js
238: async function fetchContributions(username, year) {
```
- Defines an async function to get contribution calendar data for a user and year.

```js
239:     const y = year && year !== 'last' ? String(year) : 'last';
```
- Chooses the year parameter: specific year string, or `'last'` as fallback.

```js
240:     const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${encodeURIComponent(y)}`;
```
- Builds the API URL safely (encodes username/year so special characters don't break the URL).

```js
241:     return fetchJson(url);
```
- Fetches and returns the parsed JSON data from that URL.

```js
242: }
```
- Ends `fetchContributions`.

---

## Lines 243–299: Loading the whole dashboard

```js
243: 
```
- Blank line.

```js
244: async function loadDashboard(username) {
```
- Defines the main async function that loads all dashboard data for a given username.

```js
245:     const user = username.trim();
```
- Removes extra spaces from the start/end of the input.

```js
246:     if (!user) return;
```
- If the input is empty after trimming, stop (do nothing).

```js
247: 
```
- Blank line.

```js
248:     setStatus(`Loading ${user}...`);
```
- Shows a loading status message.

```js
249:     contributionsEl.innerHTML = '<p class="muted">Loading contributions...</p>';
```
- Shows loading text in the contributions area.

```js
250:     contribTotalEl.textContent = '';
```
- Clears contribution total text.

```js
251:     contribYearsEl.innerHTML = '';
```
- Clears year buttons while loading.

```js
252: 
```
- Blank line.

```js
253:     try {
```
- Starts try block to handle any errors during loading.

```js
254:         const nowYear = String(new Date().getFullYear());
```
- Gets the current year as a string.

```js
255:         selectedYear = nowYear;
```
- Sets the selected year to the current year by default for this load.

```js
256:         const [profile, repos, contribResult] = await Promise.all([
```
- Starts multiple requests in parallel and waits for all of them. Results will be stored in `profile`, `repos`, and `contribResult`.

```js
257:             fetchJson(`https://api.github.com/users/${encodeURIComponent(user)}`, {
```
- Requests the user's profile data from GitHub's API.

```js
258:                 headers: { Accept: 'application/vnd.github+json' }
```
- Sends a header asking GitHub for the JSON API response format.

```js
259:             }),
```
- Ends the first fetch call in the array.

```js
260:             fetchJson(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`, {
```
- Requests up to 100 of the user's repos, sorted by updated time.

```js
261:                 headers: { Accept: 'application/vnd.github+json' }
```
- Same Accept header for the repos request.

```js
262:             }),
```
- Ends the second fetch call.

```js
263:             fetchContributions(user, nowYear).catch(() => null)
```
- Requests contributions for the current year. If it fails, return `null` instead of breaking everything (so profile/repos can still show).

```js
264:         ]);
```
- Ends the `Promise.all` array and waits for all results.

```js
265: 
```
- Blank line.

```js
266:         currentUser = profile.login;
```
- Saves the loaded user's login name in state.

```js
267:         renderProfile(profile);
```
- Updates the UI with profile info.

```js
268:         renderYearSelector(profile.created_at);
```
- Creates year buttons based on when the account was created.

```js
269:         const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
```
- Calculates total stars across all fetched repos.

```js
270:         statStars.textContent = totalStars;
```
- Displays the total star count.

```js
271:         renderLanguages(repos);
```
- Renders the top languages section.

```js
272:         renderRepos(repos);
```
- Renders repository cards.

```js
273:         if (contribResult) {
```
- Checks if contribution data was successfully fetched.

```js
274:             renderContributions(contribResult, nowYear);
```
- Renders the contribution calendar for the current year.

```js
275:         } else {
```
- If contribution data is missing/unavailable...

```js
276:             contributionsEl.innerHTML = '<p class="muted">Contribution calendar unavailable.</p>';
```
- Shows a fallback message.

```js
277:         }
```
- Ends the `if/else`.

```js
278:         setStatus(`Showing data for ${profile.login}.`);
```
- Shows a success/status message.

```js
279:     } catch (error) {
```
- Catches errors from the try block (e.g. user not found, rate limit).

```js
280:         let message = 'Failed to load data from GitHub.';
```
- Sets a default error message.

```js
281:         if (error && error.status === 404) message = 'User not found.';
```
- Uses a clearer message if the user doesn't exist.

```js
282:         if (error && error.status === 403) message = 'GitHub API rate limit reached. Try again later.';
```
- Uses a clearer message if GitHub rate-limited the requests.

```js
283:         setStatus(message, true);
```
- Displays the error message (with error styling).

```js
284:         avatarEl.src = '';
```
- Clears the avatar image.

```js
285:         avatarEl.alt = '';
```
- Clears avatar alt text.

```js
286:         avatarEl.setAttribute('aria-hidden', 'true');
```
- Hides the avatar from assistive tech since it's not meaningful now.

```js
287:         usernameEl.textContent = '-';
```
- Resets username display.

```js
288:         statRepos.textContent = '-';
```
- Resets repos stat.

```js
289:         statStars.textContent = '-';
```
- Resets stars stat.

```js
290:         statFollowers.textContent = '-';
```
- Resets followers stat.

```js
291:         statFollowing.textContent = '-';
```
- Resets following stat.

```js
292:         languageList.innerHTML = '<li class="muted">No data</li>';
```
- Resets languages section.

```js
293:         repoGrid.innerHTML = '<p class="muted">No repositories loaded.</p>';
```
- Resets repositories section.

```js
294:         contributionsEl.innerHTML = '<p class="muted">Contribution data unavailable.</p>';
```
- Resets contributions section.

```js
295:         contribTotalEl.textContent = '';
```
- Clears contribution total.

```js
296:         contribYearsEl.innerHTML = '';
```
- Clears year buttons.

```js
297:         currentUser = null;
```
- Clears the current user state.

```js
298:     }
```
- Ends try/catch.

```js
299: }
```
- Ends `loadDashboard`.

---

## Lines 300–306: Wiring up events and starting the app

```js
300: 
```
- Blank line.

```js
301: form.addEventListener('submit', (event) => {
```
- Listens for when the search form is submitted (e.g. user presses Enter or clicks Search).

```js
302:     event.preventDefault();
```
- Prevents the browser's default form behavior (which would reload the page).

```js
303:     loadDashboard(searchInput.value);
```
- Calls `loadDashboard` with whatever username is currently typed in the search box.

```js
304: });
```
- Ends the submit event listener.

```js
305: 
```
- Blank line.

```js
306: loadDashboard(DEFAULT_USER);
```
- Runs once when the script loads to show data for the default user (`gaboers-s` in this file).

---

## Quick summary

- **Lines 1–18:** Grab HTML elements and set starting values.
- **Lines 20–39:** Helper functions for status, date formatting, and fetching JSON.
- **Lines 41–112:** Functions that render profile, languages, and repositories onto the page.
- **Lines 114–236:** Functions that build the contribution year selector and heatmap calendar.
- **Lines 238–299:** Functions that fetch contribution data and orchestrate loading everything.
- **Lines 301–306:** Connect the search form and load the default user on startup.
