import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import InputWithMask from "@/components/input-with-mask"

function AccountInformation() {
    const methods = useFormContext()
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-theme-green text-xl">{`Account Information`}</h1>

            <Controller
                name="account.holderName"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-name" className="text-muted-foreground">
                            {`Account Holder`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="account-holder-name" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.designation"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-designation" className="text-muted-foreground">
                            {`Designation and Licence #`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="account-holder-designation" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.organizationName"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-organization" className="text-muted-foreground">
                            {`Clinic / Organization`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="account-holder-organization" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.contactPerson"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-contactPerson" className="text-muted-foreground">
                            {`Contact Person`}
                        </FieldLabel>
                        <Input id="account-holder-contactPerson" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.phone"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-phone" className="text-muted-foreground">
                            {`Phone`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <InputWithMask field={{ ...field }} fieldState={{ ...fieldState }} id="account-holder-phone" />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.emailAddress"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-emailAddress" className="text-muted-foreground">
                            {`Email`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="account-holder-emailAddress" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="account.fax"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-fax" className="text-muted-foreground">
                            {`Fax`}
                        </FieldLabel>
                        <InputWithMask field={{ ...field }} fieldState={{ ...fieldState }} id="account-holder-fax" placeholder="Fax"/>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
        </div>
    )
}

export default AccountInformation