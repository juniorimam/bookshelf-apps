const books = [];
const RENDER_CARD = "RENDER_CARD",
  RENDER_SEARCH = "RENDER_SEARCH",
  NOTIFY_ADD = "NOTIFY_ADD",
  NOTIFY_DELETE = "NOTIFY_DELETE",
  UNREAD_KEY = "UNREAD_KEY",
  READED_KEY = "READED_KEY",
  BOOKS_DATA = "BOOKS_DATA";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#formInputAddBook"),
    addBook = document.querySelectorAll("#addBook"),
    formAddBook = document.querySelector("#formAddBook"),
    formBg = document.querySelector("#formBg"),
    btCloseForm = document.querySelectorAll("#btCloseForm"),
    inputJudul = document.querySelector("#inputJudul"),
    inputPenulis = document.querySelector("#inputPenulis"),
    inputTahun = document.querySelector("#inputTahun"),
    notifyAdd = document.querySelector("#addBookNotify"),
    notifyDelete = document.querySelector("#deleteNotify"),
    lengthJudul = document.querySelector("#lengthJudul"),
    lengthPenulis = document.querySelector("#lengthPenulis"),
    btSubmit = document.querySelector("#btSubmit"),
    deleteBookSection = document.querySelector("#deleteBooks"),
    formDelete = document.querySelector("#formDelete"),
    deleteBookTitle = document.querySelector("#deleteBookTitle"),
    inputDelete = document.querySelector("#inputDelete"),
    btDelete = document.querySelector("#btDelete"),
    inputSearch = document.querySelector("#inputSearch");

  validateForm();

  form.addEventListener("submit", (f) => {
    f.preventDefault();

    saveDataObj();
    readStatusCounter();
    saveDataToStorage();

    document.dispatchEvent(new Event(RENDER_CARD));
    document.dispatchEvent(new Event(NOTIFY_ADD));
  });

  inputSearch.addEventListener("input", (sb) => {
    sb.preventDefault();
    searchBook();

    if (inputSearch.value == "") {
      cardComponent(books);
      document.dispatchEvent(new Event(RENDER_CARD));
    }
  });

  function saveDataObj() {
    const title = document.querySelector("#inputJudul");
    const author = document.querySelector("#inputPenulis");
    const year = document.querySelector("#inputTahun");
    const isRead = document.querySelector("#isRead");

    const data = dataObjectForm(
      title.value,
      author.value,
      year.value,
      isRead.checked
    );

    books.push(data);
    console.log(JSON.stringify(data, null, 4));

    lengthJudul.innerText = "";
    lengthPenulis.innerText = "";
    formAddBook.setAttribute("hidden", "");
    formBg.setAttribute("hidden", "");
    btSubmit.setAttribute("disabled", "");

    books.length += 1
      ? ((inputJudul.value = ""),
        (inputPenulis.value = ""),
        (inputTahun.value = ""),
        (isRead.checked = false))
      : "";
  }

  function dataObjectForm(title, author, year, isRead) {
    return {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isCompleted: isRead,
    };
  }

  document.addEventListener(RENDER_CARD, () => {
    const unreadBooksList = document.querySelector("#unreadBooksList");
    unreadBooksList.innerHTML = "";
    const readedBooksList = document.querySelector("#readedBooksList");
    readedBooksList.innerHTML = "";

    for (const book of books) {
      const card = cardComponent(book);

      if (!book.isCompleted) {
        unreadBooksList.append(card);
        checkIsiData();
      } else {
        readedBooksList.append(card);
        checkIsiData();
      }
    }
  });

  document.addEventListener(NOTIFY_ADD, () => {
    notifyAdd.removeAttribute("hidden");
    notifyAdd.classList.add("fadeIn");
    setTimeout(() => {
      notifyAdd.classList.add("fadeOut");
    }, 4000);
    setTimeout(() => {
      notifyAdd.classList.remove("fadeOut");
      notifyAdd.setAttribute("hidden", "");
    }, 4800);
  });

  document.addEventListener(NOTIFY_DELETE, () => {
    notifyDelete.removeAttribute("hidden");
    notifyDelete.classList.add("fadeIn");
    setTimeout(() => {
      notifyDelete.classList.add("fadeOut");
    }, 4000);
    setTimeout(() => {
      notifyDelete.classList.remove("fadeOut");
      notifyDelete.setAttribute("hidden", "");
    }, 4800);
  });

  function cardComponent(bookData) {
    const bookId = document.createElement("div"),
      bookDetail = document.createElement("div"),
      cardTitle = document.createElement("div"),
      cardButton = document.createElement("div"),
      title = document.createElement("h3"),
      author = document.createElement("h4"),
      year = document.createElement("h4"),
      deleteBook = document.createElement("button");

    bookId.classList.add("bookCard", "fadeIn"),
      bookDetail.classList.add("bookCardDetails", "flex"),
      cardTitle.classList.add("cardTitle", "flex"),
      author.classList.add("tcSecondary", "fwRegular"),
      year.classList.add("tcSecondary", "fwRegular"),
      cardButton.classList.add("cardButton", "flex"),
      deleteBook.classList.add("deleteBook", "flex"),
      deleteBook.setAttribute("id", "deleteBook"),
      deleteBook.setAttribute("title", "Delete " + bookData.title + " book"),
      bookId.setAttribute("id", +bookData.id);

    title.innerText = bookData.title;
    author.innerText = bookData.author;
    year.innerText = bookData.year;

    deleteBook.innerHTML = `<img src="src/image/red-trash.svg" alt="Delete Book" />
                            <span>Delete book</span>`;

    cardTitle.append(title, author, year);
    bookDetail.append(cardTitle, cardButton);
    bookId.append(bookDetail);

    if (!bookData.isCompleted) {
      const btDoneRead = document.createElement("button");

      btDoneRead.classList.add("checkRead", "flex"),
        btDoneRead.setAttribute(
          "title",
          "Done read " + bookData.title + " book"
        );

      btDoneRead.innerHTML = `<img src="src/image/check.svg" alt="Done Read" />                              
                              <span>Done reading</span>`;

      btDoneRead.addEventListener("click", () => {
        doneReadAction(bookData.id);
      });

      cardButton.append(btDoneRead, deleteBook);
    } else {
      const btReadAgain = document.createElement("button");

      btReadAgain.classList.add("checkRead", "flex"),
        btReadAgain.setAttribute(
          "title",
          "Read again " + bookData.title + " book"
        );

      btReadAgain.innerHTML = `<img src="src/image/reread.svg" alt="Read Again" />
                                <span>Read again</span>`;

      btReadAgain.addEventListener("click", () => {
        readAgainAction(bookData.id);
      });

      cardButton.append(btReadAgain, deleteBook);
    }

    deleteBook.addEventListener("click", () => {
      deleteBookSection.removeAttribute("hidden");
      formBg.removeAttribute("hidden");
      deleteBookTitle.innerText = bookData.title;
      deleteBookAction(bookData);
    });

    findId = (id) => {
      for (const book of books) {
        if (book.id === id) {
          return book;
        }
      }
      return null;
    };

    doneReadAction = (id) => {
      const idBooks = findId(id);

      if (idBooks == null) {
        return;
      } else {
        idBooks.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_CARD));
        saveDataToStorage();
        readStatusCounter();
        checkIsiData();
      }
    };

    readAgainAction = (id) => {
      const idBooks = findId(id);

      if (idBooks == null) {
        return;
      } else {
        idBooks.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_CARD));

        saveDataToStorage();
        readStatusCounter();
        checkIsiData();
      }
    };

    findIndex = (id) => {
      for (const index in books) {
        if (books[index].id === id) {
          return index;
        }
      }
    };

    deleteBookAction = (id) => {
      formDelete.addEventListener("submit", (fd) => {
        fd.preventDefault();
        const indexBooks = findIndex(id.id);
        const idBooks = findId(id.id);

        if (idBooks == id) {
          console.log("DELETE BOOK : ", id.title, id.author, id.year);
          books.splice(indexBooks, 1);
          document.dispatchEvent(new Event(NOTIFY_DELETE));
          document.dispatchEvent(new Event(RENDER_CARD));
          saveDataToStorage();
          readStatusCounter();
          checkIsiData();

          deleteBookSection.setAttribute("hidden", "");
          inputDelete.value = "";
          btDelete.setAttribute("disabled", "");
          formBg.setAttribute("hidden", "");
        } else {
          return;
        }
      });
    };

    return bookId;
  }

  function validateForm() {
    addBook.forEach((btn) => {
      btn.addEventListener("click", () => {
        formAddBook.removeAttribute("hidden");
        formBg.removeAttribute("hidden");
      });
    });

    btCloseForm.forEach((btn) => {
      btn.addEventListener("click", () => {
        formAddBook.setAttribute("hidden", "");
        formBg.setAttribute("hidden", "");
        deleteBookSection.setAttribute("hidden", "");
        inputDelete.value = "";
        btDelete.setAttribute("disabled", "");
      });
    });

    formBg.addEventListener("click", () => {
      formAddBook.setAttribute("hidden", "");
      formBg.setAttribute("hidden", "");
      deleteBookSection.setAttribute("hidden", "");
      inputDelete.value = "";
      btDelete.setAttribute("disabled", "");
    });

    inputJudul.addEventListener("input", () => {
      const inputLength = inputJudul.value.length;
      const maxText = 50;
      const lengthLeft = maxText - inputLength;

      inputLength >= 1
        ? (lengthJudul.innerText = "Characters left : " + lengthLeft)
        : (lengthJudul.innerText = "");
      lengthLeft <= 10
        ? (lengthJudul.style.color = "red")
        : (lengthJudul.style.color = "");
      inputLength == maxText
        ? (lengthJudul.innerText = "Max characters reached")
        : "";

      checkInput();
    });

    inputPenulis.addEventListener("input", () => {
      const inputLength = inputPenulis.value.length;
      const maxText = 50;
      const lengthLeft = maxText - inputLength;

      inputLength >= 1
        ? (lengthPenulis.innerText = "Characters left : " + lengthLeft)
        : (lengthPenulis.innerText = "");
      lengthLeft <= 10
        ? (lengthPenulis.style.color = "red")
        : (lengthPenulis.style.color = "");
      inputLength == maxText
        ? (lengthPenulis.innerText = "Max characters reached")
        : "";

      checkInput();
    });

    inputTahun.addEventListener("input", () => {
      if (inputTahun.value / inputTahun.value !== 1) {
        inputTahun.classList.add("inputWarning");
      } else {
        inputTahun.removeAttribute("class");
      }

      checkInput();
    });

    checkInput = () => {
      if (
        inputJudul.value.length >= 1 &&
        inputPenulis.value.length >= 1 &&
        inputTahun.value.length == 4 &&
        inputTahun.value / inputTahun.value === 1
      ) {
        btSubmit.removeAttribute("disabled");
      } else {
        btSubmit.setAttribute("disabled", "");
      }
    };

    inputDelete.addEventListener("input", () => {
      if (inputDelete.value !== "DELETE" || inputDelete.value == "") {
        btDelete.setAttribute("disabled", "");
        return;
      } else {
        btDelete.removeAttribute("disabled");
      }
    });
  }

  function readStatusCounter() {
    const unreadBooksCount = document.querySelector("#unreadBooksCount"),
      readedBooksCount = document.querySelector("#readedBooksCount");

    let totalUnread = 0,
      totalReaded = 0;

    books.forEach((e) => {
      !e.isCompleted ? totalUnread++ : totalReaded++;
    });

    unreadBooksCount.innerText = totalUnread;
    readedBooksCount.innerText = totalReaded;

    if (checkStatusStorage()) {
      if (localStorage.getItem(UNREAD_KEY) == null) {
        localStorage.setItem(UNREAD_KEY, 0);
      }
      if (localStorage.getItem(READED_KEY) == null) {
        localStorage.setItem(READED_KEY, 0);
      }
      localStorage.setItem(UNREAD_KEY, totalUnread);
      localStorage.setItem(READED_KEY, totalReaded);
    }
  }

  function checkStatusStorage() {
    if (typeof Storage === undefined) {
      alert("Your browsers not support");
      return false;
    }
    return true;
  }

  if (checkStatusStorage()) {
    loadStorage();
    readStatusCounter();
  }

  function loadStorage() {
    const empty = document.querySelector("#emptyBooks");
    const data = localStorage.getItem(BOOKS_DATA);
    let parseData = JSON.parse(data);

    if (data !== null) {
      for (const booksList of parseData) {
        books.push(booksList);
      }
      empty.setAttribute("hidden", "");
    }

    checkIsiData();

    document.dispatchEvent(new Event(RENDER_CARD));
  }

  function saveDataToStorage() {
    if (checkStatusStorage()) {
      const parseData = JSON.stringify(books);
      localStorage.setItem("BOOKS_DATA", parseData);
      document.dispatchEvent(new Event(RENDER_CARD));
    }
  }

  function checkIsiData() {
    const emptySection = document.querySelector("#emptyBooks"),
      unreadBooksSection = document.querySelector(".unreadBooks"),
      readedBooksSection = document.querySelector(".readedBooks"),
      headerItem = document.querySelector("#headerItem");

    const data = localStorage.getItem(BOOKS_DATA);

    if (data === null || books.length <= 0) {
      emptySection.removeAttribute("hidden");
      unreadBooksSection.setAttribute("hidden", "");
      headerItem.style.display = "none";
      readedBooksSection.setAttribute("hidden", "");
    } else {
      emptySection.setAttribute("hidden", "");
      headerItem.style.display = "";
      unreadBooksSection.removeAttribute("hidden");
      readedBooksSection.removeAttribute("hidden");
    }
  }

  function searchBook() {
    const searchKeyword = inputSearch.value;
    let dataSearch = [];

    books.filter((a) => {
      if (a.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
        dataSearch.push(a);
      }
    });

    document.addEventListener(RENDER_SEARCH, () => {
      const unreadBooksList = document.querySelector("#unreadBooksList");
      unreadBooksList.innerHTML = "";
      const readedBooksList = document.querySelector("#readedBooksList");
      readedBooksList.innerHTML = "";

      for (const book of dataSearch) {
        const card = cardComponent(book);

        if (!book.isCompleted) {
          unreadBooksList.append(card);
        } else {
          readedBooksList.append(card);
        }
      }
    });

    const unreadBooksCount = document.querySelector("#unreadBooksCount"),
      readedBooksCount = document.querySelector("#readedBooksCount");

    let totalUnread = 0,
      totalReaded = 0;

    dataSearch.forEach((e) => {
      !e.isCompleted ? totalUnread++ : totalReaded++;
    });

    unreadBooksCount.innerText = totalUnread;
    readedBooksCount.innerText = totalReaded;

    document.dispatchEvent(new Event(RENDER_SEARCH));
  }
});
