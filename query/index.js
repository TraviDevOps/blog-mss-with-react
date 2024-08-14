const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id/comments', (req, res) => {
    res.send(posts[req.params.id].comments || []);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

function handleEvent(type, data) {
    console.log(`Handling event of type ${type}`);
    switch (type) {
        case 'PostCreated': {
            const { id, title } = data;
            posts[id] = { id, title, comments: [] };
            break;
        }
        case 'CommentCreated': {
            const { id, content, postId, status } = data;
            const post = posts[postId];
            post.comments.push({ id, content, status });
            break;
        }
        case 'CommentUpdated': {
            const { id, content, postId, status } = data;
            const post = posts[postId];
            const comment = post.comments.find(comment => {
                return comment.id === id;
            })
            comment.status = status;
            comment.content = content;
            break;
        }
        default:
            break;
    }
}

app.listen(4002, async () => {
    console.log('Listening on 4002')

    const events = await axios.get(`${process.env.MESSAGE_BROKER_URL}/events`);

    for (let event of events.data) {
        handleEvent(event.type, event.data);
    }
});
