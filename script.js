const apiURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    const { data } = await axios(apiURL + username);
    userCard(data);
    getRepos(username);
  } catch (err) {
    if (err.request.status === 404)
      errorCard("No User found with this username");
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(apiURL + username + "/repos");
    repoCard(data);
  } catch (err) {
    errorCard("Problem Loading Repositories");
    console.log(err);
  }
}

function userCard(user) {
  const cardHtml = `
    <div class="card">
        <div>
            <img class="avatar" src=${user.avatar_url} alt=${user.name}>
        </div>
        <div class="user-info">
            <h2>${user.name}</h2><br>
            <p>${user.bio}</p>
            <br>
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
            <br>
            <div id="repos"></div>
        </div>
    </div>
    `;

  main.innerHTML = cardHtml;
}

function repoCard(repos) {
  const reposEl = document.getElementById("repos");
  console.log(repos);

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");

    repoEl.classList.add("repo");
    repoEl.innerText = repo.name;
    repoEl.href = repo.clone_url;

    reposEl.appendChild(repoEl);
  });
}

function errorCard(message) {
  const errorCardHtml = `
    <div class="card">
        <h2>${message}</h2>
    </div>
    `;
  main.innerHTML = errorCardHtml;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;

  if (user) {
    getUser(user);
  }
  search.value = "";
});
