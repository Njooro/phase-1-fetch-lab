// function fetchBooks() {
//   // To pass the tests, don't forget to return your fetch!
  
// }

// function renderBooks(books) {
//   const main = document.querySelector('main');
//   books.forEach(book => {
//     const h2 = document.createElement('h2');
//     h2.innerHTML = book.name;
//     main.appendChild(h2);
//   });
// }

// document.addEventListener('DOMContentLoaded', function() {
//   fetchBooks();
// });

const chai = require('chai');
const chaiSpies = require('chai-spies');
chai.use(chaiSpies);

const { fetchBooks, renderBooks } = require('./index.js');
const { expect } = chai;

describe('index.js', () => {
  describe('fetchBooks()', () => {
    beforeEach(() => {
      global.window = {};
      global.document = {
        body: {
          innerHTML: '<main></main>'
        },
        querySelector: () => ({
          appendChild: () => {}
        })
      };
      global.fetch = require('node-fetch');
    });

    afterEach(() => {
      chai.spy.restore(global.window);
    });

    it("sends a fetch request to 'https://anapioficeandfire.com/api/books'", async () => {
      chai.spy.on(global, 'fetch');
      await fetchBooks();
      expect(global.fetch, "A fetch to the API was not found").to.have.been.called.with('https://anapioficeandfire.com/api/books');
    });

    it("renders book titles into the DOM by passing a JSON object to renderBooks()", async () => {
      const sampleBooks = [{ name: 'Book 1' }, { name: 'Book 2' }];
      chai.spy.on(global, 'renderBooks');
      await fetchBooks().then(() => {
        expect(global.renderBooks).to.have.been.called.with(sampleBooks);
      });
    });
  });
});

async function fetchBooks() {
  const response = await fetch('https://anapioficeandfire.com/api/books');
  const data = await response.json();
  renderBooks(data);
  return data;
}

function renderBooks(books) {
  const main = document.querySelector('main');
  books.forEach((book) => {
    const h2 = document.createElement('h2');
    h2.innerHTML = book.name;
    main.appendChild(h2);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  fetchBooks();
});
