<script lang="ts">
	import {
		Card,
		Stack,
		Grid,
		GridItem,
		TextField,
		NumberField,
		Select,
		Option,
		Checkbox,
		Button,
		Badge,
		Divider,
		Icon,
		toast
	} from "svelte-fluentui"

	// ============================================================
	// Tiny composable validation helpers
	// (small enough to copy-paste into your own project)
	// ============================================================
	type Validator<T> = (value: T) => string | null

	const required =
		(msg = "Required"): Validator<unknown> =>
		(v) =>
			v === null || v === undefined || v === "" ? msg : null
	const minLength =
		(n: number, msg?: string): Validator<string> =>
		(v) =>
			(v ?? "").length < n ? (msg ?? `Must be at least ${n} characters`) : null
	const pattern =
		(re: RegExp, msg = "Invalid format"): Validator<string> =>
		(v) =>
			v && !re.test(v) ? msg : null
	const numberRange =
		(min: number, max: number, msg?: string): Validator<number> =>
		(v) =>
			v < min || v > max ? (msg ?? `Must be between ${min} and ${max}`) : null

	function runValidators<T>(value: T, ...validators: Validator<T>[]): string | null {
		for (const v of validators) {
			const r = v(value)
			if (r) return r
		}
		return null
	}

	const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	const phoneRe = /^\+?[\d\s\-()]{7,}$/

	// ============================================================
	// 1) Sign-up form — required, format, cross-field, terms gate
	// ============================================================
	let su = $state({
		email: "",
		password: "",
		confirmPassword: "",
		acceptTerms: false
	})
	let suTouched = $state<Record<string, boolean>>({})
	let suSubmitted = $state(false)

	const suErrors = $derived({
		email: runValidators(
			su.email,
			required("Email is required"),
			pattern(emailRe, "Enter a valid email address")
		),
		password: runValidators(
			su.password,
			required("Password is required"),
			minLength(8, "Password must be at least 8 characters"),
			pattern(/\d/, "Password must contain at least one digit")
		),
		confirmPassword:
			runValidators(su.confirmPassword, required("Confirm your password")) ??
			(su.confirmPassword !== su.password ? "Passwords do not match" : null),
		acceptTerms: su.acceptTerms ? null : "You must accept the terms"
	})
	const suIsValid = $derived(Object.values(suErrors).every((e) => e === null))

	function suErr(field: keyof typeof suErrors): string | null {
		if (!suSubmitted && !suTouched[field as string]) return null
		return suErrors[field] ?? null
	}
	function suTouch(field: keyof typeof suErrors) {
		suTouched[field as string] = true
	}
	function onSuSubmit() {
		suSubmitted = true
		if (!suIsValid) {
			toast.error("Please correct the highlighted fields.")
			return
		}
		toast.success(`Welcome, ${su.email}!`)
	}
	function onSuReset() {
		su = {email: "", password: "", confirmPassword: "", acceptTerms: false}
		suTouched = {}
		suSubmitted = false
		toast.info("Form reset")
	}

	// ============================================================
	// 2) Numeric range + custom rule (must be even)
	// ============================================================
	let age = $state("")
	let quantity = $state("")
	let numTouched = $state<Record<string, boolean>>({})

	const ageError = $derived(
		age === ""
			? "Age is required"
			: runValidators<number>(Number(age), numberRange(18, 120, "Age must be between 18 and 120"))
	)
	const quantityError = $derived(
		quantity === ""
			? "Quantity is required"
			: Number(quantity) <= 0
				? "Quantity must be positive"
				: Number(quantity) % 2 !== 0
					? "Quantity must be an even number"
					: null
	)

	function ageErr() {
		return numTouched.age ? ageError : null
	}
	function quantityErr() {
		return numTouched.quantity ? quantityError : null
	}

	// ============================================================
	// 3) Async validation — username availability check (debounced)
	// ============================================================
	let username = $state("")
	let usernameStatus = $state<"idle" | "checking" | "valid" | "invalid">("idle")
	let usernameError = $state<string | null>(null)

	const reservedNames = ["admin", "root", "system", "test", "anonymous"]

	$effect(() => {
		const v = username.trim()

		if (v === "") {
			usernameStatus = "idle"
			usernameError = null
			return
		}
		if (v.length < 3) {
			usernameStatus = "invalid"
			usernameError = "Username must be at least 3 characters"
			return
		}
		if (!/^[a-zA-Z0-9_]+$/.test(v)) {
			usernameStatus = "invalid"
			usernameError = "Only letters, digits, and underscore allowed"
			return
		}

		usernameStatus = "checking"
		usernameError = null
		const handle = setTimeout(() => {
			if (reservedNames.includes(v.toLowerCase())) {
				usernameStatus = "invalid"
				usernameError = `"${v}" is already taken`
			} else {
				usernameStatus = "valid"
				usernameError = null
			}
		}, 600)

		return () => clearTimeout(handle)
	})

	// ============================================================
	// 4) Conditional required — Department + "Other (specify)"
	// ============================================================
	let department = $state("")
	let otherDepartment = $state("")
	let condTouched = $state<Record<string, boolean>>({})
	let condSubmitted = $state(false)

	const deptError = $derived(department === "" ? "Department is required" : null)
	const otherDeptError = $derived(
		department === "other" && otherDepartment.trim() === ""
			? "Please specify your department"
			: null
	)

	function deptErr() {
		return condSubmitted || condTouched.department ? deptError : null
	}
	function otherDeptErr() {
		return condSubmitted || condTouched.otherDepartment ? otherDeptError : null
	}
	function onCondSubmit() {
		condSubmitted = true
		if (!deptError && !otherDeptError) {
			toast.success(
				`Saved: ${department === "other" ? otherDepartment : department}`
			)
		}
	}

	// ============================================================
	// 5) Submit-time summary — error list at the top + jump-to-field
	// ============================================================
	type SummaryValues = {
		fullName: string
		email: string
		phone: string
		age: string
	}
	let sm = $state<SummaryValues>({fullName: "", email: "", phone: "", age: ""})
	let smErrors = $state<Record<string, string>>({})
	const smFieldLabels: Record<string, string> = {
		fullName: "Full name",
		email: "Email",
		phone: "Phone",
		age: "Age"
	}

	function validateSummaryForm(): Record<string, string> {
		const errs: Record<string, string> = {}
		if (!sm.fullName.trim()) errs.fullName = "Full name is required"
		if (!sm.email.trim()) errs.email = "Email is required"
		else if (!emailRe.test(sm.email)) errs.email = "Enter a valid email"
		if (!sm.phone.trim()) errs.phone = "Phone is required"
		else if (!phoneRe.test(sm.phone)) errs.phone = "Enter a valid phone number"
		if (!sm.age) errs.age = "Age is required"
		else if (Number(sm.age) < 18) errs.age = "Must be 18 or older"
		return errs
	}

	function onSmSubmit() {
		smErrors = validateSummaryForm()
		const count = Object.keys(smErrors).length
		if (count === 0) {
			toast.success("Form submitted successfully")
			return
		}
		toast.error(`${count} field${count > 1 ? "s" : ""} need attention`)
		smJumpTo(Object.keys(smErrors)[0])
	}
	function smJumpTo(field: string) {
		const wrapper = document.getElementById(`sm-${field}`)
		if (!wrapper) return
		wrapper.scrollIntoView({behavior: "smooth", block: "center"})
		// Focus the underlying fluent-* host (which delegates focus to the input)
		const focusTarget = wrapper.querySelector(
			"fluent-text-field, fluent-number-field"
		) as (HTMLElement & {focus?: () => void}) | null
		focusTarget?.focus?.()
	}
	function onSmReset() {
		sm = {fullName: "", email: "", phone: "", age: ""}
		smErrors = {}
	}
</script>

<Stack orientation="vertical" gap="1rem">
	<h1>Form Validation</h1>

	<Card>
		<p>
			Common validation patterns implemented with the svelte-fluentui form components.
			None of the FluentUI form wrappers ship with a built-in error slot, so the recommended
			pattern is to render errors externally as a small message below the field and toggle
			visibility based on <em>touched</em> (after blur) or <em>submitted</em> state.
		</p>
		<p>
			<strong>Patterns covered:</strong> required &amp; format · cross-field
			(passwords match) · numeric range · async availability check ·
			conditional required · submit-time summary with jump-to-error.
		</p>
		<p>
			<small
				>Each form is independent so you can copy whichever pattern you need. The page
				also defines a tiny <code>runValidators(value, ...validators)</code> helper plus a few
				composable rules — see the source.</small
			>
		</p>
	</Card>

	<!-- ========================================================
	  1) Sign-up form
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="person" size={20} /> 1. Sign-up — required, format &amp; cross-field
			</h2>
			<p style="margin: 0;">
				Errors appear after each field is blurred (<em>touched</em>), or all at once
				when you press Submit. Submit stays disabled until everything is valid; pressing it
				while invalid still shows a toast in case the disabled state isn't obvious.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<TextField
						label="Email"
						type="email"
						bind:value={su.email}
						placeholder="jane.doe@example.com"
						onblur={() => suTouch("email")}
					/>
					{#if suErr("email")}<small class="field-error">{suErr("email")}</small>{/if}
				</GridItem>
				<GridItem xs={12} md={6}>
					<TextField
						label="Password (min 8, must contain a digit)"
						type="password"
						bind:value={su.password}
						onblur={() => suTouch("password")}
					/>
					{#if suErr("password")}<small class="field-error">{suErr("password")}</small>{/if}
				</GridItem>
				<GridItem xs={12} md={6}>
					<TextField
						label="Confirm password"
						type="password"
						bind:value={su.confirmPassword}
						onblur={() => suTouch("confirmPassword")}
					/>
					{#if suErr("confirmPassword")}<small class="field-error">{suErr("confirmPassword")}</small>{/if}
				</GridItem>
				<GridItem xs={12} md={6} style="display: flex; align-items: flex-end;">
					<div>
						<Checkbox bind:checked={su.acceptTerms}>
							I accept the terms and privacy policy
						</Checkbox>
						{#if suErr("acceptTerms")}<small class="field-error">{suErr("acceptTerms")}</small>{/if}
					</div>
				</GridItem>
			</Grid>

			<Stack orientation="horizontal" gap="0.5rem">
				<Button appearance="accent" disabled={!suIsValid} onclick={onSuSubmit}>
					<Icon name="checkmark" size={16} /> Create account
				</Button>
				<Button appearance="outline" onclick={onSuReset}>
					<Icon name="dismiss" size={16} /> Reset
				</Button>
				{#if suSubmitted && !suIsValid}
					<Badge appearance="accent">{Object.values(suErrors).filter(Boolean).length} error(s)</Badge>
				{/if}
			</Stack>
		</Stack>
	</Card>

	<!-- ========================================================
	  2) Numeric range + custom rule
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="number_symbol" size={20} /> 2. Numeric range &amp; custom rule
			</h2>
			<p style="margin: 0;">
				Live validation as you type — once a field has been touched, the error
				updates on every change. Quantity demonstrates a custom rule: must be a
				<strong>positive even number</strong>.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<NumberField
						label="Age (18 – 120)"
						bind:value={age}
						min={18}
						max={120}
						onblur={() => (numTouched.age = true)}
					/>
					{#if ageErr()}<small class="field-error">{ageErr()}</small>{/if}
				</GridItem>
				<GridItem xs={12} md={6}>
					<NumberField
						label="Quantity (positive even number)"
						bind:value={quantity}
						min={2}
						step={2}
						onblur={() => (numTouched.quantity = true)}
					/>
					{#if quantityErr()}<small class="field-error">{quantityErr()}</small>{/if}
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  3) Async validation
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="cloud" size={20} /> 3. Async availability check (debounced)
			</h2>
			<p style="margin: 0;">
				Local rules run instantly; if they pass, an API call is simulated after
				<strong>600 ms</strong> of typing-pause. Try
				<code>admin</code>, <code>root</code>, <code>system</code>,
				<code>test</code>, or <code>anonymous</code> — they're already taken.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<TextField
						label="Username"
						bind:value={username}
						placeholder="3+ chars, letters/digits/underscore"
					/>
					{#if usernameStatus === "checking"}
						<small class="field-status">
							<Icon name="spinner_ios" size={16} /> Checking availability…
						</small>
					{:else if usernameStatus === "valid"}
						<small class="field-status ok">
							<Icon name="checkmark" size={16} /> "{username}" is available
						</small>
					{:else if usernameStatus === "invalid"}
						<small class="field-error">{usernameError}</small>
					{/if}
				</GridItem>
			</Grid>
		</Stack>
	</Card>

	<!-- ========================================================
	  4) Conditional required
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="branch" size={20} /> 4. Conditional required field
			</h2>
			<p style="margin: 0;">
				Selecting <strong>Other</strong> reveals a "Please specify" field that becomes
				required only in that case.
			</p>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<Select
						label="Department"
						bind:value={department}
						onchange={() => (condTouched.department = true)}
					>
						{#snippet children()}
							<Option value="">Select…</Option>
							<Option value="engineering">Engineering</Option>
							<Option value="sales">Sales</Option>
							<Option value="marketing">Marketing</Option>
							<Option value="finance">Finance</Option>
							<Option value="other">Other</Option>
						{/snippet}
					</Select>
					{#if deptErr()}<small class="field-error">{deptErr()}</small>{/if}
				</GridItem>
				{#if department === "other"}
					<GridItem xs={12} md={6}>
						<TextField
							label="Please specify"
							bind:value={otherDepartment}
							placeholder="e.g. Customer Success"
							onblur={() => (condTouched.otherDepartment = true)}
						/>
						{#if otherDeptErr()}<small class="field-error">{otherDeptErr()}</small>{/if}
					</GridItem>
				{/if}
			</Grid>

			<Stack orientation="horizontal" gap="0.5rem">
				<Button appearance="accent" onclick={onCondSubmit}>
					<Icon name="checkmark" size={16} /> Save
				</Button>
			</Stack>
		</Stack>
	</Card>

	<!-- ========================================================
	  5) Submit-time summary
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.75rem">
			<h2 style="margin: 0;">
				<Icon name="list" size={20} /> 5. Submit-time validation summary
			</h2>
			<p style="margin: 0;">
				No live validation — everything is checked on Submit. If anything fails, a
				summary panel lists all errors with clickable links that focus and scroll to
				the offending field.
			</p>

			{#if Object.keys(smErrors).length > 0}
				<div class="summary-panel">
					<strong>
						<Icon name="warning" size={16} />
						{Object.keys(smErrors).length} error(s) to fix:
					</strong>
					<ul>
						{#each Object.entries(smErrors) as [field, error]}
							<li>
								<a
									class="jump-link"
									href={"#sm-" + field}
									onclick={(e: Event) => {
										e.preventDefault()
										smJumpTo(field)
									}}
								>
									{smFieldLabels[field] ?? field}
								</a>
								— {error}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<div id="sm-fullName">
						<TextField label="Full name" bind:value={sm.fullName} />
						{#if smErrors.fullName}<small class="field-error">{smErrors.fullName}</small>{/if}
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-email">
						<TextField label="Email" type="email" bind:value={sm.email} />
						{#if smErrors.email}<small class="field-error">{smErrors.email}</small>{/if}
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-phone">
						<TextField label="Phone" bind:value={sm.phone} placeholder="+1 555 123 4567" />
						{#if smErrors.phone}<small class="field-error">{smErrors.phone}</small>{/if}
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-age">
						<NumberField label="Age (18+)" bind:value={sm.age} min={0} max={120} />
						{#if smErrors.age}<small class="field-error">{smErrors.age}</small>{/if}
					</div>
				</GridItem>
			</Grid>

			<Stack orientation="horizontal" gap="0.5rem">
				<Button appearance="accent" onclick={onSmSubmit}>
					<Icon name="send" size={16} /> Submit
				</Button>
				<Button appearance="outline" onclick={onSmReset}>
					<Icon name="dismiss" size={16} /> Reset
				</Button>
			</Stack>
		</Stack>
	</Card>

	<!-- ========================================================
	  Helpers reference
	  ======================================================== -->
	<Card>
		<Stack orientation="vertical" gap="0.5rem">
			<h2 style="margin: 0;">Validation helpers</h2>
			<p style="margin: 0;">
				The page uses a small composable validator pattern. Drop these into your project
				and chain them with <code>runValidators(value, ...rules)</code> — the first
				failing rule wins.
			</p>
			<Divider />
			<pre class="code"><code
					>{`type Validator<T> = (value: T) => string | null

const required = (msg = "Required") =>
  (v: unknown) => v === null || v === undefined || v === "" ? msg : null

const minLength = (n: number, msg?: string) =>
  (v: string) => (v ?? "").length < n
    ? (msg ?? \`Must be at least \${n} characters\`)
    : null

const pattern = (re: RegExp, msg = "Invalid format") =>
  (v: string) => v && !re.test(v) ? msg : null

const numberRange = (min: number, max: number, msg?: string) =>
  (v: number) => v < min || v > max
    ? (msg ?? \`Must be between \${min} and \${max}\`)
    : null

function runValidators<T>(value: T, ...validators: Validator<T>[]): string | null {
  for (const v of validators) {
    const r = v(value)
    if (r) return r
  }
  return null
}`}</code
				></pre>
		</Stack>
	</Card>
</Stack>

<style>
	.field-error {
		color: #c50f1f;
		font-size: 0.85rem;
		margin-top: 0.2rem;
		display: block;
	}
	.field-status {
		color: var(--neutral-foreground-rest, #424242);
		font-size: 0.85rem;
		margin-top: 0.2rem;
		display: block;
	}
	.field-status.ok {
		color: #107c10;
	}

	.summary-panel {
		background: rgba(197, 15, 31, 0.08);
		border-left: 3px solid #c50f1f;
		padding: 0.6rem 0.9rem;
		border-radius: 4px;
	}
	.summary-panel ul {
		margin: 0.4rem 0 0 1.1rem;
		padding: 0;
	}
	.summary-panel li {
		margin: 0.15rem 0;
	}
	.jump-link {
		color: #c50f1f;
		text-decoration: underline;
	}
	.jump-link:hover {
		text-decoration: none;
	}

	.code {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		padding: 0.75rem 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.85rem;
		line-height: 1.45;
	}
</style>
