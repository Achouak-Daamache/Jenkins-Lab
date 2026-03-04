import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js'; // Note the .js extension
const { expect } = chai;

chai.use(chaiHttp);

describe('Books API', () => {
  it('should GET all books', (done) => {
    chai.request(app)
      .get('/books')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(3);
        done();
      });
  });

  it('should GET a book by id', (done) => {
    chai.request(app)
      .get('/books/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('title', 'The Great Gatsby');
        done();
      });
  });

  it('should return 404 for a book that does not exist', (done) => {
    chai.request(app)
      .get('/books/999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should POST a new book', (done) => {
    chai.request(app)
      .post('/books')
      .send({ title: 'New Book', author: 'New Author' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'New Book');
        expect(res.body).to.have.property('author', 'New Author');
        done();
      });
  });

  it('should PUT to update a book', (done) => {
    chai.request(app)
      .put('/books/1')
      .send({ title: 'Updated Title' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('title', 'Updated Title');
        done();
      });
  });

  it('should DELETE a book by id', (done) => {
    chai.request(app)
      .delete('/books/1')
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});
