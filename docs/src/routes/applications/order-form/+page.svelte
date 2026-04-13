<script lang="ts">
	import {
		Card,
		Stack,
		Grid,
		GridItem,
		TextField,
		Textarea,
		Select,
		Option,
		Combobox,
		Autocomplete,
		NumberField,
		DatePicker,
		TimePicker,
		RadioGroup,
		Radio,
		Checkbox,
		Switch,
		Slider,
		InputFile,
		Button,
		Badge,
		Divider,
		Icon,
		Accordion,
		AccordionItem,
		toast
	} from "svelte-fluentui"

	type OrderType = "" | "mobile" | "hardware" | "software"
	type HardwareType = "" | "printer" | "computer" | "monitor"

	// ===== Requester =====
	let requesterName = $state("")
	let requesterEmail = $state("")
	let department = $state("")

	const departments = [
		{value: "eng", text: "Engineering"},
		{value: "sales", text: "Sales"},
		{value: "marketing", text: "Marketing"},
		{value: "finance", text: "Finance"},
		{value: "hr", text: "Human Resources"}
	]

	// ===== Order type (cascading trigger) =====
	let orderType = $state<OrderType>("")

	// ===== Mobile branch =====
	let mobileBrand = $state("")
	let mobileModel = $state<string[]>([])
	let mobileStorage = $state("128")
	let mobileColor = $state("black")
	let mobileBYOSim = $state(false)
	let mobileAccessories = $state<string[]>([])

	const mobileBrands = [
		{value: "apple", text: "Apple"},
		{value: "samsung", text: "Samsung"},
		{value: "google", text: "Google Pixel"},
		{value: "xiaomi", text: "Xiaomi"}
	]

	type ModelOption = {value: string; label: string}
	const mobileModelsByBrand: Record<string, ModelOption[]> = {
		apple: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Pro"].map(m => ({value: m, label: m})),
		samsung: ["Galaxy S24", "Galaxy S24 Ultra", "Galaxy Z Flip 6", "Galaxy Z Fold 6"].map(m => ({value: m, label: m})),
		google: ["Pixel 8", "Pixel 8 Pro", "Pixel 9", "Pixel 9 Pro"].map(m => ({value: m, label: m})),
		xiaomi: ["Mi 14", "Mi 14 Pro", "Redmi Note 13"].map(m => ({value: m, label: m}))
	}

	const availableMobileModels = $derived(mobileModelsByBrand[mobileBrand] ?? [])

	const mobileAccessoryOptions = [
		{value: "case", text: "Protective case"},
		{value: "screen-protector", text: "Screen protector"},
		{value: "charger", text: "Fast charger"},
		{value: "earbuds", text: "Wireless earbuds"},
		{value: "dock", text: "Charging dock"}
	]

	// ===== Hardware branch =====
	let hardwareType = $state<HardwareType>("")

	// Printer
	let printerType = $state("inkjet")
	let printerWireless = $state(true)
	let printerDuplex = $state(false)
	let printerFeatures = $state<string[]>([])

	const printerFeatureOptions = [
		{value: "scan", text: "Scan"},
		{value: "copy", text: "Copy"},
		{value: "fax", text: "Fax"},
		{value: "ocr", text: "OCR"},
		{value: "airprint", text: "AirPrint"}
	]

	// Computer
	let computerFormFactor = $state("laptop")
	let computerOS = $state("windows")
	let computerRam = $state("16")
	let computerStorage = $state("512")
	let computerBudget = $state("2000")

	const osOptions = [
		{value: "windows", text: "Windows 11"},
		{value: "macos", text: "macOS"},
		{value: "linux", text: "Linux (Ubuntu)"},
		{value: "chromeos", text: "ChromeOS"}
	]

	// Monitor
	let monitorSize = $state("27")
	let monitorResolution = $state("1440p")
	let monitorHDR = $state(false)
	let monitorRefreshRate = $state("60")

	// ===== Software branch =====
	let softwareApps = $state<string[]>([])
	let licenseStartDate = $state<Date | null>(null)
	let preferredInstallTime = $state<string | null>(null)

	const softwareOptions = [
		{value: "office365", text: "Microsoft 365"},
		{value: "adobe", text: "Adobe Creative Cloud"},
		{value: "jetbrains", text: "JetBrains All Products"},
		{value: "vscode", text: "Visual Studio Enterprise"},
		{value: "slack", text: "Slack Business+"},
		{value: "zoom", text: "Zoom Business"},
		{value: "notion", text: "Notion Team"},
		{value: "figma", text: "Figma Professional"},
		{value: "github", text: "GitHub Enterprise"},
		{value: "sentry", text: "Sentry Team"}
	]

	// ===== Common =====
	let neededBy = $state<Date | null>(null)
	let priority = $state(false)
	let urgency = $state<number>(2)
	let justification = $state("")
	let attachments = $state<File[]>([])
	let termsAccepted = $state(false)

	// ===== Derived =====
	const hasSelection = $derived(orderType !== "")
	const canSubmit = $derived(
		requesterName.trim().length > 0 &&
			requesterEmail.trim().length > 0 &&
			orderType !== "" &&
			termsAccepted
	)

	const urgencyLabel = $derived(
		["Low", "Normal", "High", "Urgent", "Critical"][Math.min(Math.max(urgency - 1, 0), 4)]
	)

	// ===== Submit =====
	function handleSubmit() {
		if (!canSubmit) {
			toast.error("Please fill required fields and accept the terms.")
			return
		}

		const payload = {
			requester: {name: requesterName, email: requesterEmail, department},
			orderType,
			mobile: orderType === "mobile" ? {mobileBrand, mobileModel, mobileStorage, mobileColor, mobileBYOSim, mobileAccessories} : undefined,
			hardware:
				orderType === "hardware"
					? {
							hardwareType,
							printer: hardwareType === "printer" ? {printerType, printerWireless, printerDuplex, printerFeatures} : undefined,
							computer: hardwareType === "computer" ? {computerFormFactor, computerOS, computerRam, computerStorage, computerBudget} : undefined,
							monitor: hardwareType === "monitor" ? {monitorSize, monitorResolution, monitorHDR, monitorRefreshRate} : undefined
						}
					: undefined,
			software: orderType === "software" ? {softwareApps, licenseStartDate, preferredInstallTime} : undefined,
			neededBy,
			priority,
			urgency,
			justification,
			attachmentCount: attachments.length,
			termsAccepted
		}

		console.log("Order submitted:", payload)
		toast.success(`Order submitted for ${requesterName} — ${orderType}`)
	}

	function handleReset() {
		requesterName = ""
		requesterEmail = ""
		department = ""
		orderType = ""
		mobileBrand = ""
		mobileModel = []
		mobileStorage = "128"
		mobileColor = "black"
		mobileBYOSim = false
		mobileAccessories = []
		hardwareType = ""
		printerType = "inkjet"
		printerWireless = true
		printerDuplex = false
		printerFeatures = []
		computerFormFactor = "laptop"
		computerOS = "windows"
		computerRam = "16"
		computerStorage = "512"
		computerBudget = "2000"
		monitorSize = "27"
		monitorResolution = "1440p"
		monitorHDR = false
		monitorRefreshRate = "60"
		softwareApps = []
		licenseStartDate = null
		preferredInstallTime = null
		neededBy = null
		priority = false
		urgency = 2
		justification = ""
		attachments = []
		termsAccepted = false
		toast.info("Form reset")
	}

	// Reset dependent model when brand changes
	$effect(() => {
		const current = mobileModel[0]
		if (mobileBrand && current && !availableMobileModels.some(m => m.value === current)) {
			mobileModel = []
		}
	})
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Order Form — New Hardware / Software Request</h1>

	<Card>
		<p>
			A cascading order form demonstrating how multiple form components work
			together in a real workflow. The form shape adapts to your choice: selecting
			<strong>Mobile</strong>, <strong>Hardware</strong>, or <strong>Software</strong>
			reveals a different set of fields, and some of those fields cascade further
			(e.g. picking <em>Computer</em> under Hardware reveals RAM / OS / budget
			options; picking a mobile brand narrows the available models).
		</p>
		<p>
			<strong>Components used:</strong>
			TextField · Textarea · Select · Option · Combobox · Autocomplete · NumberField ·
			DatePicker · TimePicker · RadioGroup · Radio · Checkbox · Switch · Slider ·
			InputFile · Button · Badge · Divider · Icon · Accordion · Toast service.
		</p>
	</Card>

	<!-- ========== Requester ========== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="person" size={20} /> Requester
			</h2>
			<Grid spacing={3}>
				<GridItem xs={12} md={4}>
					<TextField label="Full name" bind:value={requesterName} required placeholder="Jane Doe" />
				</GridItem>
				<GridItem xs={12} md={4}>
					<TextField label="Work email" bind:value={requesterEmail} type="email" required placeholder="jane.doe@acme.com" />
				</GridItem>
				<GridItem xs={12} md={4}>
					<Select label="Department" bind:value={department}>
						{#snippet children()}
							<Option value="">Select…</Option>
							{#each departments as d}
								<Option value={d.value}>{d.text}</Option>
							{/each}
						{/snippet}
					</Select>
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========== Order type ========== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="cart" size={20} /> What are you ordering?
			</h2>
			<RadioGroup bind:value={orderType} name="order-type" orientation="horizontal">
				<Radio value="mobile">Mobile phone</Radio>
				<Radio value="hardware">Hardware</Radio>
				<Radio value="software">Software / licenses</Radio>
			</RadioGroup>
		</Stack>
	</Card>

	<!-- ========== Cascading branches ========== -->
	{#if orderType === "mobile"}
		<Card>
			<Stack orientation="vertical" gap="0.75rem">
				<h2 style="margin: 0;">
					<Icon name="phone" size={20} /> Mobile phone details
					<Badge appearance="accent">Mobile</Badge>
				</h2>

				<Grid spacing={3}>
					<GridItem xs={12} md={6} lg={4}>
						<Select label="Brand" bind:value={mobileBrand}>
							{#snippet children()}
								<Option value="">Select brand…</Option>
								{#each mobileBrands as b}
									<Option value={b.value}>{b.text}</Option>
								{/each}
							{/snippet}
						</Select>
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<Combobox
							id="mobile-model"
							bind:value={mobileModel}
							options={availableMobileModels}
							label="Model"
							placeholder={mobileBrand ? "Pick or type model…" : "Select a brand first"}
							disabled={!mobileBrand}
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<NumberField
							bind:value={mobileStorage}
							label="Storage (GB)"
							min={64}
							max={1024}
							step={64}
						/>
					</GridItem>
				</Grid>

				<Divider />

				<Stack orientation="vertical" gap="0.5rem">
					<span class="fluent-label">Color</span>
					<RadioGroup bind:value={mobileColor} name="mobile-color" orientation="horizontal">
						<Radio value="black">Black</Radio>
						<Radio value="white">White</Radio>
						<Radio value="silver">Silver</Radio>
						<Radio value="gold">Gold</Radio>
						<Radio value="blue">Blue</Radio>
					</RadioGroup>
				</Stack>

				<Autocomplete
					label="Accessories"
					placeholder="Type or press Ctrl+Space to see all accessories"
					options={mobileAccessoryOptions}
					bind:selectedOptions={mobileAccessories}
				/>

				<Checkbox bind:checked={mobileBYOSim}>Bring your own SIM (no carrier activation needed)</Checkbox>
			</Stack>
		</Card>
	{/if}

	{#if orderType === "hardware"}
		<Card>
			<Stack orientation="vertical" gap="0.75rem">
				<h2 style="margin: 0;">
					<Icon name="desktop" size={20} /> Hardware details
					<Badge appearance="accent">Hardware</Badge>
				</h2>

				<Select label="Hardware type" bind:value={hardwareType}>
					{#snippet children()}
						<Option value="">Select type…</Option>
						<Option value="printer">Printer</Option>
						<Option value="computer">Computer</Option>
						<Option value="monitor">Monitor</Option>
					{/snippet}
				</Select>

				{#if hardwareType === "printer"}
					<Divider />
					<h3 style="margin: 0;">Printer</h3>
					<Grid spacing={3}>
						<GridItem xs={12} md={6}>
							<Stack orientation="vertical" gap="0.5rem">
								<span class="fluent-label">Printer type</span>
								<RadioGroup bind:value={printerType} name="printer-type" orientation="vertical">
									<Radio value="inkjet">Inkjet</Radio>
									<Radio value="laser">Laser</Radio>
									<Radio value="thermal">Thermal / label</Radio>
								</RadioGroup>
							</Stack>
						</GridItem>
						<GridItem xs={12} md={6}>
							<Stack orientation="vertical" gap="0.75rem">
								<Switch label="Wireless (Wi-Fi + AirPrint)" bind:checked={printerWireless} />
								<Switch label="Duplex (double-sided) printing" bind:checked={printerDuplex} />
							</Stack>
						</GridItem>
					</Grid>
					<Autocomplete
						label="Required features"
						placeholder="Pick features (Ctrl+Space for all)"
						options={printerFeatureOptions}
						bind:selectedOptions={printerFeatures}
					/>
				{/if}

				{#if hardwareType === "computer"}
					<Divider />
					<h3 style="margin: 0;">Computer</h3>
					<Grid spacing={3}>
						<GridItem xs={12} md={6} lg={4}>
							<Stack orientation="vertical" gap="0.5rem">
								<span class="fluent-label">Form factor</span>
								<RadioGroup bind:value={computerFormFactor} name="computer-ff" orientation="horizontal">
									<Radio value="laptop">Laptop</Radio>
									<Radio value="desktop">Desktop</Radio>
									<Radio value="workstation">Workstation</Radio>
								</RadioGroup>
							</Stack>
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<Select label="Operating system" bind:value={computerOS}>
								{#snippet children()}
									{#each osOptions as os}
										<Option value={os.value}>{os.text}</Option>
									{/each}
								{/snippet}
							</Select>
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<NumberField bind:value={computerRam} label="RAM (GB)" min={8} max={128} step={8} />
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<NumberField bind:value={computerStorage} label="Storage (GB)" min={256} max={4096} step={256} />
						</GridItem>
						<GridItem xs={12} md={6} lg={4}>
							<NumberField bind:value={computerBudget} label="Target budget ($)" min={800} max={6000} step={100} />
						</GridItem>
					</Grid>
				{/if}

				{#if hardwareType === "monitor"}
					<Divider />
					<h3 style="margin: 0;">Monitor</h3>
					<Grid spacing={3}>
						<GridItem xs={12} md={6} lg={3}>
							<NumberField bind:value={monitorSize} label="Diagonal (inches)" min={20} max={49} step={1} />
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<Select label="Resolution" bind:value={monitorResolution}>
								{#snippet children()}
									<Option value="1080p">Full HD (1080p)</Option>
									<Option value="1440p">QHD (1440p)</Option>
									<Option value="4k">4K UHD</Option>
									<Option value="5k">5K</Option>
								{/snippet}
							</Select>
						</GridItem>
						<GridItem xs={12} md={6} lg={3}>
							<NumberField bind:value={monitorRefreshRate} label="Refresh rate (Hz)" min={60} max={240} step={60} />
						</GridItem>
						<GridItem xs={12} md={6} lg={3} style="display: flex; align-items: flex-end;">
							<Checkbox bind:checked={monitorHDR}>HDR support</Checkbox>
						</GridItem>
					</Grid>
				{/if}
			</Stack>
		</Card>
	{/if}

	{#if orderType === "software"}
		<Card>
			<Stack orientation="vertical" gap="0.75rem">
				<h2 style="margin: 0;">
					<Icon name="apps" size={20} /> Software details
					<Badge appearance="accent">Software</Badge>
				</h2>

				<Autocomplete
					label="Applications / licenses"
					placeholder="Search or press Ctrl+Space for all"
					options={softwareOptions}
					bind:selectedOptions={softwareApps}
				/>

				<Grid spacing={3}>
					<GridItem xs={12} md={6}>
						<Stack orientation="vertical" gap="0.25rem">
							<span class="fluent-label">License start date</span>
							<DatePicker bind:value={licenseStartDate} />
						</Stack>
					</GridItem>
					<GridItem xs={12} md={6}>
						<Stack orientation="vertical" gap="0.25rem">
							<span class="fluent-label">Preferred install time</span>
							<TimePicker bind:value={preferredInstallTime} />
						</Stack>
					</GridItem>
				</Grid>
			</Stack>
		</Card>
	{/if}

	<!-- ========== Common (always visible after a type is chosen) ========== -->
	{#if hasSelection}
		<Card>
			<Stack orientation="vertical" gap="0.75rem">
				<h2 style="margin: 0;">
					<Icon name="clipboard" size={20} /> Scheduling &amp; justification
				</h2>

				<Grid spacing={3}>
					<GridItem xs={12} md={6} lg={4}>
						<Stack orientation="vertical" gap="0.25rem">
							<span class="fluent-label">Needed by</span>
							<DatePicker bind:value={neededBy} />
						</Stack>
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<Stack orientation="vertical" gap="0.5rem">
							<Switch label="Mark as priority" bind:checked={priority} />
							{#if priority}
								<Badge appearance="accent">Priority order</Badge>
							{/if}
						</Stack>
					</GridItem>
					<GridItem xs={12} md={12} lg={4}>
						<Slider
							bind:value={urgency}
							label="Urgency: {urgency} — {urgencyLabel}"
							min={1}
							max={5}
							step={1}
						/>
					</GridItem>
				</Grid>

				<Textarea
					bind:value={justification}
					label="Business justification"
					placeholder="Briefly explain why this order is needed…"
					rows={4}
				/>

				<Accordion>
					<AccordionItem>
						{#snippet heading()}
							<span><Icon name="attach" size={16} /> Attachments (quotes, approvals, specs)</span>
						{/snippet}
						<InputFile
							multiple
							accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
							onFileSelected={(files) => { attachments = files }}
						/>
						<small>Attached: {attachments.length} file(s)</small>
					</AccordionItem>
				</Accordion>

				<Divider />

				<Checkbox bind:checked={termsAccepted}>
					I confirm this order follows the company purchasing policy and has budget approval.
				</Checkbox>

				<Stack orientation="horizontal" gap="0.5rem">
					<Button appearance="accent" disabled={!canSubmit} onclick={handleSubmit}>
						<Icon name="send" size={16} /> Submit order
					</Button>
					<Button appearance="outline" onclick={handleReset}>
						<Icon name="dismiss" size={16} /> Reset
					</Button>
				</Stack>
			</Stack>
		</Card>
	{/if}
</Stack>
