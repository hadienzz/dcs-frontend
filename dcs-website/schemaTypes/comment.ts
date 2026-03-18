export default {
  name: 'comment',
  type: 'document',
  title: 'Comment',
  fields: [
    {
      name: 'text',
      type: 'text',
      title: 'Comment Text',
      validation: (r: any) => r.required(),
    },
    {
      name: 'username',
      type: 'string',
      title: 'Username',
      validation: (r: any) => r.required(),
    },
    {
      name: 'blog',
      type: 'reference',
      to: [{type: 'blog'}],
      title: 'Blog Post',
      validation: (r: any) => r.required(),
    },
    {
      name: 'likes',
      type: 'number',
      title: 'Likes',
      initialValue: 0,
    },
    {
      name: 'likedBy',
      type: 'array',
      title: 'Liked By',
      of: [{type: 'string'}],
      description: 'Array of usernames who liked this comment',
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      initialValue: () => new Date().toISOString(),
    },
  ],
  orderings: [
    {
      title: 'Created At, Newest',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
  ],
}
