import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Completed', value: 'Completed'},
          {title: 'Ongoing', value: 'Ongoing'},
        ],
      },
    }),
    defineField({name: 'beneficiaries', title: 'Beneficiaries', type: 'string'}),
    defineField({
      name: 'peopleHelped',
      title: 'Masyarakat Terbantu',
      type: 'number',
      description: 'Jumlah masyarakat yang terbantu oleh proyek ini',
      validation: (r) => r.min(0),
    }),
    defineField({name: 'sdgs', title: 'SDGs', type: 'array', of: [{type: 'number'}]}),
    defineField({
      name: 'startYear',
      title: 'Start Year',
      type: 'number',
      validation: (r) => r.min(1900).max(3000),
    }),
    defineField({
      name: 'endYear',
      title: 'End Year',
      type: 'number',
      validation: (r) => r.min(1900).max(3000),
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'locationsProvince',
      title: 'Locations (Provinces)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'province'}]}],
      description: 'Pilih satu atau lebih provinsi lokasi proyek',
    }),
    defineField({
      name: 'locationsText',
      title: 'Locations (Text)',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Opsional: kab/kota atau nama tempat spesifik (akan dicocokkan ke koordinat bawaan)',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'status', media: 'image'},
  },
})
