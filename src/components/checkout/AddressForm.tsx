import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addressSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name cannot exceed 50 characters"),
  street: z.string().min(5, "Please enter a valid street address").max(100, "Address is too long"),
  apt: z.string().optional(),
  city: z.string().min(2, "Please enter a valid city").max(50, "City name is too long"),
  state: z.string().min(2, "Please enter a valid state/region").max(50, "State/region name is too long"),
  postalCode: z.string().min(4, "Please enter a valid postal code").max(10, "Postal code is too long")
    .refine(val => /^[0-9A-Za-z\s-]{4,10}$/.test(val), { message: "Postal code must be 4-10 alphanumeric characters" }),
  country: z.string().min(2, "Please enter a valid country").max(50, "Country name is too long"),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit?: (data: AddressFormData) => void;
  onCancel?: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const handleFormSubmit = (data: AddressFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      alert("Address saved!\n" + JSON.stringify(data, null, 2));
    }
    reset();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    reset();
  };
  const inputClasses = (error: boolean) => 
    `w-full bg-black border ${error ? 'border-[#f63030]' : 'border-gray-800'} rounded px-3 py-2 text-white focus:outline-none focus:border-gray-600`;
  const labelClasses = "block text-gray-300 mb-1";
  const errorClasses = "text-[#f63030] text-xs mt-1";
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-6 flex flex-col gap-5 mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className={labelClasses}>First Name</label>
          <input {...register("firstName")}
            className={inputClasses(!!errors.firstName)} />
          {errors.firstName && <span className={errorClasses}>{errors.firstName.message}</span>}
        </div>
        <div className="flex-1">
          <label className={labelClasses}>Last Name</label>
          <input {...register("lastName")}
            className={inputClasses(!!errors.lastName)} />
          {errors.lastName && <span className={errorClasses}>{errors.lastName.message}</span>}
        </div>
      </div>
      <div>
        <label className={labelClasses}>Street Address</label>
        <input {...register("street")}
          className={inputClasses(!!errors.street)} />
        {errors.street && <span className={errorClasses}>{errors.street.message}</span>}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className={labelClasses}>Apt Number</label>
          <input {...register("apt")}
            className={inputClasses(!!errors.apt)} />
        </div>
        <div className="flex-1">
          <label className={labelClasses}>City</label>
          <input {...register("city")}
            className={inputClasses(!!errors.city)} />
          {errors.city && <span className={errorClasses}>{errors.city.message}</span>}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className={labelClasses}>State</label>
          <input {...register("state")}
            className={inputClasses(!!errors.state)} />
          {errors.state && <span className={errorClasses}>{errors.state.message}</span>}
        </div>
        <div className="flex-1">
          <label className={labelClasses}>Postal Code</label>
          <input {...register("postalCode")}
            className={inputClasses(!!errors.postalCode)} />
          {errors.postalCode && <span className={errorClasses}>{errors.postalCode.message}</span>}
        </div>
        <div className="flex-1">
          <label className={labelClasses}>Country</label>
          <input {...register("country")}
            className={inputClasses(!!errors.country)} />
          {errors.country && <span className={errorClasses}>{errors.country.message}</span>}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button type="button" className="text-gray-400 hover:text-white transition-colors" onClick={handleCancel}>Cancel</button>
        <button 
          type="submit" 
          className="bg-white text-black hover:bg-[#f63030] hover:text-white px-6 py-2 transition-colors"
        >
          Save Address
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
