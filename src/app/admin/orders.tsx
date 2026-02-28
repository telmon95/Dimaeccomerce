import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  NumberField,
  TextField,
} from 'react-admin';

const formatItems = (items?: Array<{ name: string; quantity: number }>) => {
  if (!Array.isArray(items) || items.length === 0) return '—';
  return items.map((item) => `${item.name} × ${item.quantity}`).join(', ');
};

export const OrderList = () => (
  <List>
    <Datagrid>
      <TextField source="customer_name" label="Customer" />
      <TextField source="email" />
      <TextField source="address" />
      <TextField source="city" />
      <TextField source="state" />
      <TextField source="zip" label="Postal" />
      <NumberField source="total" />
      <TextField source="status" />
      <FunctionField
        label="Items"
        render={(record) => formatItems(record.items)}
      />
      <DateField source="created_at" showTime />
    </Datagrid>
  </List>
);
