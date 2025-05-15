#!/usr/bin/env bash

declare -A components=(
	["AccordionItem"]="accordion-item"
	["Accordion"]="accordion"
	["AnchorButton"]="anchor-button"
	["Avatar"]="avatar"
	["Badge"]="badge"
	["Button"]="button"
	["Checkbox"]="checkbox"
	["Combobox"]="combobox"
	["CompoundButton"]="compound-button"
	["CounterBadge"]="counter-badge"
	["DialogBody"]="dialog-body"
	["Dialog"]="dialog"
	["Divider"]="divider"
	["DrawerBody"]="drawer-body"
	["Drawer"]="drawer"
	["Dropdown"]="dropdown"
	["Field"]="field"
	["Image"]="image"
	["Label"]="label"
	["Link"]="link"
	["Listbox"]="listbox"
	["MenuButton"]="menu-button"
	["MenuItem"]="menu-item"
	["MenuList"]="menu-list"
	["Menu"]="menu"
	["MessageBar"]="message-bar"
	["Option"]="option"
	["Patterns"]="patterns"
	["ProgressBar"]="progress-bar"
	["RadioGroup"]="radio-group"
	["Radio"]="radio"
	["RatingDisplay"]="rating-display"
	["Select"]="select"
	["Slider"]="slider"
	["Spinner"]="spinner"
	["SplitButton"]="split-button"
	["Styles"]="styles"
	["Switch"]="switch"
	["TabPanel"]="tab-panel"
	["Tab"]="tab"
	["Tablist"]="tablist"
	["Tabs"]="tabs"
	["TextInput"]="text-input"
	["Text"]="text"
	["Textarea"]="textarea"
	["ToggleButton"]="toggle-button"
	["Tooltip"]="tooltip"
	["TreeItem"]="tree-item"
	["Tree"]="tree"
)

for component in "${!components[@]}"
do

	path="$PWD/$component.svelte"
	if ! [ -f "$path" ]; then
		echo " * creating $component"

		lower_component="${components[$component]}"

		cat > $path <<-EOF
		<script lang="ts">
			import "@fluentui/web-components/$lower_component.js"

			interface IProps {

			}

			let {}: IProps = \$props()
		</script>

		<fluent-$lower_component>
			<!-- todo: finish $component -->
		</fluent-$lower_component>

		EOF
	else
		echo " - compoment $component already exists"
	fi
done
