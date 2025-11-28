import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Fragment } from "react/jsx-runtime"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from "react"
import InputWithMask from "@/components/input-with-mask"

const provinces = [
    { label: "Alberta", value: "alberta" },
    { label: "British Columbia", value: "british_columbia" },
    { label: "Manitoba", value: "manitoba" },
    { label: "New Brunswick", value: "new_brunswick" },
    { label: "Newfoundland and Labrador", value: "newfoundland_and_labrador" },
    { label: "Nova Scotia", value: "nova_scotia" },
    { label: "Ontario", value: "ontario" },
    { label: "Prince Edward Island", value: "prince_edward_island" },
    { label: "Quebec", value: "quebec" },
    { label: "Saskatchewan", value: "saskatchewan" },
];

const addressFields: Array<any> = [
    "addressLine1",
    "addressLine2",
    "city",
    "province",
    "postalCode",
];

function Address() {
    const methods = useFormContext()

    const isSameAsBilling = methods.watch("account.shippingSameAsBilling");
    const billingAddress = methods.watch("billingAddress");


    useEffect(() => {
        if (!isSameAsBilling) {
            return;
        }

        methods.clearErrors("shippingAddress");

        const normalizedBilling = addressFields.reduce<Record<string, string>>((acc, field) => {
            acc[field] = billingAddress?.[field] ?? "";
            return acc;
        }, {});

        const currentShipping = methods.getValues("shippingAddress") ?? {};
        const hasDifference = addressFields.some((field) => {
            const shippingValue = currentShipping?.[field] ?? "";
            return normalizedBilling[field] !== shippingValue;
        });

        if (!hasDifference) {
            return;
        }

        methods.setValue("shippingAddress", normalizedBilling, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
        });
    }, [isSameAsBilling, billingAddress]);

    return (
        <Fragment>
            <div className="flex flex-col gap-3">
                <h1 className="text-theme-green text-xl">{`Billing Address Information`}</h1>
                <Controller
                    name="billingAddress.addressLine1"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="address-line-1" className="text-muted-foreground">
                                {`Address Line 1`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Input aria-invalid={fieldState.invalid} id="address-line-1" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="billingAddress.addressLine2"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="address-line-2" className="text-muted-foreground">
                                {`Address Line 2`}
                            </FieldLabel>
                            <Input id="address-line-2" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="billingAddress.city"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="address-city" className="text-muted-foreground">
                                {`City`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Input aria-invalid={fieldState.invalid} id="address-city" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="billingAddress.province"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="address-province" className="text-muted-foreground">
                                {`Province`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Select defaultValue={field.value} value={field.value} onValueChange={(v) => { if (v) field.onChange(v) }}>
                                <SelectTrigger
                                    size="default"
                                    className={cn("")}
                                    aria-invalid={fieldState.invalid}
                                    id="shipping-address-province"
                                    disabled={field.disabled}
                                >
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem
                                            key={province.value}
                                            value={province.value}
                                        >
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="billingAddress.postalCode"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="address-postalCode" className="text-muted-foreground">
                                {`Postal Code`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <InputWithMask
                                mask={"*** ***"}
                                definitions={{
                                    "*": /[A-Za-z0-9]/,
                                }}
                                field={{ ...field }}
                                fieldState={{ ...fieldState }}
                                id="address-postalCode"
                                placeholder="Postal Code" />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="account.shippingSameAsBilling"
                    control={methods.control}
                    render={({ field, fieldState: __ }) => (
                        <Field orientation="horizontal">
                            <Checkbox
                                id="checkout-same-as-shipping"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <FieldLabel
                                htmlFor="checkout-same-as-shipping"
                                className="font-normal text-lg"
                            >
                                Shipping address is the same as billing address
                            </FieldLabel>
                        </Field>
                    )}
                />
            </div>

            {!isSameAsBilling && <div className="flex flex-col gap-3">
                <h1 className="text-theme-green text-xl">{`Shipping Address Information`}</h1>
                <Controller
                    name="shippingAddress.addressLine1"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="shipping-address-line-1" className="text-muted-foreground">
                                {`Address Line 1`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Input id="shipping-address-line-1" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="shippingAddress.addressLine2"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="shipping-address-line-2" className="text-muted-foreground">
                                {`Address Line 2`}
                            </FieldLabel>
                            <Input id="shipping-address-line-2" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="shippingAddress.city"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="shipping-address-city" className="text-muted-foreground">
                                {`City`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Input id="shipping-address-city" autoComplete="off" {...field} />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="shippingAddress.province"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="shipping-address-province" className="text-muted-foreground">
                                {`Province`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <Select value={field.value} onValueChange={(v) => { if (v) field.onChange(v) }}>
                                <SelectTrigger
                                    size="default"
                                    className={cn("")}
                                    aria-invalid={fieldState.invalid}
                                    id="shipping-address-province"
                                    disabled={field.disabled}
                                >
                                    <SelectValue placeholder="Select Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((province) => (
                                        <SelectItem
                                            key={province.value}
                                            value={province.value}
                                        >
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="shippingAddress.postalCode"
                    control={methods.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="grid grid-cols-2 gap-2">
                            <FieldLabel htmlFor="shipping-address-postalCode" className="text-muted-foreground">
                                {`Postal Code`}<span className="text-destructive">{`*`}</span>
                            </FieldLabel>
                            <InputWithMask
                                mask={"*** ***"}
                                definitions={{
                                    "*": /[A-Za-z0-9]/,
                                }}
                                field={{ ...field }}
                                fieldState={{ ...fieldState }}
                                id="shipping-address-postalCode"
                                placeholder="Postal Code" />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </div>}
        </Fragment>
    )
}

export default Address