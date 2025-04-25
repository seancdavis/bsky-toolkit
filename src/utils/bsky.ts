import { AtpAgent } from '@atproto/api';

interface PostsOptions {
  limit?: number;
  cursor?: string;
}

// Set credentials directly in the utility file
const credentials = {
  identifier: import.meta.env.BSKY_USERNAME || '',
  password: import.meta.env.BSKY_PASSWORD || '',
};

export async function getUserPosts(options: PostsOptions = {}) {
  const agent = new AtpAgent({
    service: 'https://bsky.social',
  });

  try {
    // Check if credentials are provided
    if (!credentials.identifier || !credentials.password) {
      throw new Error('Bluesky credentials not provided');
    }

    // Log in and create a session
    await agent.login(credentials);

    // Get the user's DID
    const { data: profile } = await agent.getProfile({ actor: credentials.identifier });

    // Fetch user's posts
    const { data: timeline } = await agent.getAuthorFeed({
      actor: profile.did,
      limit: options.limit || 10,
      cursor: options.cursor,
    });

    return {
      posts: timeline.feed,
      cursor: timeline.cursor,
    };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
}
