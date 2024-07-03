function control(child: any) {
	return {
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
							{ value: 'time' },
							{ value: 'file' },
							child ? { value: 'group' } : null,
							child ? { value: 'list' } : null,
						].filter(x => x),
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
				label: "Text Options",
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
							{ value: 'numeric' },
							{ value: 'email' },
							{ value: 'tel' },
							{ value: 'url' },
						]
					},
					{
						type: "group",
						if: "return value && value.variant !== 'multi-line'",
						children: [
							{
								id: 'pattern',
								type: "text",
								label: "Pattern",
							}
						]
					},
					{
						type: "group",
						if: "return value && value.variant === 'multi-line'",
						children: [
							{
								id: 'maxlength',
								type: "number",
								label: "Max Length",
							}
						]
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
					},
					{
						id: 'step',
						type: "number",
						label: "Step",
					}
				]
			},
			{
				type: "group",
				label: "Select Options",
				if: "return value && value.type === 'option'",
				children: [
					{
						type: "option",
						label: "Variant",
						id: 'variant',
						values: [
							{ value: 'single-select' },
							{ value: 'multi-select' },
							{ value: 'radio' },
							{ value: 'checkbox' },
						]
					},
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
			},
			{
				type: "group",
				label: "Time Options",
				horizontal: true,
				if: "return value && value.type === 'time'",
				children: [
					{
						type: "option",
						id: "variant",
						values: [
							{ value: 'time' },
							{ value: 'date' },
							{ value: 'date-time' },
							{ value: 'year-month' },
							{ value: 'week' },
						],
						required: true,
					}
				]
			},
			{
				type: "group",
				label: "File Options",
				horizontal: true,
				if: "return value && value.type === 'file'",
				children: [
					{
						type: "option",
						id: "accept",
						values: [
							{ "value": "all" },
							{ "value": "audio" },
							{ "value": "video" },
							{ "value": "image" },
							{ "value": "pdf" },
							{ "value": "zip" },
							{ "value": "text" },
							{ "value": "word" },
							{ "value": "sheet" },
							{ "value": "slides" }
						],
						required: true,
					},
					{
						type: 'checkbox',
						id: 'multiple',
						label: 'Multiple files',
					}
				]
			},
			{
				type: "group",
				label: "Group Options",
				horizontal: true,
				if: "return value && value.type === 'group'",
				children: [
					{
						type: "list",
						label: "Group Items",
						id: "children",
						child,
					}
				],
			},
			{
				id: 'child',
				type: "group",
				label: "List Options",
				horizontal: true,
				if: "return value && value.type === 'list'",
				children: child ? [
					child,
				] : [],
			}
		],
	}
}
export default {
	type: "group",
	children: [
		{
			type: "group",
			horizontal: true,
			children: [
				{
					type: "text",
					id: "title",
					label: "Form Title",
					required: true,
				},
				{
					type: "option",
					id: "privilenge",
					label: "Access Mode",
					values: [
						{ value: 'private' },
						{ value: 'internal' },
						{ value: 'open' },
						{ value: 'public' }
					],
					required: true,
				},
			],
		},
		{
			type: "list",
			id: "schema",
			label: "Form Input",
			child: control(control(null)),
		},
	],
}