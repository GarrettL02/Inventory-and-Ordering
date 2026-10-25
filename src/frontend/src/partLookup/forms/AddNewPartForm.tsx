import { Dispatch, SetStateAction, useEffect } from 'react';
import { Modal } from '../../components/modal/Modal';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormInputs } from '../../components/form/FormInputProps';
import { AddNewPartFormData } from '../types/Part';

export interface AddNewPartFormProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddNewPartForm({ isOpen, setIsOpen }: AddNewPartFormProps) {
  const nav = useNavigate();

  //scroll page to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register,
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

  // Form submit handler
  const onSubmit: SubmitHandler<AddNewPartFormData> = (data) => {
    console.log('Submitting Part Request:', data);
    reset(); // Clear the form
    setIsOpen(false);
  };

  return isOpen ? (
    <Modal modalTitle="Add New Part">
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '16px',
          paddingInline: '10px',
        }}
      >
        <FormInputs
          label={'Part Name'}
          inputParams={{
            ...register('name', { required: 'Part name is required' }),
          }}
          inputErrors={
            errors.name && (
              <span style={{ color: 'red' }}>{errors.name.message}</span>
            )
          }
        />
        <FormInputs
          label={'Price'}
          inputType="number"
          inputParams={{
            ...register('averagePrice', {
              required: 'Part price is required',
            }),
          }}
          inputErrors={
            errors.averagePrice && (
              <span style={{ color: 'red' }}>
                {errors.averagePrice.message}
              </span>
            )
          }
        />
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            inputType="textarea"
            label={'Description'}
            inputParams={{
              ...register('description', {
                required: 'Part description is required',
              }),
            }}
            inputWidth={90}
            inputHeight={100}
            inputErrors={
              errors.description && (
                <span style={{ color: 'red' }}>
                  {errors.description.message}
                </span>
              )
            }
          />
        </div>
        <div style={{ gridColumn: 'span 2', marginBottom: '30px' }}>
          <FormInputs
            inputType="textarea"
            label={'Comments'}
            inputParams={{
              ...register('comment'),
            }}
            inputWidth={90}
            inputHeight={100}
          />
        </div>
        <FormInputs
          label={'Category'}
          inputParams={{ ...register('categoryId') }}
        />
        <FormInputs
          label={'Storage Location'}
          inputParams={{ ...register('storageLocationId') }}
        />
        <FormInputs
          label={'Manufacturer Name'}
          inputParams={{
            ...register('manufacturerName', {
              required: 'Manufacturer name is required',
            }),
          }}
          inputErrors={
            errors.manufacturerName && (
              <span style={{ color: 'red' }}>
                {errors.manufacturerName.message}
              </span>
            )
          }
        />
        <FormInputs
          label={'Manufacturer Part Number'}
          inputParams={{
            ...register('manufacturerPartNumber', {
              required: 'Manufacturer part number is required',
            }),
          }}
          inputErrors={
            errors.manufacturerPartNumber && (
              <span style={{ color: 'red' }}>
                {errors.manufacturerPartNumber.message}
              </span>
            )
          }
        />
        <div style={{ gridColumn: 'span 2' }}>
          <FormInputs
            label={'Manufacturer URL'}
            inputParams={{
              ...register('partURL', {
                required: 'Manufacturer URL is required',
              }),
            }}
            inputWidth={90}
            inputErrors={
              errors.partURL && (
                <span style={{ color: 'red' }}>{errors.partURL.message}</span>
              )
            }
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '17px',
            marginTop: '24px',
            boxSizing: 'border-box',
            gridColumn: 'span 2',
          }}
        >
          <button
            type="button"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: '#676767',
            }}
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '5px',
              cursor: 'pointer',
              borderRadius: '7px',
              backgroundColor: '#3b0000',
              border: '1px solid #a3a3a3',
              color: '#bab9b9',
              paddingInline: '5px',
            }}
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  ) : (
    <></>
  );
}
