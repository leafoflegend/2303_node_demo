import express from 'express';
import { faker } from '@faker-js/faker';
import chalk from 'chalk';

const PORT = 6969;

const posts = new Array(Math.ceil(Math.random() * 100)).fill('').map((p) => ({
    author: faker.person.fullName(),
    text: faker.lorem.paragraph(),
    id: faker.string.uuid(),
    postedOn: faker.date.past(),
}));

const app = express();

app.use(express.json());

app.get('/posts', (req, res, next) => {
    res.send({
        success: true,
        posts,
    });
});

app.get('/posts/:id', (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send({
            success: false,
            error: 'This route requires a valid id.',
        });
        return;
    }

    const post = posts.find((p) => {
        return p.id === id;
    });

    if (!post) {
        res.status(404).send({
            success: false,
            error: `${id} does not exist in my temporal database.`,
        });
        return;
    }

    res.status(200).send({
        success: true,
        post,
    });
});

app.post('/posts', (req, res, next) => {
    console.log(req.body);

    const { author, text } = req.body;

    if (author && text && typeof author === 'string' && typeof text === 'string') {
        const post = {
            author,
            text,
            id: faker.string.uuid(),
            postedOn: new Date(),
        };

        posts.push(post);

        res.status(201).send({
            success: true,
            id: post.id,
        });
    } else {
        res.status(400).send({
            success: false,
            error: 'This request requires two string values at keys "text" and "author". Please try again later.',
        });
    }
});

app.listen(6969, () => {
    console.log(chalk.green(`Server listening on PORT:${PORT}`));
});
