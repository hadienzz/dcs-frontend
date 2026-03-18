export default {
  name: 'products',
  type: 'document',
  title: 'Products',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of the Blog Post',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug for the Blog Post',
      options: {
        source: 'title',
      },
    },
    {
      name: 'titleImage',
      type: 'image',
      title: 'Title Image',
    },
    {
      name: 'smallDescription',
      type: 'text',
      title: 'Small Description',
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{type: 'block'}],
    },

    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    },
    {
      name: 'categories',
      type: 'string',
      title: 'Categories',
      options: {
        list: [
          {title: 'Program', value: 'program'},
          {title: 'Kompetisi', value: 'kompetisi'},
        ],
      },
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{type: 'string'}],
    },
    {
      name: 'sdgTags',
      type: 'array',
      title: 'SDG Tags',
      of: [{type: 'string'}],
    },
  ],
}
