const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

const todoData = [{
  text: 'First todo'
},{
  text: 'Second todo'
},{
  text: 'Third todo'
}];

beforeEach((done) => {
  ToDo.remove({}).then(() => {
     ToDo.insertMany(todoData);
  }).then(() => done());
});

describe('POST /todos tests', () => {
  it('Should post a new todo', (done) => {
    var text = 'Test text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ToDo.find({text}).then((res) => {
          if (err) {
            return done(err);
          }
          expect(res.length).toBe(1);
          expect(res[0].text).toBe(text);
          done();
        })
        .catch((e) => done(e));
      });
  });

  it('Should fail because todo is invalid', (done) => {
    request(app)
      .post('/todos')
      .send({text: ''})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ToDo.find().then((res) => {
          if (err) {
            return done(err);
          }
          expect(res.length).toBe(3);
          done();
        })
        .catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.docs.length).toBe(3);
      expect(res.body.docs[0].text).toBe('First todo');
    })
    .end(done);
  });

});
