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
						id: 'id',
						type: "hidden",
						variant: "id",
					},
					{
						type: "group",
						horizontal: true,
						children: [
							{
								type: "option",
								id: "type",
								values: [
									{ value: 'text' },
									{ value: 'number' },
									{ value: 'checkbox' },
									{ value: 'option' },
									{ value: 'group' },
									{ value: 'list' },
								],
								required: true,
							}, {
								type: "text",
								id: "label",
								placeholder: 'Label',
								required: true,
							}, {
								type: "checkbox",
								id: "required",
								label: "Required",
							}
						]
					},
					{
						type: "group",
						label: "Number Options",
						horizontal: true,
						if: "return value && value.type === 'text'",
						children: [
							{
								id: 'variant',
								type: "option",
								label: "Variant",
								required: true,
								values: [
									{ value: 'single-line' },
									{ value: 'multi-line' },
								]
							},
							{
								id: 'minlength',
								type: "number",
								label: "Min Length",
							},
							{
								id: 'maxlength',
								type: "number",
								label: "Max Length",
							}
						]
					},
					{
						type: "group",
						label: "Number Options",
						horizontal: true,
						if: "return value && value.type === 'number'",
						children: [
							{
								id: 'min',
								type: "number",
								label: "Min",
							},
							{
								id: 'max',
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