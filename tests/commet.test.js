import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { userOne, commentOne, commentTwo, postOne, postTwo } from './utils/seedDatabase';
import { deleteComment, subscribeToComments } from './utils/operations';
import getClient from './utils/getClient';

const client = getClient();

jest.setTimeout(300000);

beforeEach(seedDatabase)

// test('Should delete own comment', async () => {
//     const client = getClient(userOne.jwt)

//     const variables = {
//         id: commentTwo.comment.id
//     }
//     await client.mutate({ mutation: deleteComment, variables })

//     const exists = await prisma.exists.Comment({ id: commentTwo.comment.id })
//     expect(exists).toBe(false);
// })

// test('Should not delete other user comment', async () => {
//     const client = getClient(userOne.jwt)

//     const variables = {
//         id: commentOne.comment.id
//     }

//     await expect(
//         client.mutate({ mutation: deleteComment, variables })
//     ).rejects.toThrow()

// })

test('should subscribe to comments for a post', async (done) => {
    const variables = {
        postId: postOne.post.id
    }
    // const client = getClient(userOne.jwt)
    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response) {
            // Assertions 
            // expect(1).toBe(2);
            expect(response.data.comment.mutation).toBe('DELETED');
            done()
        }
    })
    // change a comment
    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } })
})