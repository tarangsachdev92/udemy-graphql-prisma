// import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';
import getUserId from '../utils/getUserId'

// Enum 
// 1. It is the special type that defines the constants
// 2. This type can than be used as the type for field (similar to scaler and custom object types)
// 3. Values for the field must be one of the constants for the type 

// User role - standart, editor, admin

// type User { 
//    role : UserRole!
// }

// laptop.isOn - true / false
// laptop.powerStatus - on - off - sleep


// Take in password -> validate password -> Hash password -> Generate auth token
// JSON Web Token (JWT)

// const token = jwt.sign({ id: 46 }, 'mybestguess')
// console.log(token);

// const decoded = jwt.decode(token);
// console.log(decoded)

// const decoded2 = jwt.verify(token, 'mybestguess')
// console.log(decoded2)

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        // const emailTaken = await prisma.exists.User({ email: args.data.email });

        // if (emailTaken) {
        //     throw new Error('Email Taken.')
        // }

        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
            // }, info)
        })

        return { user, token: generateToken(user.id) }
    },

    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('Unable to login');
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login');
        }
        return { user, token: generateToken(user.id) }
    },

    deleteUser(parent, args, { prisma, request }, info) {
        // const userExists = await prisma.exists.User({ id: args.id })

        // if (!userExists) {
        //     throw new Error('User not found!.')
        // }
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({ where: { id: userId } }, info)
    },

    async updateUser(parent, args, { prisma, request }, info) {
        // const userExists = await prisma.exists.User({ id: args.id })

        // if (!userExists) {
        //     throw new Error('User not found!.')
        // }
        const userId = getUserId(request);

        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data: args.data
        }, info)
    },

    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        // console.log(userId)
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: { id: userId }
                }
            }
        }, info)
    },

    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!postExists) {
            throw new Error('Unable to delete post')
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id,
                // author: {
                //     id: userId
                // }
            }
        }, info)
    },

    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        const isPublished = await prisma.exists.Post({ id: args.id, published: true });
        // is published and we are un publishing our post->we delete the comments fot that post

        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        if (!postExists) {
            throw new Error('Unable to update post')
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },

    async createComment(parent, args, { prisma, request }, info) {

        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if (!postExists) {
            throw new Error('Unable to find post')
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },

    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to delete comment')
        }

        return prisma.mutation.deleteComment({ where: { id: args.id } }, info)
    },

    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        })

        if (!commentExists) {
            throw new Error('Unable to update comment')
        }

        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }