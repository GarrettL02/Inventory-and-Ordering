import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Modal } from '../../components/modal/Modal';
import {
  FormInputs,
  FormInputOption,
} from '../../components/form/FormInputProps';
import { SearchableSelect } from '../../components/formInputs/SearchableSelect';
import { GeneralButton } from '../../components/buttons/generalButton/GeneralButton';
import { CancelButton } from '../../components/buttons/cancelButton/CancelButton';
import { AddNewPartFormData } from '../types/Part';
import { useAddNewPart } from '../hooks/useAddNewPart';

const FORM_ID = 'add-new-part-form';

export interface AddNewPartFormProps {
  onClose: () => void;
  // Called after the part was saved, so the page can refresh its table
  onCreated?: () => void;
  // Dropdown choices. Pass these in from the parent once the backend has
  // endpoints that list storage locations / categories.
  storageLocations?: FormInputOption[];
  categories?: FormInputOption[];
}

// Empty select -> null, otherwise a number (select values come back as strings)
const toIdOrNull = (value: unknown) =>
  value === '' || value === null || value === undefined ? null : Number(value);

const FieldError = ({ message }: { message?: string }) =>
  message ? <span style={{ color: '#ff6b6b' }}>{message}</span> : null;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        gridColumn: 'span 2',
        fontSize: '13px',
        fontWeight: 700,
        color: '#c9c9c9',
        borderBottom: '1px solid #4a4a4a',
        paddingBottom: '4px',
        marginTop: '8px',
      }}
    >
      {children}
    </div>
  );
}

export function AddNewPartForm({
  onClose,
  onCreated,
  storageLocations = [],
  categories = [],
}: AddNewPartFormProps) {
  const { addNewPart, loading: saving, error: submitError } = useAddNewPart();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddNewPartFormData>({
    defaultValues: {
      name: '',
      description: '',
      comment: '',
      averagePrice: '',
      partURL: '',
      manufacturerName: '',
      manufacturerPartNumber: '',
      stockLevel: 0,
      minStockLevel: 0,
      categoryId: null,
      storageLocationId: null,
    },
  });

  const onSubmit: SubmitHandler<AddNewPartFormData> = async (data) => {
    const created = await addNewPart(data);
    // null means it failed - stay open with what the user typed, the hook has the error
    if (!created) return;

    reset();
    onCreated?.();
    onClose();
  };

  return (
    <Modal
      modalTitle="Add New Part"
      onClose={onClose}
      footer={
        <>
          <CancelButton onClick={onClose} />
          <GeneralButton
            type="submit"
            form={FORM_ID}
            buttonText={saving ? 'Saving...' : 'Add Part'}
            disabled={saving}
          />
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
          paddingInline: '10px',
          boxSizing: 'border-box',
        }}
      >
        {submitError && (
          <div
            role="alert"
            style={{
              gridColumn: 'span 2',
              color: '#ff6b6b',
              border: '1px solid #4f0000',
              borderRadius: '5px',
              padding: '8px',
              fontSize: '12px',
            }}
          >
            {submitError}
          </div>
        )}

        {/* ---------- Essentials ---------- */}
        <SectionTitle>Basics</SectionTitle>
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            label="Part Name"
            required
            inputWidth={90}
            inputParams={{
              ...register('name', {
                required: 'Part name is required',
                setValueAs: (v: string) => v.trim(),
              }),
            }}
            inputErrors={<FieldError message={errors.name?.message} />}
          />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            label="Description"
            required
            inputType="textarea"
            inputWidth={90}
            inputHeight={70}
            inputParams={{
              ...register('description', {
                required: 'Part description is required',
                maxLength: { value: 255, message: 'Max 255 characters' },
              }),
            }}
            inputErrors={<FieldError message={errors.description?.message} />}
          />
        </div>

        {/* ---------- Stock ---------- */}
        <SectionTitle>Stock</SectionTitle>
        <FormInputs
          label="Starting Stock"
          required
          inputType="number"
          min={0}
          step={1}
          inputWidth={40}
          inputParams={{
            ...register('stockLevel', {
              valueAsNumber: true,
              required: 'Starting stock is required',
              min: { value: 0, message: 'Cannot be negative' },
              validate: (v) => Number.isInteger(v) || 'Must be a whole number',
            }),
          }}
          inputErrors={<FieldError message={errors.stockLevel?.message} />}
        />
        <FormInputs
          label="Minimum Stock (low-stock alert level)"
          required
          inputType="number"
          min={0}
          step={1}
          inputWidth={40}
          inputParams={{
            ...register('minStockLevel', {
              valueAsNumber: true,
              required: 'Minimum stock is required',
              min: { value: 0, message: 'Cannot be negative' },
              validate: (v) => Number.isInteger(v) || 'Must be a whole number',
            }),
          }}
          inputErrors={<FieldError message={errors.minStockLevel?.message} />}
        />
        {/* Type to filter the locations. Controller connects it to the form,
            since it isn't a plain <input> that register() can attach to */}
        <Controller
          name="storageLocationId"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              label="Storage Location"
              options={storageLocations}
              placeholderOption="Not set"
              inputWidth={90}
              value={field.value}
              onChange={field.onChange}
              required={true}
            />
          )}
        />
        <FormInputs
          label="Category"
          inputType="select"
          options={categories}
          placeholderOption="None"
          inputWidth={90}
          inputParams={{
            ...register('categoryId', { setValueAs: toIdOrNull }),
          }}
        />

        {/* ---------- Optional details ---------- */}
        <SectionTitle>Part Details</SectionTitle>
        <FormInputs
          label="Manufacturer Name"
          required
          inputWidth={90}
          inputParams={{
            ...register('manufacturerName', {
              required: 'Manufacturer name is required',
            }),
          }}
          inputErrors={
            <FieldError message={errors.manufacturerName?.message} />
          }
        />
        <FormInputs
          label="Manufacturer Part Number (also used as internal part number)"
          required
          inputWidth={90}
          inputParams={{
            ...register('manufacturerPartNumber', {
              required: 'Manufacturer part number is required',
            }),
          }}
          inputErrors={
            <FieldError message={errors.manufacturerPartNumber?.message} />
          }
        />
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            label="Product URL"
            required
            inputWidth={90}
            inputParams={{
              ...register('partURL', {
                required: 'Product URL is required',
                pattern: {
                  value: /^https?:\/\/\S+$/i,
                  message: 'Must start with http:// or https://',
                },
              }),
            }}
            inputErrors={<FieldError message={errors.partURL?.message} />}
          />
        </div>
        <FormInputs
          label="Price (each, optional)"
          inputType="number"
          min={0}
          step="any"
          inputWidth={40}
          inputParams={{
            ...register('averagePrice', {
              min: { value: 0, message: 'Cannot be negative' },
            }),
          }}
          inputErrors={<FieldError message={errors.averagePrice?.message} />}
        />
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            label="Comments"
            inputType="textarea"
            inputWidth={90}
            inputHeight={60}
            inputParams={{ ...register('comment') }}
          />
        </div>
      </form>
    </Modal>
  );
}
