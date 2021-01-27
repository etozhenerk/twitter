"use strict";

class FetchData {
  getResourse = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Произошла ошибка " + res.status);
    }

    return res.json();
  };

  getPost = () => this.getResourse("./db/database.json");
}

class Post {
  constructor({ id, userName, nickname, postDate, text, img, likes = 0 }) {
    this.id = id ? id : this.generateID();
    this.userName = userName;
    this.nickname = nickname;
    this.postDate = postDate ? new Date(postDate) : new Date();
    this.text = text;
    this.img = img;
    this.likes = likes;
    this.liked = false;
  }
  changeLike() {
    this.liked = !this.liked;
    if (this.liked) {
      this.likes++;
    } else {
      this.likes--;
    }
  }
  generateID() {
    return (
      Math.random().toString(32).substring(2, 9) + (+new Date()).toString(32)
    );
  }
  getDate = () => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return this.postDate.toLocaleString("ru-RU", options);
  }
}

class Posts {
  constructor({ posts = [] } = {}) {
    this.posts = posts;
  }
  addPost(tweet) {
    const post = new Post(tweet);
    this.posts.push(post);
  }
  deletePost(id) {}
  likePost(id) {}
}

class Twitter {
  constructor({ listElem }) {
    const fetchData = new FetchData();
    this.tweets = new Posts();
    this.elements = {
      listElem: document.querySelector(listElem),
    };

    fetchData.getPost().then((data) => {
      data.forEach((element) => {
        this.tweets.addPost(element);
        this.showAllPost();
      });
    });
  }

  renderPosts(tweets) {
    this.elements.listElem.textContent = "";

    tweets.forEach(({ id, userName, nickname, text, img, likes, getDate }) => {
      this.elements.listElem.insertAdjacentHTML(
        "beforeend",
        `
        <li>
        <article class="tweet">
          <div class="row">
            <img class="avatar" src="images/${nickname}.jpg" alt="Аватар пользователя ${nickname}">
            <div class="tweet__wrapper">
              <header class="tweet__header">
                <h3 class="tweet-author">${userName}
                  <span class="tweet-author__add tweet-author__nickname">@${nickname}</span>
                  <time class="tweet-author__add tweet__date">${getDate()}</time>
                </h3>
                <button class="tweet__delete-button chest-icon" data-id="${id}"></button>
              </header>
              <div class="tweet-post">
                <p class="tweet-post__text">${text}</p>
                ${
                  img
                    ? `<figure class="tweet-post__image">
                  <img src="${img}" alt="Сообщение ${nickname}">
                </figure>`
                    : ""
                }
              </div>
            </div>
          </div>
          <footer>
            <button class="tweet__like">
              ${likes}
            </button>
          </footer>
        </article>
      </li>

        `
      );
    });
  }

  showUserPost() {}

  showLikesPost() {}

  showAllPost() {
    this.renderPosts(this.tweets.posts);
  }

  openModal() {}
}

const twitter = new Twitter({
  listElem: ".tweet-list",
});
