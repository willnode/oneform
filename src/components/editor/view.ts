

const viewSchema = {
    type: 'group',
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
    ],
}

export default viewSchema;
