export default {
  name: 'expert',
  type: 'document',
  title: 'Expert',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'name'},
    },
    {
      name: 'image',
      type: 'image',
      title: 'Photo',
      options: {hotspot: true},
    },
    {
      name: 'expertise',
      type: 'array',
      title: 'Expertise',
      of: [{type: 'string'}],
    },
    {
      name: 'sdgNumbers',
      type: 'array',
      title: 'SDG Numbers',
      of: [{type: 'number'}],
      description: 'List of SDG numbers related to this expert (e.g., 4, 9, 17)',
    },
    {
      name: 'position',
      type: 'string',
      title: 'Position/Title',
    },
    {
      name: 'bio',
      type: 'text',
      title: 'Short Bio',
    },
  ],
}
