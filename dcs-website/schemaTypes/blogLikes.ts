export default {
  name: 'blogLikes',
  type: 'document',
  title: 'Blog Likes',
  fields: [
    {
      name: 'blog',
      type: 'reference',
      to: [{type: 'blog'}],
      title: 'Blog Post',
      validation: (r: any) => r.required(),
    },
    {
      name: 'count',
      type: 'number',
      title: 'Total Likes',
      initialValue: 0,
    },
    {
      name: 'users',
      type: 'array',
      title: 'Users Who Liked',
      of: [{type: 'string'}],
      description: 'Array of usernames who liked this blog',
    },
  ],
}
