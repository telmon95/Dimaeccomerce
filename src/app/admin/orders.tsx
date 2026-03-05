import {
  Datagrid,
  DateField,
  Edit,
  EditButton,
  FunctionField,
  List,
  NumberField,
  SelectInput,
  SimpleForm,
  TextField,
} from 'react-admin';

const formatItems = (items?: Array<{ name: string; quantity: number }>) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  return items.map((item) => `${item.name} × ${item.quantity}`).join(', ');
};

export const OrderList = () => (
  <List>
    <Datagrid>
      <FunctionField
        label="Order ID"
        render={(record) => record.order_id ?? record.id ?? '—'}
      />
      <TextField source="customer_name" label="Customer" />
      <TextField source="email" />
      <TextField source="address" />
      <TextField source="city" />
      <TextField source="state" />
      <TextField source="zip" label="Postal" />
      <TextField source="product_id" />
      <NumberField source="quantity" />
      <NumberField source="total_price" />
      <TextField source="order_status" />
      <TextField source="payment_status" />
      <FunctionField
        label="Items"
        render={(record) => formatItems(record.items)}
      />
      <DateField source="created_at" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

export const OrderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextField source="order_id" label="Order ID" />
      <TextField source="customer_name" label="Customer" />
      <TextField source="email" />
      <TextField source="product_id" />
      <NumberField source="quantity" />
      <NumberField source="total_price" />
      <SelectInput
        source="order_status"
        choices={[
          { id: 'new', name: 'New' },
          { id: 'paid', name: 'Paid' },
          { id: 'shipped', name: 'Shipped' },
          { id: 'completed', name: 'Completed' },
        ]}
      />
      <SelectInput
        source="payment_status"
        choices={[
          { id: 'pending', name: 'Pending' },
          { id: 'paid', name: 'Paid' },
          { id: 'failed', name: 'Failed' },
        ]}
      />
    </SimpleForm>
  </Edit>
);
