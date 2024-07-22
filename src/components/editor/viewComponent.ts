
const viewComponentSchema = {
  type: 'group',
  children: [
    {
      label: 'Identifier',
      id: 'identifier',
      type: 'text',
      required: true,
    },
    {
      label: 'Title',
      id: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default viewComponentSchema;
