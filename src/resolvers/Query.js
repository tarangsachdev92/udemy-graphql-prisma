
import getUserId from '../utils/getUserId';

const Query = {

    // all have two arguments : 1st operational arugument and 2nd is selection set
    // for selection we have three option
    // nothing, string, object(info)

    // prisma.query.users(null, null)
    // if we provide null to the second arg it will return all scaler values(not objects and array)

    users(parent, args, { prisma }, info) {

        // return db.users.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
        };
        const { query } = args;
        // console.log(query);
        if (query) {
            opArgs.where = {
                OR: [{
                    name_contains: query
                }]
                // {
                //     email_contains: query
                // }
            }
        }
        return prisma.query.users(opArgs, info)
    },

    posts(parent, args, { prisma }, info) {
        // console.log(JSON.stringify(info.fieldNodes[0].selectionSet, undefined, 2));
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        };
        const { query } = args;

        if (query) {
            opArgs.where.OR = [{
                title_contains: query
            }, {
                body_contains: query
            }]
        }
        return prisma.query.posts(opArgs, info)
    },

    myPosts(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        };
        const { query } = args;

        if (query) {
            opArgs.where.OR = [{
                title_contains: query
            }, {
                body_contains: query
            }]
        }

        return prisma.query.posts(opArgs, info)
    },

    comments(parent, args, { prisma }, info) {

        const optArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }

        return prisma.query.comments(optArgs, info);
    },

    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)

        return prisma.query.user({
            where: {
                id: userId
            }
        })
        // }, info)
    },

    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{ published: true }, { author: { id: userId } }]
            }
        }, info)

        if (posts.length === 0) {
            throw new Error('Post not found')
        }
        return posts[0];
    }
}

export { Query as default }