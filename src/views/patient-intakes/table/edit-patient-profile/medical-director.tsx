import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

function MedicalDirector() {
    const methods = useFormContext()

    const isAlsoMedicalDirector = methods.watch('medical_directors.isAlsoMedicalDirector')
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-theme-green text-xl">{`Medical Director Information`}</h1>

            <Controller
                name="medical_directors.isAlsoMedicalDirector"
                control={methods.control}
                render={({ field, fieldState }) => {
                    const value = field.value ? "yes" : "no"
                    return (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="single-person-application" className="text-muted-foreground">
                                {`Single Person Application`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Select value={value} onValueChange={(v) => {
                                if (v) { field.onChange(v === 'yes') }
                            }}>
                                <SelectTrigger className={cn("text-foreground")}>
                                    <SelectValue placeholder="Single Person Application" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )
                }}
            />

            <Controller
                name="medical_directors.name"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="medical-director-name" className="text-muted-foreground">
                            {`Director Name`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="medical-director-name" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Controller
                name="medical_directors.licenseNo"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="medical-director-license" className="text-muted-foreground">
                            {`License`} {isAlsoMedicalDirector && <span className="text-destructive">{`*`}</span>}
                        </FieldLabel>
                        <Input id="medical-director-license" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {!isAlsoMedicalDirector && <Controller
                name="medical_directors.email"
                control={methods.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                        <FieldLabel htmlFor="medical-director-email" className="text-muted-foreground">
                            {`Medical Director's Email`}<span className="text-destructive">{`*`}</span>
                        </FieldLabel>
                        <Input aria-invalid={fieldState.invalid} id="medical-director-email" autoComplete="off" {...field} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />}
        </div>
    )
}

export default MedicalDirector