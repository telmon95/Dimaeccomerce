import {
  ArrayInput,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  Edit,
  EditButton,
  ImageField,
  ImageInput,
  List,
  NumberField,
  NumberInput,
  SimpleForm,
  SimpleFormIterator,
  TextField,
  TextInput,
} from 'react-admin';
import { supabase } from '../lib/supabaseClient';

const uploadImage = async (file: File) => {
  const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
  const path = `products/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
};

const transformProduct = async (data: any) => {
  if (data.image_file?.rawFile) {
    const imageUrl = await uploadImage(data.image_file.rawFile);
    data.image_url = imageUrl;
  }

  delete data.image_file;
  return data;
};

export const ProductList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ImageField source="image_url" label="Image" />
      <TextField source="name" />
      <TextField source="category" />
      <NumberField source="price" />
      <BooleanField source="is_special" />
      <BooleanField source="is_active" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ProductCreate = () => (
  <Create transform={transformProduct}>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="description" fullWidth multiline />
      <NumberInput source="price" />
      <TextInput source="category" />
      <BooleanInput source="is_special" />
      <BooleanInput source="is_active" defaultValue />
      <ArrayInput source="benefits">
        <SimpleFormIterator>
          <TextInput label="Benefit" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="image_url" fullWidth />
      <ImageInput source="image_file" label="Upload Image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

export const ProductEdit = () => (
  <Edit transform={transformProduct}>
    <SimpleForm>
      <TextInput source="name" fullWidth />
      <TextInput source="description" fullWidth multiline />
      <NumberInput source="price" />
      <TextInput source="category" />
      <BooleanInput source="is_special" />
      <BooleanInput source="is_active" />
      <ArrayInput source="benefits">
        <SimpleFormIterator>
          <TextInput label="Benefit" />
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="image_url" fullWidth />
      <ImageInput source="image_file" label="Upload Image" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);
