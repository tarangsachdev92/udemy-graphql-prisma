import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: 'John',
        email: 'john@example.com',
        password: bcrypt.hashSync('John@123')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'James',
        email: 'james@example.com',
        password: bcrypt.hashSync('James@123')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'My Published Post',
        body: '',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'My Drafted Post',
        body: '',
        published: false,
    },
    post: undefined
}

const commentOne = {
    input: {
        text: "Great post. Thanks for sharing it."
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: "I am glad you enjoyed it."
    },
    comment: undefined
}

const seedDatabase = async () => {
    // delete test data
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();

    // Create user one 
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    // Create user two

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // create post one
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // create post two
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    // create comment one
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userTwo.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

    // create comment one
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            },
            post: {
                connect: {
                    id: postOne.post.id
                }
            }
        }
    })

}

export { seedDatabase as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo };