import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'province',
  title: 'Province',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-'),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      description: 'Latitude of the province centroid',
      validation: (r) => r.required().min(-90).max(90),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      description: 'Longitude of the province centroid',
      validation: (r) => r.required().min(-180).max(180),
    }),
    defineField({
      name: 'aliases',
      title: 'Aliases',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Alternative names or abbreviations (e.g., DKI Jakarta, Jakarta)',
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
