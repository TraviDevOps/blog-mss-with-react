const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(bodyParser.json());
app.use(cors());

// this will act as our database in this example
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');

    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: 'pending' })

    commentsByPostId[req.params.id] = comments;

    await axios.post(`${process.env.MESSAGE_BROKER_URL}/events`, {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending',
        }
    }).catch((err) => {
        console.log(err.message);
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    switch (type) {
        case 'CommentModerated': {
            const { postId, id, status, content } = data;

            const comments = commentsByPostId[postId];

            const comment = comments.find(comment => {
                return comment.id === id;
            });
            comment.status = status;

            await axios.post(process.env.MESSAGE_BROKER_URL, {
                type: 'CommentUpdated',
                data: {
                    id,
                    postId,
                    status,
                    content
                }
            }).catch((err) => {
                console.log(err.message);
            });
            break;
        }
        default:
            break;
    }

    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on 4001');
});