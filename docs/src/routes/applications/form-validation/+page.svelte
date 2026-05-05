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
		Field,
		ValidationSummary,
		type ValidationState,
		toast
	} from "svelte-fluentui"

	// Map an error string (or null) to a ValidationState for <Field>
	function stateOf(error: string | null | undefined): ValidationState {
		return error ? "error" : "none"
	}

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
			Common validation patterns built with svelte-fluentui's
			<code>&lt;Field&gt;</code> wrapper (label + hint + validation message + state border)
			and <code>&lt;ValidationSummary&gt;</code> (top-of-form error list with
			jump-to-field links). Each form is independent so you can copy whichever pattern
			you need.
		</p>
		<p>
			<strong>Patterns covered:</strong> required &amp; format · cross-field
			(passwords match) · numeric range · async availability check ·
			conditional required · submit-time summary with jump-to-error.
		</p>
		<p>
			<small
				>The page also defines a tiny <code>runValidators(value, ...validators)</code>
				helper plus a few composable rules — see the source.</small
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
					<Field
						label="Email"
						required
						validationState={stateOf(suErr("email"))}
						validationMessage={suErr("email") ?? undefined}
					>
						<TextField
							type="email"
							bind:value={su.email}
							placeholder="jane.doe@example.com"
							onblur={() => suTouch("email")}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6}>
					<Field
						label="Password"
						required
						hint="Min 8 characters, must contain a digit"
						validationState={stateOf(suErr("password"))}
						validationMessage={suErr("password") ?? undefined}
					>
						<TextField
							type="password"
							bind:value={su.password}
							onblur={() => suTouch("password")}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6}>
					<Field
						label="Confirm password"
						required
						validationState={stateOf(suErr("confirmPassword"))}
						validationMessage={suErr("confirmPassword") ?? undefined}
					>
						<TextField
							type="password"
							bind:value={su.confirmPassword}
							onblur={() => suTouch("confirmPassword")}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6} style="display: flex; align-items: flex-end;">
					<Field
						validationState={stateOf(suErr("acceptTerms"))}
						validationMessage={suErr("acceptTerms") ?? undefined}
					>
						<Checkbox bind:checked={su.acceptTerms}>
							I accept the terms and privacy policy
						</Checkbox>
					</Field>
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
					<Field
						label="Age"
						hint="Between 18 and 120"
						validationState={stateOf(ageErr())}
						validationMessage={ageErr() ?? undefined}
					>
						<NumberField
							bind:value={age}
							min={18}
							max={120}
							onblur={() => (numTouched.age = true)}
						/>
					</Field>
				</GridItem>
				<GridItem xs={12} md={6}>
					<Field
						label="Quantity"
						hint="Must be a positive even number"
						validationState={stateOf(quantityErr())}
						validationMessage={quantityErr() ?? undefined}
					>
						<NumberField
							bind:value={quantity}
							min={2}
							step={2}
							onblur={() => (numTouched.quantity = true)}
						/>
					</Field>
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
					<Field
						label="Username"
						hint={usernameStatus === "checking"
							? "Checking availability…"
							: undefined}
						validationState={usernameStatus === "invalid"
							? "error"
							: usernameStatus === "valid"
								? "success"
								: "none"}
						validationMessage={usernameStatus === "invalid"
							? (usernameError ?? undefined)
							: usernameStatus === "valid"
								? `"${username}" is available`
								: undefined}
					>
						<TextField
							bind:value={username}
							placeholder="3+ chars, letters/digits/underscore"
						/>
					</Field>
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
					<Field
						label="Department"
						required
						validationState={stateOf(deptErr())}
						validationMessage={deptErr() ?? undefined}
					>
						<Select
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
					</Field>
				</GridItem>
				{#if department === "other"}
					<GridItem xs={12} md={6}>
						<Field
							label="Please specify"
							required
							validationState={stateOf(otherDeptErr())}
							validationMessage={otherDeptErr() ?? undefined}
						>
							<TextField
								bind:value={otherDepartment}
								placeholder="e.g. Customer Success"
								onblur={() => (condTouched.otherDepartment = true)}
							/>
						</Field>
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

			<ValidationSummary
				errors={smErrors}
				labels={smFieldLabels}
				onjumpto={smJumpTo}
			/>

			<Grid spacing={3}>
				<GridItem xs={12} md={6}>
					<div id="sm-fullName">
						<Field
							label="Full name"
							required
							validationState={stateOf(smErrors.fullName)}
							validationMessage={smErrors.fullName}
						>
							<TextField bind:value={sm.fullName} />
						</Field>
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-email">
						<Field
							label="Email"
							required
							validationState={stateOf(smErrors.email)}
							validationMessage={smErrors.email}
						>
							<TextField type="email" bind:value={sm.email} />
						</Field>
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-phone">
						<Field
							label="Phone"
							required
							validationState={stateOf(smErrors.phone)}
							validationMessage={smErrors.phone}
						>
							<TextField bind:value={sm.phone} placeholder="+1 555 123 4567" />
						</Field>
					</div>
				</GridItem>
				<GridItem xs={12} md={6}>
					<div id="sm-age">
						<Field
							label="Age"
							required
							hint="Must be 18 or older"
							validationState={stateOf(smErrors.age)}
							validationMessage={smErrors.age}
						>
							<NumberField bind:value={sm.age} min={0} max={120} />
						</Field>
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
	.code {
		background: var(--neutral-fill-secondary-rest, #f5f5f5);
		padding: 0.75rem 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.85rem;
		line-height: 1.45;
	}
</style>
