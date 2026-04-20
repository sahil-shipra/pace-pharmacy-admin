import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function KrollReport() {
    const methods = useFormContext()
    return (
        <Controller
            name="kroll_status.status"
            control={methods.control}
            render={({ field, fieldState }) => {
                return (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="account-holder-organization" className="text-muted-foreground">
                            {`Kroll Status`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger
                                id="clinic-type"
                                aria-invalid={fieldState.invalid}
                                className="h-12"
                            >
                                <SelectValue placeholder="Update Kroll status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="complete">Complete</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                );
            }}
        />
    )
}

export default KrollReport