class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    };
}

class UI {
    constructor() {}

    validateInput(book) {
        if (book.title !== "" && book.author !== "" && book.isbn !== "") {
            this.addToBookList(book);
            this.showMSG("success", `Book added`);
            this.addToLocalStorage(book);

        } else {
            this.showMSG("error", `Please fill in the fields`);
        }
    }
    addToBookList(book) {
        const row = document.createElement("tr");

        row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>`;

        const tableBody = document.getElementById('tableBody');
        tableBody.appendChild(row);

    }
    addToLocalStorage(book) {
        //I'm going to add here to LS
        const ls = new LocalStorage();
        ls.addBookToLS(book);
    }
    showMSG(type, msg) {
        const successMsg = document.querySelector('.success');
        const errorMsg = document.querySelector('.error');

        if (type === "success") {
            successMsg.style.display = "block";
            successMsg.innerHTML = msg;
        } else {
            errorMsg.style.display = "block";
            errorMsg.innerHTML = msg;
        }
        setTimeout(function () {
            successMsg.style.display = "none";
            errorMsg.style.display = "none";
        }, 2000);
    }
    clearFields() {
        document.getElementById('bookTitle').value = "";
        document.getElementById('author').value = "";
        document.getElementById('isbn').value = "";
    }
    deleteRow(eTarget) {
        eTarget.parentElement.parentElement.remove(); //hitting the tr element wrapping it 
        this.showMSG("success", "Book removed!");
        const tRow = eTarget.parentElement.parentElement;
        const bookISBN = tRow.children[2].textContent;
        //NOW remove book from LS
        lsInstance.removeBookFromLS(bookISBN);

    }


}

//Local Storage Class
class LocalStorage {
    constructor() {}

    getBooksFromLS() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    addBookToLS(book) {
        let books = this.getBooksFromLS();
        books.push(book);
        //Send this books array again to LS 
        localStorage.setItem('books', JSON.stringify(books));
    }

    onPageLoadShowLS() {
        const ui = new UI();
        let books = this.getBooksFromLS();
        for (let i = 0; i < books.length; i++) {
            // console.log(books[i]);
            ui.addToBookList(books[i]);
        }
    }

    removeBookFromLS(bookISBN) {

        let books = this.getBooksFromLS();
        for (let i = 0; i < books.length; i++) {
            if (books[i].isbn === bookISBN) {
                console.log("Delete book");
                books.splice(i, 1);
            }
        }
        //Return it back to Local Storge
        localStorage.setItem('books', JSON.stringify(books));
    }

}


// //on page load show Local Storage Data
const lsInstance = new LocalStorage();
document.addEventListener('DOMContentLoaded', lsInstance.onPageLoadShowLS());

const form = document.forms[0];
form.addEventListener('submit', addToBookList);
//UI class validates input fields first and then shows a message which disappears after 2 seconds
const ui = new UI();

function addToBookList(e) {
    const title = document.getElementById('bookTitle');
    const author = document.getElementById('author');
    const isbn = document.getElementById('isbn');
    const book = new Book(title.value, author.value, isbn.value);
    ui.validateInput(book);
    //Now we clear input fields
    ui.clearFields();
    e.preventDefault();
}
document.body.addEventListener('click', function (e) {
    if (e.target.className === "delete") {
        ui.deleteRow(e.target);
    }
});