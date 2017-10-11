const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');
const {User} = require('./../models/user');

const {ObjectID} = require('mongodb');

const {populateTodos,populateUsers,userData,todoData} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos/:id tests', () => {
  it('Should update a todo and set completed to true', (done) => {
    var id = todoData[2]._id;
    todoData[2].text = "Third todo test";
    request(app)
    .patch(`/todos/${id}`)
    .send(todoData[2])
    .expect(200)
    .expect((res) => {
      console.log(res.body.todo.text);
      expect(res.body.todo.text).toBe(todoData[2].text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toNotBe(null);
      expect(res.body.todo._id).toBe(id.toHexString());
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
    });
    done();
  });

  it('Should update and clear completedAt', (done) => {
    var id = todoData[0]._id;
    todoData[0].text = 'First todo test';
    request(app)
    .patch(`/todos/${todoData[0]._id}`)
    .send(todoData[0])
    .expect(200)
    .expect((res) => {
       expect(res.body.todo.text).toBe(todoData[0].text);
       expect(res.body.todo.completed).toBe(false);
       expect(res.body.todo.completedAt).toNotExist();
       expect(res.body.todo._id).toBe(id.toHexString());
     })
     .end((err, res) => {
       if (err) {
         return done(err);
       }
     });
     done();
  });
});

describe('/users/me authentication', () => {
  it('Should authenticate the user',(done) => {
    request(app)
    .get('/users/me')
    .set('x-auth',userData[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(userData[0].email);
      expect(res.body._id).toBe(userData[0]._id.toHexString());
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
    });
    done();
  });

  it('Should fail authentication with no token', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
    });
    done();
  });
});

describe('POST /users', () => {
  it('Should post a valid user',(done) => {
    var email = 'jrobb3333@gmail.com';
    var password = '123abc!!!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(email);
      expect(res.body._id).toExist();
      expect(res.headers['x-auth']).toExist();
    })
    .end((err) => {
      if(err) {
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });

  it('Should fail with an invalid password and email', (done) => {
    var email = '123';
    var password = '123!';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('Should fail with duplicate email', (done) => {
    var email = userData[0].email;
    var password = userData[0].password;
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });
});
