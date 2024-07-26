

const fileSchema = {
  type: 'group',
  children: [{
    label: 'File',
    id: 'file',
    type: 'file',
    required: true,
    multiple: true,
  },],
}

export default fileSchema;
