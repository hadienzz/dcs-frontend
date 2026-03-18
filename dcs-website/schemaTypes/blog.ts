export default {
  name: 'blog',
  type: 'document',
  title: 'Blog',
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
      name: 'youtubeUrl',
      type: 'url',
      title: 'YouTube URL',
      description:
        'Tempelkan tautan video YouTube (watch/share/shorts) untuk ditampilkan di halaman detail',
    },

    {
      name: 'documents',
      title: 'Dokumen (PDF)',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {accept: 'application/pdf'},
        },
      ],
      description: 'Unggah satu atau lebih dokumen PDF terkait berita ini',
    },

    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    },
    {
      name: 'categories',
      title: 'Categories',
      description: 'Pilih satu atau lebih kategori yang sudah dibuat di menu Category',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'category'}],
        },
      ],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (r: any) => r.required(),
    },
    {
      name: 'editor',
      title: 'Editor',
      type: 'reference',
      to: [{type: 'author'}],
    },
  ],
}
