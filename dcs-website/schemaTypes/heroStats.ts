export default {
  name: 'heroStats',
  type: 'document',
  title: 'Hero Stats',
  fields: [
    {
      name: 'items',
      type: 'array',
      title: 'Stats Items',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'numberText',
              type: 'string',
              title: 'Number',
              description: 'Display text for the number (e.g., 50+, 1,000+)',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'Short label (e.g., SDG Goals)',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              type: 'string',
              title: 'Description',
              description: 'Small helper text (optional)',
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'numberText',
            },
          },
        },
      ],
    },
  ],
}
