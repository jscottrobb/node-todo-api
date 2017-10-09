const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');

const {ObjectID} = require('mongodb');

const todoData = [{
  text: 'First todo',
  _id: new ObjectID()
},{
  text: 'Second todo',
  _id: new ObjectID()
},{
  text: 'Third todo',
  _id: new ObjectID()
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
      expect(res.body.todos.length).toBe(3);
      expect(res.body.todos[0].text).toBe('First todo');
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return a todo with an id', (done) => {
    var id = todoData[0]._id.toHexString();

    request(app)
    .get('/todos/'+id)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todoData[0].text);
      expect(res.body.todo._id).toBe(id);
    })
    .end(done);
  });

  it('Should fail id validation with todo not found', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });

  it('Should fail with different valid todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  });
});

describe('Delete /todos/:id', () => {
  it('Should delete and return a todo with an id', (done) => {
    var id = todoData[0]._id.toHexString();

    request(app)
    .delete('/todos/'+id)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todoData[0].text);
      expect(res.body.todo._id).toBe(id);
    }).end((err, res) => {
      if (err) {
        return done(err);
      }

      ToDo.findById(id).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((err) => done(err));
  });
});

  it('Should fail id validation for delete with todo not found', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });

  it('Should fail delete with different valid todo not found', (done) => {
    var id = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);
  });
});
