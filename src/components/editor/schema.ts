export default {
	type: "group",
	children: [
		{
			type: "text",
			id: "title",
			label: "Form Title"
		},
		{
			type: "list",
			id: "schema",
			label: "Form Input",
			child: {
				type: "group",
				children: [
					{
						type: "option",
						id: "type",
						label: "Input Type",
						values: [
							{ value: 'text' },
							{ value: 'number' },
							{ value: 'option' },
							{ value: 'group' },
							{ value: 'list' },
						],
					},
					{
						type: "group",
						label: "Number Options",
						horizontal: true,
						if: "return value && value.type === 'number'",
						children: [
							{
								type: "number",
								label: "Min",
							},
							{
								type: "number",
								label: "Max",
							}
						]
					},
					{
						type: "group",
						label: "Select Options",
						horizontal: true,
						if: "return value && value.type === 'option'",
						children: [
							{
								type: "list",
								label: "Values",
								id: 'values',
								child: {
									type: 'text',
									id: 'value',
								}
							}
						]
					}
				],
			},
		},
	],
}