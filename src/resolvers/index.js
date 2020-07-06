import { extractFragmentReplacements } from 'prisma-binding'
import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import User from './User';
import Post from './Post';
import Comment from './Comment';

const resolvers = {
    Query,
    Mutation,
    Subscription,
    Post,
    Comment,
    User
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { fragmentReplacements, resolvers } 