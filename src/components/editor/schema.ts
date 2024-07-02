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
					},
					{
						id: 'pattern',
						type: "text",
						label: "Pattern",
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
			type: "text",
			id: "title",
			label: "Form Title",
			required: true,
		},
		{
			type: "list",
			id: "schema",
			label: "Form Input",
			child: control(control(null)),
		},
	],
}