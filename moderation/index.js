const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = moderateComment(data.content);

        await axios.post(process.env.EVENT_BUS_URL, {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                content: data.content,
                status
            }
        });
    }

    res.send({});
});

const moderateComment = (content) => {
    return content.includes('orange') ? 'rejected' : 'approved';
}

app.listen(4003, () => {
    console.log('Listening in port 4003')
})