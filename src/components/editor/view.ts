

const viewSchema = {
  type: 'group',
  children: [{
    type: 'group',
    horizontal: true,
    children: [
      {
        label: 'Route',
        id: 'route',
        type: 'text',
        required: true,
      },
      {
        type: "option",
        id: "privilenge",
        label: "Access Mode",
        values: [
          { value: "private" },
          { value: "internal" },
          { value: "public" },
        ],
        required: true,
      },
    ]
  }, {
    label: 'Title',
    id: 'title',
    type: 'text',
    required: true,
  },],
}

export default viewSchema;
